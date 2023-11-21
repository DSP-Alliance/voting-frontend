import React, { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import styled from 'styled-components';

import { voteFactoryConfig } from 'constants/voteFactoryConfig';
import { publicClient } from 'services/clients';
import ConnectorsModal from 'components/Wallet/ConnectorsModal';
import LatestVote from 'components/LatestVote';
import VoteHistory from 'components/VoteHistory';
import VoteFactoryModal from 'components/VoteFactory';
import RegisterModal from 'components/Wallet/RegisterModal';
import WalletMenu from 'components/Wallet/WalletMenu';
import { useVoteEndContext } from 'common/VoteEndContext';

export type Address = `0x${string}`;

const HomeContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
  border-bottom: 1px solid var(--divider);
  margin-bottom: 8px;
  padding: 24px;
  background-color: var(--bg-color);
  color: var(--primary);
`;

const HeaderText = styled.div`
  justify-self: center;
  font-family: var(--titlefontlight);
  font-size: 24px;
  font-weight: 600;
  text-transform: uppercase;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  height: 34px;
`;

const StartVoteButton = styled.button`
  grid-column-start: 2;
  width: 100px;
  justify-self: center;
`;

const VoteContent = styled.div`
  margin: 8px 24px;
  display: flex;
  flex-direction: column;
`;

function Home() {
  const { address, isConnected } = useAccount();
  const [showConnectors, setShowConnectors] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [showVoteFactory, setShowVoteFactory] = useState(false);

  const { voteEndTime } = useVoteEndContext();

  useEffect(() => {
    async function getOwner() {
      try {
        const owner = await publicClient.readContract({
          abi: voteFactoryConfig.abi,
          address: voteFactoryConfig.address,
          functionName: 'starters',
          args: [address || '0x0000000000000000000000000000000000000000'],
        });

        if (owner) setIsOwner(true);
      } catch (error) {
        console.error(error);
      }
    }

    if (isConnected) getOwner();
  }, [isConnected]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <HomeContainer>
        <Header>
          <HeaderText>FIP Voting Dashboard</HeaderText>
          <ButtonContainer>
            {isOwner && (voteEndTime ? voteEndTime <= Date.now() : true) && (
              <StartVoteButton onClick={() => setShowVoteFactory(true)}>
                Start Vote
              </StartVoteButton>
            )}
            <button onClick={() => setShowRegister(true)}>Register</button>
            {!isConnected && (
              <button onClick={() => setShowConnectors(true)}>Connect</button>
            )}
            {isConnected && <WalletMenu />}
          </ButtonContainer>
        </Header>
        {showRegister && (
          <RegisterModal
            open={showRegister}
            closeModal={() => setShowRegister(false)}
          />
        )}
        {showConnectors && (
          <ConnectorsModal
            open={showConnectors}
            closeModal={() => setShowConnectors(false)}
          />
        )}
        {showVoteFactory && (
          <VoteFactoryModal
            open={showVoteFactory}
            closeModal={() => setShowVoteFactory(false)}
          />
        )}
        <VoteContent>
          <LatestVote address={address} />
          <VoteHistory />
        </VoteContent>
      </HomeContainer>
    </>
  );
}

export default Home;
