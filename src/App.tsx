import React, { useState } from 'react';
import styled from 'styled-components';
import { WagmiConfig, createConfig } from 'wagmi';
import { CoinbaseWalletConnector } from 'wagmi/connectors/coinbaseWallet';
import { MetaMaskConnector } from 'wagmi/connectors/metaMask';

import { publicClient } from './services/clients';
import Connectors from './components/Connectors';
import VoteData from './components/VoteData';
import { VoteFactory } from './components/VoteFactory';

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
  const [currentTab, setCurrentTab] = useState('voteData');
  // const { isOwner } = account;
  const isOwner = true;

  function renderTabs() {
    return (
      <div>
        <button onClick={() => setCurrentTab('voteData')}>Vote Data</button>
        <button onClick={() => setCurrentTab('voteFactory')}>
          Vote Factory
        </button>
      </div>
    );
  }

  return (
    <>
      <Header>FIP WIP</Header>
      <WagmiConfig config={config}>
        <Connectors />
        {renderTabs()}
        {currentTab === 'voteData' && <VoteData />}
        {currentTab === 'voteFactory' && <VoteFactory />}
      </WagmiConfig>
    </>
  );
}

export default App;
