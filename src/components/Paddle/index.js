import React from 'react';
import styled, { withTheme } from 'styled-components';
import Draggable from 'react-draggable';

const Wrapper = styled.div.attrs({
  style: ({ pos }) => ({
    left: pos,
  }),
})`
  width: ${({theme}) => theme.paddleWidth}px;
  height: 30vh;
  border-bottom: 4px solid #fff;
  position: absolute;
  bottom: 0;
  background-color: transparent;
  -webkit-tap-highlight-color: rgba(0,0,0,0);
  -webkit-tap-highlight-color: transparent;
`;

class Paddle extends React.Component {
  handleDrag = (evt, data) => {
    const { width, position } = this.props;
    const { paddleWidth } = this.props.theme;
    const x = data.x >= width - paddleWidth ? position : data.x + (width/2) - (paddleWidth/2);
    const x1 = data.x >= width - paddleWidth ? position + paddleWidth: data.x + (width/2) - (paddleWidth/2) + paddleWidth;
    this.props.onPaddleDrag({ x, x1,  deltaX: data.deltaX });
  }

  render() {
    const { position, width } = this.props;
    const { paddleWidth } = this.props.theme;
    // console.log(position);
    return (
      <Draggable
        axis="x"
        bounds={{ left: -position, right: (width/2)/2 - paddleWidth/4 }}
        onDrag={this.handleDrag}
      >
        <Wrapper pos={position} />
      </Draggable>
    );
  }
}

export default withTheme(Paddle);
