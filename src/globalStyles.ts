import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  body {
    --primary: #1976d2;
    --darkprimary: #0d47a1;
    --error: #d32f2f;
    --rbpcount: #42a5f5;
    --rbpcountlight0: #42a5f5;
    --rbpcountlight1: #64b5f6;
    --rbpcountlight2: #90caf9;
    --rbpcountlight3: #bbdefb;
    --tokencount: #3f51b5;
    --tokencountlight0: #3f51b5;
    --tokencountlight1: #7986cb;
    --tokencountlight2: #c5cae9;
    --tokencountlight3: #e8eaf6;
    --minertokencount: #9575cd;
    --minertokencountlight0: #9575cd;
    --minertokencountlight1: #b39ddb;
    --minertokencountlight2: #d1c4e9;
    --minertokencountlight3: #ede7f6;
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
