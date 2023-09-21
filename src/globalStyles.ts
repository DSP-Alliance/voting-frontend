import { createGlobalStyle } from 'styled-components';

import PPFormulaExtrabold from './fonts/PPFormula-Extrabold.woff2';
import InterRegular from './fonts/Inter-Regular.woff2';

const GlobalStyle = createGlobalStyle`
  @font-face {
    font-family: 'Inter Regular';
    src: url(${InterRegular}) format('woff2');
  }

  @font-face {
    font-family: 'PP Formula';
    src: url(${PPFormulaExtrabold}) format('woff2');
  }

  body {
    --portal2023-green: #00e3aa;
    --portal2023-cream: #fefdf5;
    --portal2023-tan: #e6e3d3;
    --portal2023-black: #000000;
    --portal2023-citron: #d3ffa6;
    --portal2023-blue: #3434ef;
    --portal2023-bluelightened: #3434ef1a;
    --portal2023-orange: #ff7442;
    --portal2023-orangelightened: #ff74421a;
    --portal2023-darkhover: #575757;
    --portal2023-lighthover: #969696;
    --portal2023-greensuccess: #00a37a;
    --portal2023-rederror: #eb0000;
    --portal2023-redlightened: #eb00001a;
    --portal2023-font-ppformula: 'PP Formula';
    --portal2023-font-inter: 'Inter Regular';
    margin: 0;
    padding: 0;
    background: var(--portal2023-cream);
    font-family: 'Inter Regular', Helvetica, Sans-Serif;
  }

  button {
    font-family: 'Inter Regular', Helvetica, Sans-Serif;
    background-color: var(--portal2023-green);
    padding: 8px;
    border: 1px solid var(--portal2023-darkhover);
    border-radius: 4px;
  }

  .MuiList-root {
    background-color: var(--portal2023-cream);
  }
`;

export default GlobalStyle;
