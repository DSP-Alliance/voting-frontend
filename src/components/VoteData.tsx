import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import Countdown from 'react-countdown';
import { useAccount, useContractWrite, useWaitForTransaction } from 'wagmi';
import { getAddress } from 'viem';
import axios from 'axios';
import ClipLoader from 'react-spinners/ClipLoader';

import { voteTrackerConfig } from 'constants/voteTrackerConfig';
import { ownableConfig } from 'constants/ownableConfig';
import { RPC_URL, publicClient } from 'services/clients';
import { formatBytesWithLabel, ZERO_ADDRESS } from 'utilities/helpers';
import FIPInfo from 'components/FIPInfo';
import VoteActions from 'components/VoteActions';
import VotingPower from 'components/VotingPower';
import type { Address } from 'components/Home';
import { voteFactoryConfig } from 'constants/voteFactoryConfig';
import { useVoteEndContext } from 'common/VoteEndContext';
import { useFipDataContext } from 'common/FipDataContext';

const VoteDataContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin: 24px;
`;

const DataSections = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;

  @media (max-width: 920px) {
    grid-template-columns: 1fr;
  }
`;

const CountdownContainer = styled.div`
  height: 20px;
`;

const VoteSection = styled.div`
  display: block;
  border: 1px solid var(--primary);
  padding: 24px;
`;

const LoaderContainer = styled.div`
  display: flex;
  justify-content: center;
`;

const InfoText = styled.span`
  font-style: italic;
`;

function VoteData({ address }: { address: Address | undefined }) {
  const { isConnected } = useAccount();
  const [agentAddress, setAgentAddress] = useState<Address>(ZERO_ADDRESS);
  const [errorMessage, setErrorMessage] = useState('');
  const [hasRegistered, setHasRegistered] = useState(false);
  const [hasVoted, setHasVoted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [minerIds, setMinerIds] = useState<string[]>([]);
  const [rawBytePower, setRawBytePower] = useState('');
  const [tokenPower, setTokenPower] = useState<bigint>(BigInt(0));

  const { lastFipAddress, lastFipNum, loadingFipData } = useFipDataContext();
  const { voteEndTime } = useVoteEndContext();

  async function getHasRegistered() {
    if (lastFipAddress) {
      try {
        const userHasRegistered = await publicClient.readContract({
          address: voteFactoryConfig.address,
          abi: voteFactoryConfig.abi,
          functionName: 'registered',
          args: [address || `0x`],
        });

        setHasRegistered(userHasRegistered);
      } catch {
        setHasRegistered(false);
      }
    }
  }

  async function getHasVoted() {
    if (
      lastFipAddress &&
      lastFipAddress !== localStorage.getItem('lastFipVoted')
    ) {
      try {
        const userHasVoted = await publicClient.readContract({
          address: lastFipAddress,
          abi: voteTrackerConfig.abi,
          functionName: 'hasVoted',
          args: [address || `0x`],
        });

        setHasVoted(userHasVoted);
      } catch {
        setHasVoted(false);
      }
    } else if (
      lastFipAddress &&
      lastFipAddress === localStorage.getItem('lastFipVoted')
    ) {
      setHasVoted(true);
    }
  }

  useEffect(() => {
    if (isConnected) {
      getHasRegistered();
      getHasVoted();
    }
  }, [lastFipAddress, address, isConnected]);

  useEffect(() => {
    async function getByteAndTokenPower() {
      if (lastFipAddress) {
        try {
          const [tokenPower, bytePower, minerTokenPower] =
            await publicClient.readContract({
              address: lastFipAddress || ZERO_ADDRESS,
              abi: voteTrackerConfig.abi,
              functionName: 'getVotingPower',
              args: [address || ZERO_ADDRESS],
            });

          console.log(address, lastFipAddress);
          console.log(tokenPower, bytePower, minerTokenPower);
          setRawBytePower(formatBytesWithLabel(parseInt(bytePower.toString())));
          console.log('set rbp and token from getByteAndTokenPower');
          setTokenPower(bytePower > 0 ? minerTokenPower : tokenPower);
        } catch {
          setTokenPower(BigInt(0));
          setRawBytePower('');
        }
      }
    }

    if (hasRegistered) {
      getByteAndTokenPower();
    }
  }, [hasRegistered, address, lastFipAddress]);

  const {
    data,
    error,
    isLoading: isLoadingWrite,
    write,
  } = useContractWrite({
    abi: voteFactoryConfig.abi,
    address: voteFactoryConfig.address,
    functionName: 'register',
    args: [agentAddress, minerIds.map((id) => BigInt(id.replace('f0', '')))],
  });

  const { isLoading: isLoadingWait, isSuccess } = useWaitForTransaction({
    hash: data?.hash,
  });

  async function addVotingPower(agentAddress: string) {
    setLoading(true);
    setAgentAddress(
      getAddress(agentAddress.length > 0 ? agentAddress : ZERO_ADDRESS),
    );

    try {
      let rawBytes = 0;

      async function getMiners(address: string) {
        const request = await axios.get(
          `https://filfox.info/api/v1/address/${address}`,
        );
        const ownedMiners = request.data.ownedMiners;
        setMinerIds((prev) => [...prev, ...request.data.ownedMiners]);

        const promises: Promise<any>[] = [];

        ownedMiners.map((minerId: string) => {
          promises.push(
            axios.post(RPC_URL, {
              headers: { 'Content-Type': 'application/json' },
              jsonrpc: '2.0',
              method: 'Filecoin.StateMinerPower',
              params: [minerId, null],
              id: 1,
            }),
          );
        });

        const promiseArray = await Promise.all(promises);
        rawBytes = promiseArray.reduce(
          (acc, result) =>
            acc + parseInt(result.data.result.MinerPower.RawBytePower),
          0,
        );
      }

      await getMiners(address as string);

      if (agentAddress.length > 0) {
        const glifOwner = await publicClient.readContract({
          address: getAddress(agentAddress || ZERO_ADDRESS),
          abi: ownableConfig.abi,
          functionName: 'owner',
        });

        if (glifOwner === address) {
          await getMiners(agentAddress);
        }
      }

      const [tokenPower, bytePower, minerTokenPower] =
        await publicClient.readContract({
          address: lastFipAddress || ZERO_ADDRESS,
          abi: voteTrackerConfig.abi,
          functionName: 'getVotingPower',
          args: [address || ZERO_ADDRESS],
        });

      setRawBytePower(formatBytesWithLabel(rawBytes));
      setTokenPower(tokenPower);
    } catch (error) {
      console.error(error);
      setErrorMessage('Error registering you to vote');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (isSuccess) {
      setHasRegistered(true);
    }
  }, [isSuccess]);

  function renderLatestVote() {
    if (lastFipNum) return <FIPInfo />;
    return <InfoText>Last vote data does not exist</InfoText>;
  }

  return (
    <VoteDataContainer>
      <CountdownContainer>
        {voteEndTime && voteEndTime > Date.now() && (
          <span>
            Time left: <Countdown date={voteEndTime} />
          </span>
        )}
      </CountdownContainer>
      <DataSections>
        <VoteSection>
          <h4>Latest Vote FIP</h4>
          {loadingFipData ? (
            <LoaderContainer>
              <ClipLoader color='var(--primary)' />
            </LoaderContainer>
          ) : (
            renderLatestVote()
          )}
        </VoteSection>
        <VoteSection>
          <VoteActions
            addVotingPower={addVotingPower}
            errorMessage={errorMessage || error?.message}
            hasRegistered={hasRegistered}
            hasVoted={hasVoted}
            loading={loading}
            minerIds={minerIds}
            rawBytePower={rawBytePower}
            registering={isLoadingWrite || isLoadingWait}
            setHasVoted={setHasVoted}
            tokenPower={tokenPower}
            write={write}
          />
        </VoteSection>
        {voteEndTime && voteEndTime > Date.now() && (
          <VoteSection>
            <VotingPower
              hasRegistered={hasRegistered}
              rawBytePower={rawBytePower}
              tokenPower={tokenPower}
            />
          </VoteSection>
        )}
      </DataSections>
    </VoteDataContainer>
  );
}

export default VoteData;
