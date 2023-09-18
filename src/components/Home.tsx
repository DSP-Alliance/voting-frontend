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

const ButtonContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
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

      // setIsOwner(owner === address);
      setIsOwner(true);
    }

    getOwner();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <HomeContainer>
      <ButtonContainer>
        {isOwner && (
          <StartVoteButton onClick={() => setShowVoteFactory(true)}>
            Start Vote
          </StartVoteButton>
        )}
        <Connectors />
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
