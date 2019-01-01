import React from 'react';
import styled, { withTheme } from 'styled-components';
import Draggable from 'react-draggable';

const Wrapper = styled.div`
  width: ${({theme}) => theme.paddleWidth}px;
  height: 10px;
  border-radius: 4px;
  position: absolute;
  bottom: 0;
  left: ${props => props.pos}px;
  background-color: #fff;
`;

class Paddle extends React.Component {
  handleDrag = (e) => {
    console.log(e);
  };

  render() {
    const { position, width } = this.props;
    const { paddleWidth } = this.props.theme;
    console.log(position);
    return (
      <Draggable
        axis="x"
        bounds={{left: (0 - width) + (paddleWidth), right: (width / 2) - paddleWidth}}
      >
        <Wrapper pos={position} />
      </Draggable>
    )
  }
}

export default withTheme(Paddle);
