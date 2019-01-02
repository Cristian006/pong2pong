import React from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
  position: absolute;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background-color: ${props => props.theme.fontColor}
`;

class Ball extends React.Component {
  render() {
    const { x, y } = this.props;
    return (
      <Wrapper style={{ left: x, bottom: y }} />
    );
  }
}

export default Ball;
