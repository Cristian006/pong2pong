import React, { Component } from 'react';
import styled from 'styled-components';

const Container = styled.div`
  position: absolute;
  padding: 30px;
  opacity: 0.5;
  color: #fff;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-content: center;
  align-items: center;
  user-select: none;
`;

const Text = styled.div`
  font-size: 56px;
  font-weight: bolder;
`;

const WaitText = styled.h1`
  font-weight: bolder;
  font-size: 36px;
`;

class Score extends Component {
  render() {
    const { score, waiting, room, firstPlayer } = this.props;
    const { player1, player2 } = score;
    if (waiting) {
      return (
        <Container>
          <WaitText>waiting for player to join room</WaitText>
          <WaitText>{room}</WaitText>
        </Container>
      )
    }
    return (
      <Container>
        <Text>{firstPlayer ? `${player1} - ${player2}` : `${player2} - ${player1}`}</Text>
      </Container>
    );
  }
}

export default Score;