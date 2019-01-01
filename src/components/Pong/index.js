import React, { Component } from 'react';
import styled, { withTheme } from 'styled-components';
import Separator from '../Separator';
import Paddle from '../Paddle';
import Ball from '../Ball';

const Container = styled.div`
  width: 100%;
  height: 100%;
`;

class Pong extends Component {
  constructor(props) {
    super(props);
    this.state = {
      position: this.startCenter,
      ballPosition: this.props.ballPosition,
      ballVector: { x: 0, y: -10 },
      speed: 30,
      width: window.innerWidth,
      height: window.innerHeight,
      paddleVars: { x0: this.startCenter, x1: this.startCenter + props.theme.paddleWidth, deltaX: 0 },
      renderBall: true
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
    const { ballPosition, ballVector, paddleVars, width, height } = this.state;
    if (ballPosition.x <= 0 || ballPosition.x >= width - 30) {
      this.setState({ ballVector: { x: -ballVector.x, y: ballVector.y } }, () => {
        this.setState({ ballPosition: { x: ballPosition.x + this.state.ballVector.x, y: ballPosition.y + this.state.ballVector.y } });
      });
      return;
    }
    if (ballPosition.y <= 10 && paddleVars.x0 <= ballPosition.x <= paddleVars.x1) {
      console.log(ballVector.y);
      this.setState({ ballVector: { x: ballVector.x + paddleVars.deltaX, y: -ballVector.y } }, () => {
        this.setState({ ballPosition: { x: ballPosition.x + this.state.ballVector.x, y: ballPosition.y + this.state.ballVector.y } });
      });
      return;
    }
    if (ballPosition.y >= height - 30) {
      this.setState({ renderBall: false });
    }
    this.setState({ ballPosition: { x: ballPosition.x + ballVector.x, y: ballPosition.y + ballVector.y } });
  }

  render() {
    const { position, width, ballPosition, renderBall } = this.state;
    return (
      <Container>
        <Separator />
        {
          renderBall &&
          <Ball x={ballPosition.x} y={ballPosition.y} />
        }
        <Paddle width={width} position={position} onPaddleDrag={this.handlePaddleDrag} />
      </Container>
    );
  }
}

export default withTheme(Pong);
