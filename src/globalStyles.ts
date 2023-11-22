import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  body {
    @font-face {
      font-family: 'Roboto';
    }

    --bg-color: #FFFFFF;
    --primary: #0F828A;
    --darkprimary: #0d47a1;
    --disabled: #d9d9d9;
    --white: #fcfdff;
    --black: #121212;
    --blueshadow: #2c3b737b;
    --caption: #595959;
    --divider: #BDBDBD;
    --error: #d32f2f;
    --error-bg: #ffebee;
    --font-color: #212121;
    --success-color: #008A02;
    --fail-color: #E30202;
    --votecount0: #42a5f5;
    --votecount1: #3f51b5;
    --votecount2: #f44336;
    --votecount3: #d1c4e9;
    --titlefont: 'Roboto';
    --titlefontlight: 'Roboto';
    color: #212121 !important;
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

  .MuiOutlinedInput-notchedOutline {
    border-color: var(--font-color) !important;
  }

  .MuiInputBase-input {
    color: var(--font-color) !important;
  }

  .MuiFormLabel-root {
    color: var(--dark-primary) !important;
  }

  .MuiList-root {
    color: var(--font-color) !important;
  }
  
  .MuiSvgIcon-root {
    fill: var(--primary) !important;
    &:hover {
      fill: var(--white) !important;
    }
  }

  .MuiMenuItem-root {
    color: var(--font-color) !important;
  }

  .MuiPickersLayout-root {
    color: var(--font-color) !important;
  }

  .MuiPickersDay-root {
    color: var(--font-color) !important;
    &:hover {
      color: var(--white) !important;
    }
  }
`;

export default GlobalStyle;
