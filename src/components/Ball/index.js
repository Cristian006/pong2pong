import React from 'react';
import styled from 'styled-components';

const Wrapper = styled.div.attrs({
  style: ({ x, y }) => ({
    left: x,
    bottom: y,
  })
})`
  position: absolute;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background-color: ${({fontColor}) => fontColor};
`;

class Ball extends React.Component {
  render() {
    const { x, y, fontColor } = this.props;
    return (
      <Wrapper x={x} y={y} fontColor={fontColor} />
    );
  }
}

export default Ball;
