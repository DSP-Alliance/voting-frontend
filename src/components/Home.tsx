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
  const { address = `0x` } = useAccount();
  const [countdownValue, setCountdownValue] = useState<number>(0);
  const [fipAddresses, setFipAddresses] = useState<Address[]>([]);
  const [fipList, setFipList] = useState<number[]>([]);
  const [lastFipNum, setLastFipNum] = useState<number>();
  const [isOwner, setIsOwner] = useState(false);
  const [showVoteFactory, setShowVoteFactory] = useState(false);

  useEffect(() => {
    async function getOwner() {
      try {
        const owner = await publicClient.readContract({
          abi: voteFactoryConfig.abi,
          address: voteFactoryConfig.address,
          functionName: 'starters',
          args: [address],
        });

        if (owner) setIsOwner(true);
      } catch (error) {
        console.error(error);
      }
    }

    // getOwner();
    setIsOwner(true);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  console.log('hi lisa isowner ', isOwner);
  useEffect(() => {
    let index = 0;
    async function getVoteData() {
      try {
        const deployedCount: number = await publicClient.readContract({
          abi: voteFactoryConfig.abi,
          address: voteFactoryConfig.address,
          functionName: 'deployedVotesLength',
        });

        const promises = [];
        for (let i = 0; i < deployedCount; i++) {
          promises.push(publicClient.readContract({
            abi: voteFactoryConfig.abi,
            address: voteFactoryConfig.address,
            functionName: 'deployedVotes',
            args: [BigInt(index)],
          }));
        }
        const voteAddresses: Address[] = await Promise.all(promises);

        setFipAddresses(voteAddresses);
      } catch (error) {
        setLastFipNum(undefined);
      }
    }

    getVoteData();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    async function getFipNums() {
      try {
        const fips = await Promise.all(
          fipAddresses.map((fipAddress) => {
            return publicClient.readContract({
              abi: voteTrackerConfig.abi,
              address: fipAddress,
              functionName: 'FIP',
            });
          }),
        );
        setFipList(fips);
        setLastFipNum(fips[fips.length - 1]);
      } catch {
        setLastFipNum(undefined);
      }
    }

    if (fipAddresses) getFipNums();
  }, [fipAddresses]);

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
      const currentTime = Date.now();

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
          address={address}
          open={showVoteFactory}
          closeModal={() => setShowVoteFactory(false)}
        />
      )}
      <VoteContent>
        <VoteData
          address={address}
          lastFipAddress={fipAddresses[fipAddresses.length - 1]}
          lastFipNum={lastFipNum}
          countdownValue={countdownValue}
        />
        <VoteHistory fips={fipList} />
      </VoteContent>
    </HomeContainer>
  );
}

export default Home;
