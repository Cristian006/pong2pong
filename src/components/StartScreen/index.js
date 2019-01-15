import React from 'react';
import styled, { withTheme } from 'styled-components';
import { hitPaddleSound, hitWallSound, scoreSound } from '../../utils/sound';

const Wrapper = styled.div`
  margin-top: 20vh;
  text-align: center;
  display: flex;
  flex-flow: column;
  align-items: center;
  align-content: center;
`;

const Container = styled.div`
  width: 600px;
  max-width: 90vw;
  display: flex;
  flex-flow: column;
  text-align: center;
`;

const Title = styled.h1`
  font-weight: bolder;
  color: #fff;
  font-size: 48px;
`;

const TextInput = styled.input`
  font-size: 36px;
  padding: 10px;
  background: transparent;
  color: #fff;
  border: 3px solid #fff;
  border-radius: 4px;
  font-weight: 100;
  outline-style: none;
`;

const Button = styled.button`
  font-size: 36px;
  margin-top: 15px;
  padding: 10px;
  background: #fff;
  color: #333;
  border-radius: 4px;
  cursor: pointer;
  outline-style: none;
  &:hover{
    background: #f4f8ff;
  }
  &:active {
    box-shadow: -2px -2px 62px -11px rgba(0,0,0,0.75) inset;
    -webkit-box-shadow: -2px -2px 62px -11px rgba(0,0,0,0.75) inset;
    -moz-box-shadow: -2px -2px 62px -11px rgba(0,0,0,0.75) inset;
  }
`;

class StartScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      roomName: window.location.hash ? window.location.hash.substr(1) : ''
    };
  }

  handleJoin = () => {
    const { roomName } = this.state;
    if (roomName) {
      this.props.onJoinRoom(roomName);
      window.location.hash = `#${roomName}`;
      // Need to play all 3 sounds on a click event so that mobile safari can
      // play these sounds later without user input
      hitPaddleSound.play();
      hitWallSound.play();
      scoreSound.play();
    }
  }

  render() {
    const { roomName } = this.state;
    return (
      <Wrapper>
        <Container>
          <Title>Pong2Pong</Title>
          <TextInput placeholder="Room Name" value={roomName} onChange={(evt) => this.setState({ roomName: evt.target.value })} />
          <Button onClick={this.handleJoin}>Join</Button>
        </Container>
      </Wrapper>
    );
  }
}

export default withTheme(StartScreen);
