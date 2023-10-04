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
import { formatBytesWithLabel } from 'utilities/helpers';
import FIPInfo from 'components/FIPInfo';
import VoteActions from 'components/VoteActions';
import VotingPower from 'components/VotingPower';
import type { Address } from './Home';

const VoteDataContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const DataSections = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 12px;

  @media (max-width: 920px) {
    grid-template-columns: 1fr;
  }
`;

const VoteSection = styled.div`
  display: block;
  border: 1px solid var(--primary);
  padding: 24px;
`;

const InfoText = styled.span`
  font-style: italic;
`;

function VoteData({
  address,
  lastFipAddress,
  lastFipNum,
  loadingFipData,
  countdownValue,
}: {
  address: Address | undefined;
  lastFipAddress: Address | undefined;
  lastFipNum: number | undefined;
  loadingFipData: boolean;
  countdownValue: number;
}) {
  const { isConnected } = useAccount();
  const [agentAddress, setAgentAddress] = useState<Address>(
    '0x0000000000000000000000000000000000000000',
  );
  const [errorMessage, setErrorMessage] = useState('');
  const [hasRegistered, setHasRegistered] = useState(false);
  const [hasVoted, setHasVoted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [minerIds, setMinerIds] = useState<string[]>([]);
  const [rawBytePower, setRawBytePower] = useState('');
  const [tokenPower, setTokenPower] = useState<bigint>(BigInt(0));

  useEffect(() => {
    async function getHasRegistered() {
      if (lastFipAddress) {
        try {
          const userHasRegistered = await publicClient.readContract({
            address: lastFipAddress,
            abi: voteTrackerConfig.abi,
            functionName: 'hasRegistered',
            args: [address || `0x`],
          });

          setHasRegistered(userHasRegistered);
        } catch {
          setHasRegistered(false);
        }
      }
    }

    async function getHasVoted() {
      if (lastFipAddress) {
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
      }
    }

    if (isConnected) {
      getHasRegistered();
      getHasVoted();
    }
  }, [lastFipAddress, address, isConnected]);

  useEffect(() => {
    async function getByteAndTokenPower() {
      if (lastFipAddress) {
        try {
          let userTokenPower = await publicClient.readContract({
            address: lastFipAddress,
            abi: voteTrackerConfig.abi,
            functionName: 'voterWeightToken',
            args: [address || `0x`],
          });

          if (userTokenPower == BigInt(0)) {
            userTokenPower = await publicClient.readContract({
              address: lastFipAddress,
              abi: voteTrackerConfig.abi,
              functionName: 'voterWeightMinerToken',
              args: [address || `0x`],
            });
          }

          setTokenPower(userTokenPower);

          const userBytePower = await publicClient.readContract({
            address: lastFipAddress,
            abi: voteTrackerConfig.abi,
            functionName: 'voterWeightRBP',
            args: [address || `0x`],
          });

          setRawBytePower(
            formatBytesWithLabel(parseInt(userBytePower.toString())),
          );
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

  const { data, error, isError, write } = useContractWrite({
    abi: voteTrackerConfig.abi,
    address: lastFipAddress,
    functionName: 'registerVoter',
    args: [agentAddress, minerIds],
  });

  const { isLoading, isSuccess } = useWaitForTransaction({
    hash: data?.hash,
  });

  async function addVotingPower(agentAddress: string) {
    setLoading(true);
    setAgentAddress(
      getAddress(agentAddress || '0x0000000000000000000000000000000000000000'),
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

      if (agentAddress) {
        const glifOwner = await publicClient.readContract({
          address: getAddress(
            agentAddress || '0x0000000000000000000000000000000000000000',
          ),
          abi: ownableConfig.abi,
          functionName: 'owner',
        });

        if (glifOwner === address) {
          await getMiners(agentAddress);
        }
      }

      setRawBytePower(formatBytesWithLabel(rawBytes));
    } catch (error) {
      setErrorMessage('Error adding Miner IDs');
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
    if (lastFipNum) return <FIPInfo num={lastFipNum} />;
    return <InfoText>Last vote data does not exist</InfoText>;
  }

  return (
    <VoteDataContainer>
      {Boolean(countdownValue) && (
        <div>
          Time left: <Countdown date={Date.now() + countdownValue * 1000} />
        </div>
      )}
      <DataSections>
        <VoteSection>
          <h4>Latest Vote FIP</h4>
          {loadingFipData ? (
            <ClipLoader color='var(--primary)' />
          ) : (
            renderLatestVote()
          )}
        </VoteSection>
        <VoteSection>
          <VoteActions
            addVotingPower={addVotingPower}
            address={address}
            countdownValue={countdownValue}
            errorMessage={errorMessage || error?.message}
            hasRegistered={hasRegistered}
            hasVoted={hasVoted}
            loadingFipData={loadingFipData}
            lastFipNum={lastFipNum}
            lastFipAddress={lastFipAddress}
            loading={loading}
            minerIds={minerIds}
            rawBytePower={rawBytePower}
            registering={isLoading}
            setHasVoted={setHasVoted}
            tokenPower={tokenPower}
            write={write}
          />
        </VoteSection>
        <VoteSection>
          <VotingPower
            hasVoted={hasVoted}
            hasRegistered={hasRegistered}
            rawBytePower={rawBytePower}
            tokenPower={tokenPower}
          />
        </VoteSection>
      </DataSections>
    </VoteDataContainer>
  );
}

export default VoteData;
