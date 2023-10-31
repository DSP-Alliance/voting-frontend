import React from 'react';
import { WagmiConfig, createConfig } from 'wagmi';
import { CoinbaseWalletConnector } from 'wagmi/connectors/coinbaseWallet';
import { MetaMaskConnector } from 'wagmi/connectors/metaMask';
import {
  createTheme,
  ThemeProvider as MuiThemeProvider,
} from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

import GlobalStyle from './globalStyles';
import { publicClient } from './services/clients';
import Home from 'components/Home';
import { FipDataContextProvider } from 'common/FipDataContext';
import { VoteEndContextProvider } from 'common/VoteEndContext';

const config = createConfig({
  autoConnect: true,
  connectors: [
    new MetaMaskConnector(),
    new CoinbaseWalletConnector({
      options: { appName: 'FIP Voting Dashboard' },
    }),
  ],
  publicClient,
});

const theme = createTheme({
  palette: {
    background: {
      default: 'var(--bg-color)',
    },
    text: {
      // Have to specify hex here to prevent breakage on MUI Toggles
      primary: '#fcfdff',
    },
  },
  components: {
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          backgroundColor: 'var(--white)',
          color: 'var(--black);',
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          backgroundColor: 'var(--white)',
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          color: 'var(--black)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: 'var(--bg-color)',
        },
      },
    },
    MuiToggleButton: {
      styleOverrides: {
        root: {
          color: 'var(--white)',
        },
      },
    },
  },
});

function App() {
  return (
    <>
      <FipDataContextProvider>
        <VoteEndContextProvider>
          <MuiThemeProvider theme={theme}>
            <CssBaseline />
            <GlobalStyle />
            <WagmiConfig config={config}>
              <Home />
            </WagmiConfig>
          </MuiThemeProvider>
        </VoteEndContextProvider>
      </FipDataContextProvider>
    </>
  );
}

export default App;
