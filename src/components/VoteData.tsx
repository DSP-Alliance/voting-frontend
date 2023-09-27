import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import Countdown from 'react-countdown';
import { useContractWrite, useWaitForTransaction } from 'wagmi';
import axios from 'axios';

import FIPInfo from 'components/FIPInfo';
import VotePicker from 'components/VotePicker';
import VotingPower from 'components/VotingPower';
import AddVotePower from 'components/AddVotePower';
import { RPC_URL, publicClient } from 'services/clients';
import { voteTrackerConfig } from 'constants/voteTrackerConfig';
import type { Address } from './Home';

const VoteDataContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const DataSections = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 12px;
`;

const VoteSection = styled.div`
  display: block;
  border: 1px solid var(--blue);
  padding: 24px;
`;

const InfoText = styled.span`
  font-style: italic;
`;

function VoteData({
  address,
  lastFipAddress = '0x',
  lastFipNum,
  countdownValue,
}: {
  address: Address | undefined;
  lastFipAddress: Address | undefined;
  lastFipNum: number | undefined;
  countdownValue: number;
}) {
  const [errorMessage, setErrorMessage] = useState('');
  const [hasVoted, setHasVoted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [minerIds, setMinerIds] = useState<string[]>([]);
  const [rawBytePower, setRawBytePower] = useState('');

  useEffect(() => {
    async function getHasVoted() {
      try {
        const userHasVoted = await publicClient.readContract({
          address: lastFipAddress,
          abi: voteTrackerConfig.abi,
          functionName: 'hasVoted',
          args: [lastFipAddress],
        });

        setHasVoted(userHasVoted);
      } catch {
        setHasVoted(false);
      }
    }

    getHasVoted();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const { data, error, isError, write } = useContractWrite({
    abi: voteTrackerConfig.abi,
    functionName: 'registerVoter',
    // args: [address || `0x`, minerIds],
  });

  const { isLoading, isSuccess } = useWaitForTransaction({
    hash: data?.hash,
  });

  function formatBytes(bytes: number) {
    if (bytes == 0) {
      return '0 Bytes';
    }
    const unitMultiple = 1024; // use binary bytes
    const unitNames = [
      'Bytes',
      'KiB',
      'MiB',
      'GiB',
      'TiB',
      'PiB',
      'EiB',
      'ZiB',
      'YiB',
    ];
    const unitChanges = Math.floor(Math.log(bytes) / Math.log(unitMultiple));
    return (
      parseFloat((bytes / Math.pow(unitMultiple, unitChanges)).toFixed(2)) +
      ' ' +
      unitNames[unitChanges]
    );
  }

  async function addVotingPower(agentAddress: string) {
    setLoading(true);
    try {
      let rawBytes = 0;

      async function getMiners(address: string) {
        const request = await axios.get(
          `https://filfox.info/api/v1/address/${address}`,
        );
        const ownedMiners = request.data.ownedMiners;
        setMinerIds((prev) => [...prev, request.data.ownedMiners]);

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
        await getMiners(agentAddress);
      }

      setRawBytePower(formatBytes(rawBytes));
    } catch (error) {
      setErrorMessage('Error adding Miner IDs');
    } finally {
      setLoading(false);
    }
  }

  return (
    <VoteDataContainer>
      <div>
        Time left: <Countdown date={Date.now() + countdownValue} />
      </div>
      <DataSections>
        <VoteSection>
          <h4>Latest Vote FIP</h4>
          {lastFipNum && <FIPInfo num={lastFipNum} />}
          {!lastFipNum && <InfoText>Last vote data does not exist</InfoText>}
        </VoteSection>
        <VoteSection>
          {!Boolean(countdownValue) && !hasVoted && (
            <>
              <h4>Latest Vote Results</h4>
              {!lastFipNum && (
                <InfoText>Last vote data does not exist</InfoText>
              )}
            </>
          )}
          {Boolean(countdownValue) && !hasVoted && (
            <>
              <h4>Choose Vote</h4>
              {rawBytePower && (
                <VotePicker address={address} minerIds={minerIds} />
              )}
              {!rawBytePower && (
                <AddVotePower
                  addVotingPower={addVotingPower}
                  error={errorMessage}
                  loading={loading}
                />
              )}
            </>
          )}

          {/* https://github.com/0xpluto/fip-voting/blob/master/src/components/TotalVotes.tsx */}
        </VoteSection>
        <VoteSection>
          {/* {hasVoted && <h4>Voting Power</h4>} */}
          {/* https://github.com/0xpluto/fip-voting/blob/e19da9798c2756fcc471a91b1ae03c4f492bb3c3/src/components/VotingPower.tsx */}
          <h4>Wallet Voting Power</h4>
          <VotingPower rawBytePower={rawBytePower} />
        </VoteSection>
      </DataSections>
    </VoteDataContainer>
    // Previous votes chart
    // https://github.com/0xpluto/fip-voting/blob/master/src/components/PreviousVotes.tsx */}
  );
}

export default VoteData;
