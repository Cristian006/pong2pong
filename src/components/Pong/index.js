import React, { Component } from 'react';
import styled, { withTheme } from 'styled-components';
import { withWebRTC } from 'react-liowebrtc';
import Separator from '../Separator';
import Paddle from '../Paddle';
import Ball from '../Ball';
import Score from '../Score';
import { getColor } from '../../utils';

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
      speed: 20,
      width: window.innerWidth,
      height: window.innerHeight,
      moving: 0,
      cX: 0,
      paddleVars: { x: this.startCenter, x1: this.startCenter + props.theme.paddleWidth, deltaX: 0 }
    }
    this.handleResize = this.handleResize.bind(this);
    this.movePaddle = this.movePaddle.bind(this);
    this.handlePaddleDrag = this.handlePaddleDrag.bind(this);
    this.handleBallMove = this.handleBallMove.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleKeyUp = this.handleKeyUp.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.startMoving = this.startMoving.bind(this);
  }

  componentDidMount() {
    window.addEventListener('keypress', this.handleKeyPress);
    window.addEventListener('keydown', this.handleKeyDown);
    window.addEventListener('keyup', this.handleKeyUp);
    window.addEventListener('resize', this.handleResize);
    this.applyGravity(true);
  }

  componentWillUnmount() {
    window.removeEventListener('keypress', this.handleKeyPress);
    window.removeEventListener('keydown', this.handleKeyDown);
    window.removeEventListener('keyup', this.handleKeyUp);
    window.removeEventListener('resize', this.handleResize);
    this.applyGravity(false);
  }

  applyGravity(apply=true) {
    if(apply) {
      this.moveBall = setInterval(() => { this.handleBallMove() }, 30);
    } else {
      clearInterval(this.moveBall);
    }
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
  startMoving(direction=0) {
    if (direction === 0) {
      // stop moving paddle
      this.setState({ moving: direction }, () => {
        clearInterval(this.movingPaddle);
        this.movingPaddle = null;
      });
      return;
    }

    if (this.state.moving !== direction) {
      // we are switching directions!
      clearInterval(this.movingPaddle);
      this.setState({
        moving: direction,
      }, () => {
        this.movingPaddle = setInterval(() => { this.movePaddle(direction) }, 10);
      });
    } else {
      // we were not moving before -> start moving
      this.setState({
        moving: direction,
      }, () => {
        this.movingPaddle = setInterval(() => { this.movePaddle(direction) }, 10);
      });
    }
  }

  handleKeyPress (e) {
    switch (e.keyCode) {
      case 32:
        // pause the game
        break;
      default:
        break;
    }
  }

  handleKeyDown (e) {
    switch (e.keyCode) {
      case 65:
      case 37:
        //left
        if (this.state.moving >= 0) {
          this.startMoving(-1);
        }
        break;
      case 68:
      case 39:
        //right
        if (this.state.moving <= 0) {
          this.startMoving(1);
        }
        break;
      default:
        break;
    }
  }

  handleKeyUp (e) {
    // stop moving
    switch (e.keyCode) {
      case 65:
      case 37:
        //left
        this.startMoving(0);
        break;
      case 68:
      case 39:
        //right
        this.startMoving(0);
        break;
      default:
        break;
    }
  }

  movePaddle(direction) {
    // move paddle postion
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

  onScore = () => {
    this.props.onScore((score) => {
      this.props.webrtc.shout('score', { score });
    });
  }

  handleBallMove() {
    const { ballPosition, paddleVars, width, height } = this.state;
    const { ballVector } = this.props;
    const { renderBall } = this.props;
    if (!renderBall) return;
    // Handle wall collision
    if (ballPosition.x <= 0 || ballPosition.x >= width - 30) {
      this.props.setBallVector({ x: 0 - ballVector.x, y: ballVector.y });
      this.setState({ ballPosition: { x: ballPosition.x - ballVector.x, y: ballPosition.y + ballVector.y }});
      return;
    }
    if (ballPosition.y <= 10) {
      // console.log('COLLISION', paddleVars, ballPosition);
      // Ball x coord is between paddle x0 and x1
      if (paddleVars.x <= ballPosition.x + 30 && paddleVars.x1 >= ballPosition.x) {
        this.props.setBallVector({ x: ballVector.x + paddleVars.deltaX, y: -ballVector.y });
        this.setState({ ballPosition: {
          x: ballPosition.x + ballVector.x + paddleVars.deltaX,
          y: ballPosition.y - ballVector.y
        }});
        const newBackground = getColor();
        this.props.onChangeBackground(newBackground);
        this.props.webrtc.shout('bgColor', newBackground);
        return;
      } else {
        // Handle ball fall-through
        this.props.setBallVector({ x: 0, y: -10 });
        this.setState({ ballPosition: {
          x: (window.innerWidth / 2) - 15,
          y: window.innerHeight - 300 }
        });
        this.onScore();
        return;
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

  handleHover = (evt) => {
    const { paddleWidth } = this.props.theme;
    const { width } = this.state;
    const { clientX, movementX } = evt;
    let xPos = clientX - paddleWidth/2;
    if (xPos < 0) xPos = 0;
    if (xPos > width - paddleWidth) xPos = width - paddleWidth;
    this.handlePaddleDrag({ x: xPos, x1: xPos + paddleWidth, deltaX: movementX })
  }

  handleTouch = (evt) => {
    const { paddleWidth } = this.props.theme;
    const { width, cX } = this.state;
    const { clientX } = evt.touches[0];
    let xPos = clientX - paddleWidth/2;
    if (xPos < 0) xPos = 0;
    if (xPos > width - paddleWidth) xPos = width - paddleWidth;
    this.handlePaddleDrag({ x: xPos, x1: xPos + paddleWidth, deltaX: clientX - cX });
    this.setState({ cX: clientX });
  }

  render() {
    const { position, ballPosition } = this.state;
    const {
      renderBall, waitingForPlayer, roomName, score, firstPlayer, fontColor
    } = this.props;
    return (
      <Container onMouseMove={this.handleHover} onTouchMove={this.handleTouch}>
        <Separator fontColor={fontColor} />
        {
          renderBall &&
          <Ball x={ballPosition.x} y={ballPosition.y} fontColor={fontColor} />
        }
        <Score
          score={score}
          waiting={waitingForPlayer}
          room={roomName}
          firstPlayer={firstPlayer}
          fontColor={fontColor}
        />
        <Paddle position={position} fontColor={fontColor} />
      </Container>
    );
  }
}

export default withWebRTC(withTheme(Pong));
