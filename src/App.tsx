import React from 'react';
import styled from 'styled-components';
import { WagmiConfig, createConfig } from 'wagmi';
import { CoinbaseWalletConnector } from 'wagmi/connectors/coinbaseWallet';
import { MetaMaskConnector } from 'wagmi/connectors/metaMask';

import { publicClient } from './services/clients';
import Home from './components/Home';

const Header = styled.div`
  display: flex;
  justify-content: center;
  font-size: 24px;
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
      <Header>FIP WIP</Header>
      <WagmiConfig config={config}>
        <Home />
      </WagmiConfig>
    </>
  );
}

export default App;
