import React from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
  margin-top: 20vh;
  text-align: center;
  display: flex;
  flex-flow: column;
  align-items: center;
  align-content: center;
`;

const WaitText = styled.h1`
  font-weight: bolder;
  color: #fff;
  font-size: 36px;
`;

class Wait extends React.Component {
  render() {
    return (
      <Wrapper>
        <WaitText>Waiting for another player...</WaitText>
      </Wrapper>
    );
  }
}

export default Wait;
