import React, { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import styled from 'styled-components';

import { voteFactoryConfig } from 'constants/voteFactoryConfig';
import { publicClient } from 'services/clients';
import Connectors from './Connectors';
import VoteData from './VoteData';
import VoteFactoryModal from './VoteFactoryModal';

export type Address = `0x${string}`;

const HomeContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const Header = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  justify-content: end;
  align-items: center;
  gap: 100px;
  height: 100px;
  font-size: 24px;
  font-family: 'PP Formula';
  margin-bottom: 24px;
  background-color: var(--portal2023-black);
  color: var(--portal2023-cream);
`;

const HeaderText = styled.div`
  grid-column-start: 2;
  justify-self: center;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
`;

const StartVoteButton = styled.button`
  grid-column-start: 2;
  width: 100px;
  justify-self: center;
`;

function Home() {
  const [showVoteFactory, setShowVoteFactory] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const { address = `0x` } = useAccount();

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

  return (
    <HomeContainer>
      <Header>
        <HeaderText>FIP WIP</HeaderText>
        <Connectors />
      </Header>
      <ButtonContainer>
        {isOwner && (
          <StartVoteButton onClick={() => setShowVoteFactory(true)}>
            Start Vote
          </StartVoteButton>
        )}
      </ButtonContainer>
      {showVoteFactory && (
        <VoteFactoryModal
          address={address}
          open={showVoteFactory}
          closeModal={() => setShowVoteFactory(false)}
        />
      )}
      <VoteData address={address} />
    </HomeContainer>
  );
}

export default Home;
