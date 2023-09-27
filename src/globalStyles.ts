import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  body {
    --blue: #1976d2;
    --darkblue: #1976d2dd;
    --rederror: #d32f2f;
    margin: 0;
    padding: 0;
    font-family: Roboto, Helvetica, Sans-Serif;
  }

  button {
    padding: 8px;
    border-radius: 4px;
    border: none;
    background-color: var(--blue);
    color: #fff;

    &:disabled {
      background-color: #d9d9d9;
    }
    
    &:hover:enabled {
      cursor: pointer;
      background-color: var(--darkblue);
    }
  }

  label.MuiInputLabel-root:not(.Mui-focused) {
      font-size: 14px;
  }
`;

export default GlobalStyle;
