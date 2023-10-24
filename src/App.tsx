import React from 'react';
import { WagmiConfig, createConfig } from 'wagmi';
import { CoinbaseWalletConnector } from 'wagmi/connectors/coinbaseWallet';
import { MetaMaskConnector } from 'wagmi/connectors/metaMask';

import GlobalStyle from './globalStyles';
import { publicClient } from './services/clients';
import Home from './components/Home';
import { CountdownContextProvider } from './components/CountdownContext';

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

function App() {
  return (
    <CountdownContextProvider>
      <GlobalStyle />
      <WagmiConfig config={config}>
        <Home />
      </WagmiConfig>
    </CountdownContextProvider>
  );
}

export default App;
