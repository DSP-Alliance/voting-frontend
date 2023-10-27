import React from 'react';
import { WagmiConfig, createConfig } from 'wagmi';
import { CoinbaseWalletConnector } from 'wagmi/connectors/coinbaseWallet';
import { MetaMaskConnector } from 'wagmi/connectors/metaMask';

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

function App() {
  return (
    <>
      <FipDataContextProvider>
        <VoteEndContextProvider>
          <GlobalStyle />
          <WagmiConfig config={config}>
            <Home />
          </WagmiConfig>
        </VoteEndContextProvider>
      </FipDataContextProvider>
    </>
  );
}

export default App;
