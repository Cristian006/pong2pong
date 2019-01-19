import React, { Component, Fragment } from 'react';
import styled, { createGlobalStyle, ThemeProvider } from 'styled-components';
import { LioWebRTC } from 'react-liowebrtc';
import Pong from './components/Pong';
import StartScreen from './components/StartScreen';
import { getFontColor } from './utils';
import { hitPaddleSound, scoreSound } from './utils/sound';

const theme = {
  fontColor: '#ffffff',
  ballLeft: (window.innerWidth / 2) - 15,
  ballBottom: window.innerHeight - 300,
  backgroundColor: '#282c34',
  paddleWidth: window.innerWidth < 500 ? 75 : 200,
};

const GlobalStyle = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css?family=Staatliches');
  html {
    box-sizing: border-box;
    font-family: 'Staatliches', monospace;
    margin: 0;
    padding: 0;
  }

  body {
    margin: 0;
    padding: 0;
    height: ${navigator.platform === 'iPhone' ? '88vh' : '100vh'};
    position: fixed;
    width: 100vw;
    overflow: hidden;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  code {
    font-family: source-code-pro, Menlo, Monaco, Consolas, "Courier New", monospace;
  }

  *,
  *::before,
  *::after {
    box-sizing: inherit;
    font-family: inherit;
  }

`;

const Container = styled.div`
  height: 100vh;
  width: 100vw;
  overflow: hidden;
  color: ${({fontColor}) => fontColor};
  background: ${({bgColor}) => bgColor};
`;

const lioWebRTCOptions = {
  debug: true,
  dataOnly: true
};

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bgColor: '#282c34',
      fontColor: '#fff',
      roomName: null,
      ballPosition: null,
      ballVector: { x: 0, y: -10 },
      renderBall: false,
      startGame: false,
      waitingForPlayer: true,
      firstPlayer: true,
      score: { player1: 0, player2: 0 },
      bgColor: theme.backgroundColor,
      fontColor: theme.fontColor
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
        this.setState({ ballPosition: newBallPosition, ballVector: newBallVector, renderBall: true });
        break;
        case 'bgColor':
      const { bgColor } = payload;
        this.setState({ bgColor });
        break;
      case 'fontColor':
        const { fontColor } = payload;
        this.setState({ fontColor });
        break;
      case 'score':
        const { score } = payload;
        this.setState({ score });
        scoreSound.play();
        break;
      case 'bgColor':
        this.setState({ bgColor: payload, fontColor: getFontColor(payload) });
        hitPaddleSound.play();
        break;
      default:
        break;
    }
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

  onScore = (callback) => {
    const { firstPlayer, score } = this.state;
    if (firstPlayer) {
      this.setState({
        score: { player1: score.player1, player2: score.player2 + 1 },
      }, () => {
        callback(this.state.score);
      });
    } else {
      this.setState({
        score: { player1: score.player1 + 1, player2: score.player2 },
      }, () => {
        callback(this.state.score);
      });
    }
  }

  readyToPlay = (webrtc) => {
    const { firstPlayer } = this.state;
    this.setState({ waitingForPlayer: false, renderBall: firstPlayer });
  }

  handlePeerQuit = () => {
    this.setState({
      waitingForPlayer: true,
      ballPosition: null,
      renderBall: false,
      firstPlayer: true,
      ballVector: { x: 0, y: -10 }
    });
  }

  changeColor = (color, fontColor) => {
    this.setState({
      bgColor: color,
      fontColor: fontColor
    })
  };

  render() {
    const {
      fontColor,
      bgColor,
      ballPosition,
      ballVector,
      renderBall,
      startGame,
      waitingForPlayer,
      score,
      roomName,
      firstPlayer,
    } = this.state;
    return (
      <ThemeProvider theme={theme}>
        <Fragment>
          <GlobalStyle />
            <Container
              bgColor={bgColor}
              fontColor={fontColor}
              >
                {
                  startGame ? (
                    <LioWebRTC
                      options={lioWebRTCOptions}
                      onReceivedPeerData={this.handlePeerData}
                      onReady={this.handleReadyToJoin}
                      onJoinedRoom={this.handleJoined}
                      onChannelOpen={this.readyToPlay}
                      onRemovedPeer={this.handlePeerQuit}
                    >
                      <Pong
                        onChangeColor={this.changeColor}
                        ballPosition={{
                          x: ballPosition ? ballPosition.x : theme.ballLeft,
                          y: ballPosition ? ballPosition.y : theme.ballBottom
                        }}
                        ballVector={ballVector}
                        renderBall={renderBall}
                        onCrossSeparator={this.handleCrossSeparator}
                        setBallVector={this.handleSetBallVector}
                        onReadyJoinRoom={this.handleJoin}
                        onScore={this.onScore}
                        waitingForPlayer={waitingForPlayer}
                        roomName={roomName}
                        score={score}
                        firstPlayer={firstPlayer}
                        onChangeBackground={this.handleChangeBackground}
                        fontColor={fontColor}
                      />
                    </LioWebRTC>
                  )
                  : (
                    <StartScreen onJoinRoom={this.handleJoin} />
                  )
                }
            </Container>
        </Fragment>
      </ThemeProvider>
    );
  }
}

export default App;
