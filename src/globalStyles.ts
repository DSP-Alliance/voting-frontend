import { createGlobalStyle } from 'styled-components';
import LatoLight from './fonts/Lato-Light.woff';
import Lato from './fonts/Lato-Regular.woff';

const GlobalStyle = createGlobalStyle`
  body {
    @font-face {
    font-family: 'Lato';
    src: url(${Lato}) format('woff');
  }

  @font-face {
    font-family: 'Lato-Light';
    src: url(${LatoLight}) format('woff');
  }

    --bg-color: #12182d;
    --primary: #1976d2;
    --darkprimary: #0d47a1;
    --disabled: #d9d9d9;
    --white: #fcfdff;
    --black: #121212;
    --blueshadow: #2c3b737b;
    --caption: #757575;
    --error: #d32f2f;
    --error-bg: #ffebee;
    --votecount0: #42a5f5;
    --votecount1: #3f51b5;
    --votecount2: #f44336;
    --votecount3: #d1c4e9;
    --titlefont: 'Lato';
    --titlefontlight: 'Lato-Light';
    margin: 0;
    padding: 0;
    font-family: Roboto, Helvetica, Sans-Serif;
  }
  
  button {
    padding: 8px;
    border-radius: 4px;
    border: none;
    background-color: var(--primary);
    color: var(--white);
    
    &:disabled {
      background-color: var(--disabled);
    }
    
    &:hover:enabled {
      cursor: pointer;
      background-color: var(--darkprimary);
    }
  }
`;

export default GlobalStyle;
