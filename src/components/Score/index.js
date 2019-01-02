import React, { Component } from 'react';
import styled from 'styled-components';

const Container = styled.div`
  position: absolute;
  padding: 30px;
  opacity: 0.6;
  color: #fff;
  text-align: center;
  left: 0;
  right: 0;
`;

const Text = styled.div`
  font-size: 30px;
  font-weight: bolder;
`;

const WaitText = styled.h1`
  font-weight: bolder;
  font-size: 36px;
`;

class Score extends Component {
  render() {
    const { score, waiting, room } = this.props;
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
        <Text>{`${player1} - ${player2}`}</Text>
      </Container>
    );
  }
}

export default Score;