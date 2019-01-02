import React, { Component } from 'react';
import styled, { withTheme } from 'styled-components';
import { withWebRTC } from 'react-liowebrtc';
import Separator from '../Separator';
import Paddle from '../Paddle';
import Ball from '../Ball';
import Wait from '../Wait';

const Container = styled.div`
  width: 100%;
  height: 100%;
`;

class Pong extends Component {
  constructor(props) {
    super(props);
    this.state = {
      position: this.startCenter,
      ballPosition: props.ballPosition,
      ballVector: props.ballVector,
      speed: 30,
      width: window.innerWidth,
      height: window.innerHeight,
      paddleVars: { x0: this.startCenter, x1: this.startCenter + props.theme.paddleWidth, deltaX: 0 }
    }
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.handleResize = this.handleResize.bind(this);
    this.movePaddel = this.movePaddel.bind(this);
    this.handlePaddleDrag = this.handlePaddleDrag.bind(this);
    this.handleBallMove = this.handleBallMove.bind(this);
  }

  componentDidMount() {
    window.addEventListener('keypress', this.handleKeyPress);
    window.addEventListener('keydown', this.handleKeyPress);
    window.addEventListener('resize', this.handleResize);
    this.moveBall = setInterval(() => { this.handleBallMove() }, 30);
  }

  componentWillUnmount() {
    window.removeEventListener('keypress', this.handleKeyPress);
    window.removeEventListener('keydown', this.handleKeyPress);
    window.removeEventListener('resize', this.handleResize);
    clearInterval(this.moveBall);
  }

  handleResize(e) {
    // handle board resize
    this.setState({
      width: window.innerWidth,
      height: window.innerHeight,
    })
  }

  get startCenter() {
    const width = window.innerWidth;
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
// paddle
  movePaddel(direction) {
    // move paddel postion
    const { width, speed } = this.state;
    const { paddleWidth } = this.props.theme;
    const delta = speed * direction;
    // console.log(delta, width, paddleWidth);
    this.setState({
      position: direction > 0 ? Math.min(this.state.position + delta, width - paddleWidth) : Math.max(this.state.position + delta, 0)
    });
  }

  handlePaddleDrag(info) {
    this.setState({ position: info.x, paddleVars: { x: info.x, x1: info.x1, deltaX: info.deltaX } });
  }

  handleBallMove() {
    const { ballPosition, paddleVars, width, height } = this.state;
    const { ballVector } = this.props;

    const { renderBall } = this.props;
    // Handle wall collision
    if (ballPosition.x <= 0 || ballPosition.x >= width - 30) {
      this.props.setBallVector({ x: 0 - ballVector.x, y: ballVector.y });
      this.setState({ ballPosition: { x: ballPosition.x - ballVector.x, y: ballPosition.y + ballVector.y }});
      return;
    }
    if (ballPosition.y <= 10) {
      // Ball x coord is between paddle x0 and x1
      if (paddleVars.x0 <= ballPosition.x <= paddleVars.x1) {
        this.props.setBallVector({ x: ballVector.x + paddleVars.deltaX, y: -ballVector.y });
        this.setState({ ballPosition: {
          x: ballPosition.x + ballVector.x + paddleVars.deltaX,
          y: ballPosition.y - ballVector.y
        }});
        return;
      } else {
        // Handle ball fall-through
        console.log('FALL');
        this.props.setBallVector({ x: 0, y: -10 });
        this.setState({ ballPosition: {
          x: this.props.theme.ballLeft,
          y: this.props.theme.ballBottom }
        });
      }
    }
    if (ballPosition.y >= height - 30 && renderBall && ballVector.y > 0) {
      this.props.onCrossSeparator();
      this.props.webrtc.shout('crossSeparator', { ballPosition, ballVector });
    }
    this.setState({ ballPosition: {
      x: ballPosition.x + ballVector.x,
      y: ballPosition.y + ballVector.y }
    });
  }

  render() {
    const { position, width, ballPosition } = this.state;
    const { renderBall, waitingForPlayer } = this.props;
    return (
      <Container>
        <Separator />
        {
          renderBall &&
          <Ball x={ballPosition.x} y={ballPosition.y} />
        }
        {
          waitingForPlayer &&
          <Wait />
        }
        <Paddle width={width} position={position} onPaddleDrag={this.handlePaddleDrag} />
      </Container>
    );
  }
}

export default withWebRTC(withTheme(Pong));
