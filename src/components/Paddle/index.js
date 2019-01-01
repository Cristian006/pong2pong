import React from 'react';
import styled from 'styled-components';
import Draggable from 'react-draggable';

const Wrapper = styled.div`
  width: 10%;
  height: 10px;
  position: absolute;
  top: ${props => props.theme.paddleTop};
  left: ${props => props.theme.paddleLeft};
  background-color: ${props => props.theme.fontColor}
`;

class Paddle extends React.Component {
  render() {
    return (
      <Draggable
        axis="x"
        handle=".handle"
        defaultPosition={{x: 0, y: 0}}
        position={null}
        scale={1}
        onStart={this.handleStart}
        onDrag={this.handleDrag}
        onStop={this.handleStop}>
        <Wrapper />
      </Draggable>
    )
  }
}
