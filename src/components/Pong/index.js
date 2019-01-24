import React, { Component } from 'react';
import styled, { withTheme } from 'styled-components';
import { withWebRTC } from 'react-liowebrtc';
import Separator from '../Separator';
import Paddle from '../Paddle';
import Ball from '../Ball';
import Score from '../Score';
//import Wait from '../Wait';
import {
  generateRGBValues,
  getFontColor,
  setColor,
  formatColorObject
} from '../../utils';
import { hitWallSound, hitPaddleSound, scoreSound } from '../../utils/sound';

const Container = styled.div`
  width: 100%;
  height: 100%;
  color: inherit;
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
      touchX: 0,
      paddleVars: { x: this.startCenter, x1: this.startCenter + props.theme.paddleWidth, deltaX: 0 }
    }
    this.handleResize = this.handleResize.bind(this);
    this.handlePaddleDrag = this.handlePaddleDrag.bind(this);
    this.handleBallMove = this.handleBallMove.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
  }

  componentDidMount() {
    window.addEventListener('keypress', this.handleKeyPress);
    window.addEventListener('resize', this.handleResize);
    this.applyGravity(true);
  }

  componentWillUnmount() {
    window.removeEventListener('keypress', this.handleKeyPress);
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

  handleKeyPress (e) {
    switch (e.keyCode) {
      case 32:
        // pause the game
        break;
      default:
        break;
    }
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
      hitWallSound.play();
      return;
    }
    if (ballPosition.y <= 10) {
      // Ball x coord is between paddle x0 and x1
      if (paddleVars.x <= ballPosition.x + 30 && paddleVars.x1 >= ballPosition.x) {
        this.props.setBallVector({ x: ballVector.x + paddleVars.deltaX, y: -ballVector.y });
        this.setState({ ballPosition: {
          x: ballPosition.x + ballVector.x + paddleVars.deltaX,
          y: ballPosition.y - ballVector.y
        }});
        const rgbValues = generateRGBValues(); // sets first, second, and third value for rgb, placeses first second and third into rgb object
        const color = formatColorObject(rgbValues); // creates rgb color
        const fontColor = getFontColor(color); // takes luminance and gets fontColor
        this.props.onChangeColor(color, fontColor);
        this.props.webrtc.shout('rgb', { rgb: rgbValues }); // sends first second and third value
        // this.props.webrtc.shout('bgColor', { bgColor: color });
        hitPaddleSound.play();
        return;
      } else {
        // Handle ball fall-through
        this.props.setBallVector({ x: 0, y: -10 });
        this.setState({ ballPosition: {
          x: (window.innerWidth / 2) - 15,
          y: window.innerHeight - 300 }
        });
        scoreSound.play();
        this.onScore();
        return;
      }
    }
    // Handle ball cross separator
    if (ballPosition.y >= height - 30 && renderBall && ballVector.y > 0) {
      this.props.onCrossSeparator();
      this.props.webrtc.shout('crossSeparator', { ballPosition, ballVector });
    }
    this.setState({ ballPosition: {
      x: ballPosition.x + ballVector.x,
      y: ballPosition.y + ballVector.y }
    });
  }

  movePaddle = (clientX, deltaX, setTouchX = false) => {
    const { paddleWidth } = this.props.theme;
    const { width } = this.state;
    let xPos = clientX - paddleWidth/2;
    if (xPos < 0) xPos = 0;
    if (xPos > width - paddleWidth) xPos = width - paddleWidth;
    this.handlePaddleDrag({ x: xPos, x1: xPos + paddleWidth, deltaX });
    if (setTouchX) this.setState({ touchX: clientX });
  }

  handleHover = (evt) => {
    const { clientX, movementX } = evt;
    this.movePaddle(clientX, movementX);
  }

  handleTouch = (evt) => {
    const { touchX } = this.state;
    const { clientX } = evt.touches[0];
    this.movePaddle(clientX, clientX - touchX, true);
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
