import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  body {
    --primary: #1976d2;
    --darkprimary: #0d47a1;
    --rpbcount: #42a5f5;
    --tokencount: #3f51b5;
    --minertokencount: #d1c4e9;
    --error: #d32f2f;
    margin: 0;
    padding: 0;
    font-family: Roboto, Helvetica, Sans-Serif;
  }

  button {
    padding: 8px;
    border-radius: 4px;
    border: none;
    background-color: var(--primary);
    color: #fff;

    &:disabled {
      background-color: #d9d9d9;
    }
    
    &:hover:enabled {
      cursor: pointer;
      background-color: var(--darkprimary);
    }
  }

  label.MuiInputLabel-root:not(.Mui-focused) {
      font-size: 14px;
  }
`;

export default GlobalStyle;
