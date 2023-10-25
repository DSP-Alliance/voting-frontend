import React, { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import styled from 'styled-components';

import { voteFactoryConfig } from 'constants/voteFactoryConfig';
import { publicClient } from 'services/clients';
import Connectors from './Connectors';
import VoteData from './VoteData';
import VoteHistory from './VoteHistory';
import VoteFactoryModal from './VoteFactoryModal';
import MultisigRegisterModal from './MultisigRegister';
import ManualMinerRegisterModal from './ManualMinerRegister';
import { useVoteEndContext } from './VoteEndContext';

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
  height: 150px;
  font-size: 24px;
  margin-bottom: 24px;
  background-color: #000;
  color: #fff;
`;

const HeaderText = styled.div`
  grid-column-start: 2;
  justify-self: center;
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

const MultisigRegisterButton = styled.button`
  grid-column-start: 2;
  width: 120px;
  justify-self: center;
`;

const VoteContent = styled.div`
  margin: 24px;
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

function Home() {
  const { address, isConnected } = useAccount();
  const [isOwner, setIsOwner] = useState(false);
  const [showVoteFactory, setShowVoteFactory] = useState(false);
  const [showMultisigRegister, setShowMultisigRegister] = useState(false);
  const [showMinerRegister, setShowMinerRegister] = useState(false);

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
          <Connectors />
        </Header>
        <ButtonContainer>
          {isOwner && (voteEndTime ? voteEndTime <= Date.now() : true) && (
            <StartVoteButton onClick={() => setShowVoteFactory(true)}>
              Start Vote
            </StartVoteButton>
          )}
          <MultisigRegisterButton onClick={() => setShowMultisigRegister(true)}>
            Register Multisig
          </MultisigRegisterButton>
          <MultisigRegisterButton onClick={() => setShowMinerRegister(true)}>
            Register Miner
          </MultisigRegisterButton>
        </ButtonContainer>
        {showVoteFactory && (
          <VoteFactoryModal
            open={showVoteFactory}
            closeModal={() => setShowVoteFactory(false)}
          />
        )}
        {showMultisigRegister && (
          <MultisigRegisterModal
            open={showMultisigRegister}
            closeModal={() => setShowMultisigRegister(false)}
          />
        )}
        {showMinerRegister && (
          <ManualMinerRegisterModal
            open={showMinerRegister}
            closeModal={() => setShowMinerRegister(false)}
          />
        )}
        <VoteContent>
          <VoteData address={address} />
          <VoteHistory />
        </VoteContent>
      </HomeContainer>
    </>
  );
}

export default Home;
