import React, { Component } from 'react';
import styled from 'styled-components';
import Separator from '../Separator';
import Paddle from '../Paddle';

const Container = styled.div`
  width: 100%;
  height: 100%;
`;

class Pong extends Component {
  constructor(props) {
    super(props);
    this.state = {
      position: 0,
      speed: 1,
    }
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.handleResize = this.handleResize.bind(this);
  }

  componentDidMount() {
    window.addEventListener('keypress', this.handleKeyPress);
    window.addEventListener('keydown', this.handleKeyPress);
    window.addEventListener('resize', this.handleResize);
  }

  componentWillUnmount() {
    window.removeEventListener('keypress', this.handleKeyPress);
    window.removeEventListener('keydown', this.handleKeyPress);
    window.removeEventListener('resize', this.handleResize);
  }

  handleResize(e) {
    // handle board resize
  }

  handleKeyPress (e) {
    switch (e.keyCode) {
      case 37:
        //left
        this.movePaddel(-1);
        break;
      case 39:
        //right
        this.movePaddel(1);
        break;
      default:
        break;
    }
  }

  movePaddel(direction) {
    // move paddel postion
    
  }
  
  render() {
    const { position } = this.state;
    return (
      <Container>
        <Separator />
        <Paddle position={position} />
      </Container>
    );
  }
}

export default Pong;