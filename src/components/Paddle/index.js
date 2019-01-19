import React from 'react';
import styled, { withTheme } from 'styled-components';

const Wrapper = styled.div.attrs({
  style: ({ pos }) => ({
    left: pos,
  }),
})`
  width: ${({theme}) => theme.paddleWidth}px;
  height: 30vh;
  border-bottom: 4px solid currentColor;
  position: absolute;
  bottom: 0;
  background-color: transparent;
  -webkit-tap-highlight-color: rgba(0,0,0,0);
  -webkit-tap-highlight-color: transparent;
`;

class Paddle extends React.Component {
  render() {
    const { position, fontColor } = this.props;
    return (
      <Wrapper pos={position} fontColor={fontColor} />
    );
  }
}

export default withTheme(Paddle);
