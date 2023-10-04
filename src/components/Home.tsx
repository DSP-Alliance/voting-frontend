import React, { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import styled from 'styled-components';

import { voteFactoryConfig } from 'constants/voteFactoryConfig';
import { voteTrackerConfig } from 'constants/voteTrackerConfig';
import { publicClient } from 'services/clients';
import Connectors from './Connectors';
import VoteData from './VoteData';
import VoteHistory from './VoteHistory';
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
  height: 34px;
`;

const StartVoteButton = styled.button`
  grid-column-start: 2;
  width: 100px;
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
  const [countdownValue, setCountdownValue] = useState<number>(0);
  const [fipAddresses, setFipAddresses] = useState<Address[]>([]);
  const [fipList, setFipList] = useState<number[]>([]);
  const [isOwner, setIsOwner] = useState(false);
  const [lastFipNum, setLastFipNum] = useState<number>();
  const [loadingFipData, setLoadingFipData] = useState(true);
  const [showVoteFactory, setShowVoteFactory] = useState(false);

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

  async function getFipData() {
    try {
      const deployedCount: bigint = await publicClient.readContract({
        abi: voteFactoryConfig.abi,
        address: voteFactoryConfig.address,
        functionName: 'deployedVotesLength',
      });

      const promises = [];
      for (let i = 0; i < deployedCount; i++) {
        promises.push(
          publicClient.readContract({
            abi: voteFactoryConfig.abi,
            address: voteFactoryConfig.address,
            functionName: 'deployedVotes',
            args: [BigInt(i)],
          }),
        );
      }
      const voteAddresses: Address[] = await Promise.all(promises);

      setFipAddresses(voteAddresses);

      const fips = await Promise.all(
        voteAddresses.map((fipAddress) => {
          return publicClient.readContract({
            abi: voteTrackerConfig.abi,
            address: fipAddress,
            functionName: 'FIP',
          });
        }),
      );

      setFipList(fips);
      setLastFipNum(fips[fips.length - 1]);
      setLoadingFipData(false);
    } catch (error) {
      setFipAddresses([]);
      setLastFipNum(undefined);
      setLoadingFipData(false);
    }
  }

  useEffect(() => {
    getFipData();
  }, []);

  useEffect(() => {
    async function isLastVoteRunning() {
      const voteStartTime = await publicClient.readContract({
        abi: voteTrackerConfig.abi,
        address: fipAddresses[fipAddresses.length - 1],
        functionName: 'voteStart',
      });

      const voteLength = await publicClient.readContract({
        abi: voteTrackerConfig.abi,
        address: fipAddresses[fipAddresses.length - 1],
        functionName: 'voteLength',
      });

      const voteEndTime = voteStartTime + voteLength;
      const currentTime = Math.floor(Date.now() / 1000);

      if (currentTime < voteEndTime) {
        setCountdownValue(voteEndTime - currentTime);
      }
    }

    if (lastFipNum) isLastVoteRunning();
  }, [lastFipNum, fipAddresses]);

  return (
    <HomeContainer>
      <Header>
        <HeaderText>FIP Voting Dashboard</HeaderText>
        <Connectors />
      </Header>
      <ButtonContainer>
        {isOwner && !Boolean(countdownValue) && (
          <StartVoteButton onClick={() => setShowVoteFactory(true)}>
            Start Vote
          </StartVoteButton>
        )}
      </ButtonContainer>
      {showVoteFactory && (
        <VoteFactoryModal
          open={showVoteFactory}
          closeModal={() => setShowVoteFactory(false)}
          getFipData={getFipData}
        />
      )}
      <VoteContent>
        <VoteData
          address={address}
          lastFipAddress={fipAddresses[fipAddresses.length - 1]}
          lastFipNum={lastFipNum}
          countdownValue={countdownValue}
          loadingFipData={loadingFipData}
        />
        <VoteHistory fips={fipList} />
      </VoteContent>
    </HomeContainer>
  );
}

export default Home;
