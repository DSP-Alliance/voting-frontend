import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import ClipLoader from 'react-spinners/ClipLoader';
import { PieChart } from 'recharts';

import { publicClient } from 'services/clients';
import { voteTrackerConfig } from 'constants/voteTrackerConfig';
import VotePicker from 'components/VotePicker';
import Register from 'components/Register';
import type { Address } from './Home';

interface VoteActionsProps {
  address: Address | undefined;
  addVotingPower: (agentAddress: string) => void;
  countdownValue: number;
  errorMessage: string;
  hasRegistered: boolean;
  hasVoted: boolean;
  loadingFipData: boolean;
  lastFipNum: number | undefined;
  lastFipAddress: Address | undefined;
  loading: boolean;
  setHasVoted: React.Dispatch<React.SetStateAction<boolean>>;
  write: () => void;
}

const InfoText = styled.span`
  font-style: italic;
`;

function VoteActions({
  addVotingPower,
  countdownValue,
  errorMessage,
  hasRegistered,
  hasVoted,
  loadingFipData,
  lastFipNum,
  lastFipAddress,
  loading,
  setHasVoted,
  write,
}: VoteActionsProps) {
  const [data, setData] = useState<{ [key: string]: any }[]>();

  useEffect(() => {
    if (lastFipAddress) {
      Promise.all([
        publicClient.readContract({
          abi: voteTrackerConfig.abi,
          address: lastFipAddress,
          functionName: 'getVoteResultsRBP',
        }),
        publicClient.readContract({
          abi: voteTrackerConfig.abi,
          address: lastFipAddress,
          functionName: 'getVoteResultsMinerToken',
        }),
        publicClient.readContract({
          abi: voteTrackerConfig.abi,
          address: lastFipAddress,
          functionName: 'getVoteResultsToken',
        }),
      ]).then(([rbpVotes, minerTokenVotes, tokenVotes]) => {
        setData([
          {
            name: 'Yes 1',
            RPB: Number(rbpVotes[0]),
            Tokens: Number(minerTokenVotes[0]),
            'Miner Tokens': Number(tokenVotes[0]),
          },
          {
            name: 'Yes 2',
            RPB: Number(rbpVotes[1]),
            Tokens: Number(minerTokenVotes[1]),
            'Miner Tokens': Number(tokenVotes[1]),
          },
          {
            name: 'No',
            RPB: Number(rbpVotes[2]),
            Tokens: Number(minerTokenVotes[2]),
            'Miner Tokens': Number(tokenVotes[2]),
          },
          {
            name: 'Abstain',
            RPB: Number(rbpVotes[3]),
            Tokens: Number(minerTokenVotes[3]),
            'Miner Tokens': Number(tokenVotes[3]),
          },
        ]);
      });
    }
  }, []);

  function renderVoteResults() {
    if (lastFipNum) return <PieChart data={data} />;
    return <InfoText>Last vote data does not exist</InfoText>;
  }

  return (
    <>
      {(!Boolean(countdownValue) || hasVoted) && (
        <>
          <h4>Latest Vote Results</h4>
          {loadingFipData ? (
            <ClipLoader color='var(--primary)' />
          ) : (
            renderVoteResults()
          )}
        </>
      )}
      {Boolean(countdownValue) && !hasVoted && (
        <>
          <h4>Choose Vote</h4>
          {hasRegistered && (
            <VotePicker
              setHasVoted={setHasVoted}
              lastFipAddress={lastFipAddress}
            />
          )}
          {!hasRegistered && (
            <Register
              addVotingPower={addVotingPower}
              error={errorMessage}
              loading={loading}
              write={write}
            />
          )}
        </>
      )}
    </>
  );
}

export default VoteActions;
