import React, { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import styled from 'styled-components';

import Connectors from './Connectors';
import VoteData from './VoteData';
import VoteFactory from './VoteFactory';
import { voteFactoryConfig } from 'constants/voteFactoryConfig';
import { publicClient } from 'services/clients';

const TabsContainer = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 12px;

  p {
    font-size: 16px;
    color: gray;
  }
`;

const Tab = styled.button`
  background: none;
  border: none;

  &:hover {
    cursor: pointer;
  }
`;

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

      // setIsOwner(owner === address);
      setIsOwner(true);
    }

    getOwner();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  function renderTabs() {
    return (
      <TabsContainer>
        {isOwner && (
          <>
            <Tab onClick={() => setCurrentTab('voteData')}>
              <p>Vote Data</p>
            </Tab>
            <Tab onClick={() => setCurrentTab('voteFactory')}>
              <p>Vote Factory</p>
            </Tab>
          </>
        )}
        {!isOwner && <p>Vote Data</p>}
      </TabsContainer>
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
