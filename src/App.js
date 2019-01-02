import React, { Component, Fragment } from 'react';
import styled, { createGlobalStyle, ThemeProvider } from 'styled-components';
import { LioWebRTC } from 'react-liowebrtc';
import Pong from './components/Pong';
import StartScreen from './components/StartScreen';
import './App.css';

const theme = {
  fontColor: 'white',
  ballLeft: (window.innerWidth / 2) - 15,
  ballBottom: window.innerHeight - 300,
  backgroundColor: '#282c34',
  paddleWidth: 200,
};

const GlobalStyle = createGlobalStyle`
  html {
    box-sizing: border-box;
  }

  body: {
    height: 100vh;
    width: 100vw;
    overflow: hidden;
    font-family: Consolas;
  }

  * {
    box-sizing: inherit;
  }

`;

const Container = styled.div`
  height: 100vh;
  width: 100vw;
  overflow: hidden;
  background: ${({theme}) => theme.backgroundColor};
`;

const lioWebRTCOptions = {
  debug: true,
  dataOnly: true
};

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      roomName: null,
      ballPosition: null,
      ballVector: { x: 0, y: -10 },
      renderBall: false,
      startGame: false,
      waitingForPlayer: false,
      firstPlayer: true
    };
  }

  handleJoin = (roomName) => {
    this.setState({ startGame: true, roomName });
  }

  handlePeerData = (webrtc, type, payload, peer) => {
    switch (type) {
      case 'crossSeparator':
        const { ballPosition, ballVector } = payload;
        const newBallPosition = { ...ballPosition, x: window.innerWidth - ballPosition.x };
        const newBallVector = { ...ballVector, x:  -ballVector.x, y: -ballVector.y };
        console.log('NEW VECTOR', newBallVector);
        this.setState({ ballPosition: newBallPosition, ballVector: newBallVector, renderBall: true });
        break;
      default:
        break;
    }
  }

  handleMoveBall = (vector) => {
    const { ballLeft, ballBottom } = this.state;
    this.setState({ theme: { ballLeft: ballLeft + vector.x, ballBottom: ballBottom + vector.y } });
  }

  handleCrossSeparator = () => this.setState({ renderBall: false });

  handleSetBallVector = (vector) => this.setState({ ballVector: vector });

  handleReadyToJoin = (webrtc) => webrtc.joinRoom(this.state.roomName);

  handleJoined = (webrtc) => {
    webrtc.getClients((err, clients) => {
      const count = Object.keys(clients).length;
      if (count === 1) {
        this.setState({ waitingForPlayer: true });
      }
      if (count > 1) {
        this.setState({ firstPlayer: false });
      }
    });
  }

  readyToPlay = (webrtc) => {
    const { firstPlayer } = this.state;
    this.setState({ waitingForPlayer: false, renderBall: firstPlayer });
  }

  render() {
    const { ballPosition, ballVector, renderBall, startGame, waitingForPlayer } = this.state;
    return (
      <ThemeProvider theme={theme}>
        <Fragment>
          <GlobalStyle />
            <Container>
                {
                  startGame ?
                  <LioWebRTC
                    options={lioWebRTCOptions}
                    onReceivedPeerData={this.handlePeerData}
                    onReady={this.handleReadyToJoin}
                    onJoinedRoom={this.handleJoined}
                    onChannelOpen={this.readyToPlay}
                  >
                    <Pong
                      ballPosition={{
                      x: ballPosition ? ballPosition : theme.ballLeft,
                      y: ballPosition ? ballPosition : theme.ballBottom
                      }}
                      ballVector={ballVector}
                      renderBall={renderBall}
                      onCrossSeparator={this.handleCrossSeparator}
                      setBallVector={this.handleSetBallVector}
                      onReadyJoinRoom={this.handleJoin}
                      waitingForPlayer={waitingForPlayer}
                    />
                  </LioWebRTC>
                  :
                  <StartScreen onJoinRoom={this.handleJoin} />
                }
            </Container>
        </Fragment>
      </ThemeProvider>
    );
  }
}

export default App;
