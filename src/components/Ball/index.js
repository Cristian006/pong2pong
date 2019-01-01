import React from 'react';
import styled from 'styled-components';

const Wrapper = `
  position: absolute;
  left: ${props => props.theme.ballLeft};
  top: ${props => props.theme.ballTop};
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background-color: ${props => props.theme.fontColor}
`;

class Ball extends React.PureComponent {
  render() {
    return (
      <Wrapper />
    );
  }
}

export default Ball;
