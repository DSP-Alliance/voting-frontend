import React from 'react';
import styled from 'styled-components';
import { WagmiConfig, createConfig } from 'wagmi';
import { CoinbaseWalletConnector } from 'wagmi/connectors/coinbaseWallet';
import { MetaMaskConnector } from 'wagmi/connectors/metaMask';

import GlobalStyle from './globalStyles';
import { publicClient } from './services/clients';
import Home from './components/Home';

const Header = styled.div`
  display: flex;
  justify-content: center;
  font-size: 24px;
  font-family: 'PP Formula';
  margin: 24px 0;
`;

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
      <Header>FIP WIP</Header>
      <WagmiConfig config={config}>
        <Home />
      </WagmiConfig>
    </>
  );
}

export default App;
