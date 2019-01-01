import React, { Component } from 'react';
import styled, { withTheme } from 'styled-components';
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
      position: this.startCenter,
      speed: 30,
      width: window.outerWidth,
      height: window.outerHeight,
    }
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.handleResize = this.handleResize.bind(this);
    this.movePaddel = this.movePaddel.bind(this);
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
    this.setState({
      width: window.outerWidth,
      height: window.outerHeight,
    })
  }

  get startCenter() {
    const width = window.outerWidth;
    return (width / 2) - (this.props.theme.paddleWidth / 2);
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
    const { width, speed } = this.state;
    const { paddleWidth } = this.props.theme;
    const delta = speed * direction;
    console.log(delta, width, paddleWidth);
    this.setState({
      position: direction > 0 ? Math.min(this.state.position + delta, width - paddleWidth) : Math.max(this.state.position + delta, 0)
    });
  }
  
  render() {
    const { position, width } = this.state;
    return (
      <Container>
        <Separator />
        <Paddle width={width} position={position} />
      </Container>
    );
  }
}

export default withTheme(Pong);