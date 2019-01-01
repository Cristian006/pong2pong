import React, { Component, Fragment } from 'react';
import styled, { createGlobalStyle, ThemeProvider } from 'styled-components';
import logo from './logo.svg';
import Pong from './components/Pong';
import './App.css';

const theme = {
  fontColor: 'white',
  ballLeft: (window.innerWidth / 2) - 15,
  ballBottom: window.innerHeight - 300,
  backgroundColor: '#282c34',
  paddleWidth: 200,
};

const GlobalStyle = createGlobalStyle`
  html {
    box-sizing: border-box;
  }

  body: {
    height: 100vh;
    width: 100vw;
    overflow: hidden;
  }

  * {
    box-sizing: inherit;
  }

`

const Container = styled.div`
  height: 100vh;
  width: 100vw;
  background: ${({theme}) => theme.backgroundColor};
`;

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }
  handleMoveBall = (vector) => {
    const { ballLeft, ballBottom } = this.state;
    this.setState({ theme: { ballLeft: ballLeft + vector.x, ballBottom: ballBottom + vector.y } });
  }
  render() {
    return (
      <ThemeProvider theme={theme}>
        <Fragment>
          <GlobalStyle />
          <Container>
            <Pong ballPosition={{ x: theme.ballLeft, y: theme.ballBottom }} onMoveBall={this.handleMoveBall} />
          </Container>
        </Fragment>
      </ThemeProvider>
    );
  }
}

export default App;
