import React from 'react';
import styled from 'styled-components';
import { WagmiConfig, createConfig } from 'wagmi';
import { CoinbaseWalletConnector } from 'wagmi/connectors/coinbaseWallet';
import { MetaMaskConnector } from 'wagmi/connectors/metaMask';

import GlobalStyle from './globalStyles';
import { publicClient } from './services/clients';
import Home from './components/Home';

const config = createConfig({
  autoConnect: true,
  connectors: [
    new MetaMaskConnector(),
    new CoinbaseWalletConnector({ options: { appName: 'FIP Voting' } }),
  ],
  publicClient,
});

function App() {
  return (
    <>
      <GlobalStyle />
      <WagmiConfig config={config}>
        <Home />
      </WagmiConfig>
    </>
  );
}

export default App;
