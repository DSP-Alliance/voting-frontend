import React, { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';

import Connectors from './Connectors';
import VoteData from './VoteData';
import VoteFactory from './VoteFactory';
import { voteFactoryConfig } from 'constants/voteFactoryConfig';
import { publicClient } from 'services/clients';

function Home() {
  const [currentTab, setCurrentTab] = useState('voteData');
  const [isOwner, setIsOwner] = useState(false);
  const { address } = useAccount();

  useEffect(() => {
    async function getOwner() {
      const owner = await publicClient.readContract({
        abi: voteFactoryConfig.abi,
        address: voteFactoryConfig.address,
        functionName: 'owner',
      });

      setIsOwner(owner === address);
    }

    getOwner();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  function renderTabs() {
    return (
      <div>
        {isOwner && (
          <>
            <button onClick={() => setCurrentTab('voteData')}>Vote Data</button>
            <button onClick={() => setCurrentTab('voteFactory')}>
              Vote Factory
            </button>
          </>
        )}
        {!isOwner && <h4>Vote Data</h4>}
      </div>
    );
  }

  return (
    <>
      <Connectors />
      {renderTabs()}
      {currentTab === 'voteData' && <VoteData />}
      {currentTab === 'voteFactory' && <VoteFactory />}
    </>
  );
}

export default Home;
