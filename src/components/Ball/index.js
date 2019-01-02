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
  background-color: ${props => props.theme.fontColor};
`;

class Ball extends React.Component {
  render() {
    const { x, y } = this.props;
    return (
      <Wrapper x={x} y={y} />
    );
  }
}

export default Ball;
