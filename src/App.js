import React, { Component, Fragment } from 'react';
import styled, { createGlobalStyle, ThemeProvider } from 'styled-components';
import logo from './logo.svg';
import Pong from './components/Pong';
import './App.css';

const theme = {
  backgroundColor: '#282c34',
  paddleWidth: 200,
}

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
  render() {
    return (
      <ThemeProvider theme={theme}>
        <Fragment>
          <GlobalStyle />
          <Container>
            <Pong />
          </Container>
        </Fragment>
      </ThemeProvider>
    );
  }
}

export default App;
