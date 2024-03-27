import React from 'react';
// import { WagmiConfig, createConfig } from 'wagmi';
// import { CoinbaseWalletConnector } from 'wagmi/connectors/coinbaseWallet';
// import { MetaMaskConnector } from 'wagmi/connectors/metaMask';
import {
  createTheme,
  ThemeProvider as MuiThemeProvider,
} from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

import './i18n/config';
import GlobalStyle from './globalStyles';
import { publicClient } from './services/clients';
import Home from 'components/Home';
import { FipDataContextProvider } from 'common/FipDataContext';
import { VoteEndContextProvider } from 'common/VoteEndContext';

import { createWeb3Modal, defaultWagmiConfig } from '@web3modal/wagmi/react'

import { WagmiConfig } from 'wagmi'
import { arbitrum, mainnet } from 'viem/chains'

// 1. Get projectId at https://cloud.walletconnect.com
const projectId = '0d2844110aa5ef90fb205c145d2d643e'

// 2. Create wagmiConfig
const metadata = {
  name: 'Web3Modal',
  description: 'Web3Modal Example',
  url: 'https://web3modal.com',
  icons: ['https://avatars.githubusercontent.com/u/37784886']
}

const chains = [mainnet, arbitrum]
const wagmiConfig = defaultWagmiConfig({
  chains,
  projectId,
  metadata,
  // enableAnalytics: true // Optional - defaults to your Cloud configuration
})

// 3. Create modal
createWeb3Modal({ wagmiConfig, projectId, chains })

// const config = createConfig({
//   autoConnect: true,
//   connectors: [
//     new MetaMaskConnector(),
//     new CoinbaseWalletConnector({
//       options: { appName: 'FIP Voting Dashboard' },
//     }),
//   ],
//   publicClient,
// });

const theme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: 'var(--bg-color)',
    },
    text: {
      // Have to specify hex here to prevent breakage on MUI Toggles
      primary: '#212121',
    },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: 'var(--bg-color)',
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
            <WagmiConfig config={wagmiConfig}>
              <Home />
            </WagmiConfig>
          </MuiThemeProvider>
        </VoteEndContextProvider>
      </FipDataContextProvider>
    </>
  );
}

export default App;
