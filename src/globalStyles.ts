import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  body {
    --blue: #007bff;
    --rederror: #ff0000;
    margin: 0;
    padding: 0;
    font-family: Roboto, Helvetica, Sans-Serif;
  }

  button {
    padding: 8px;
    border-radius: 4px;
    border: 1px solid var(--blue);
    
    &:hover {
      cursor: pointer;
      background-color: var(--blue);
    }
  }
`;

export default GlobalStyle;
