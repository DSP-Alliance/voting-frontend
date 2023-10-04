import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import ClipLoader from 'react-spinners/ClipLoader';
import { Cell, PieChart, Pie, Tooltip } from 'recharts';

import { publicClient } from 'services/clients';
import { voteTrackerConfig } from 'constants/voteTrackerConfig';
import VotePicker from 'components/VotePicker';
import Register from 'components/Register';
import { formatBytesWithLabel } from 'utilities/helpers';
import type { Address } from './Home';

interface VoteActionsProps {
  address: Address | undefined;
  addVotingPower: (agentAddress: string) => void;
  countdownValue: number;
  errorMessage: string | undefined;
  hasRegistered: boolean;
  hasVoted: boolean;
  loadingFipData: boolean;
  lastFipNum: number | undefined;
  lastFipAddress: Address | undefined;
  loading: boolean;
  minerIds: bigint[];
  rawBytePower: string;
  registering: boolean;
  setHasVoted: React.Dispatch<React.SetStateAction<boolean>>;
  tokenPower: bigint | null;
  write: () => void;
}

const InfoText = styled.span`
  font-style: italic;
`;

const ChartArea = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const Legend = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
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
  minerIds,
  rawBytePower,
  registering,
  setHasVoted,
  tokenPower,
  write,
}: VoteActionsProps) {
  const [data, setData] = useState<{ [key: string]: string | number }[]>([]);
  const [totalRbp, setTotalRbp] = useState('4 Bytes');
  const [totalTokens, setTotalTokens] = useState('12 Bytes');
  const [totalMinerTokens, setTotalMinerTokens] = useState('16 Bytes');

  useEffect(() => {
    if (lastFipAddress) {
      Promise.all([
        publicClient.readContract({
          address: lastFipAddress,
          abi: voteTrackerConfig.abi,
          functionName: 'yesOptions',
          args: [BigInt(0)],
        }),
        publicClient.readContract({
          address: lastFipAddress,
          abi: voteTrackerConfig.abi,
          functionName: 'yesOptions',
          args: [BigInt(1)],
        }),
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
      ]).then(
        ([yesOption1, yesOption2, rbpVotes, minerTokenVotes, tokenVotes]) => {
          setTotalRbp(
            formatBytesWithLabel(rbpVotes.reduce((a, b) => a + Number(b), 0)),
          );
          setTotalTokens(
            formatBytesWithLabel(tokenVotes.reduce((a, b) => a + Number(b), 0)),
          );
          setTotalMinerTokens(
            formatBytesWithLabel(
              minerTokenVotes.reduce((a, b) => a + Number(b), 0),
            ),
          );
          setData([
            {
              name: `${yesOption1}`,
              RPB: Number(rbpVotes[0]),
              Tokens: Number(minerTokenVotes[0]),
              'Miner Tokens': Number(tokenVotes[0]),
            },
            {
              name: `${yesOption2}`,
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
        },
      );
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  function renderVoteResults() {
    if (lastFipNum) {
      if (data.length === 0) return <InfoText>No vote data</InfoText>;

      return (
        <ChartArea>
          <PieChart width={300} height={300}>
            <Pie
              data={data}
              dataKey='RBP'
              nameKey='name'
              cx='50%'
              cy='50%'
              innerRadius={5}
              outerRadius={50}
            >
              {data.map((entry, index) => (
                <Cell key={index} fill={`var(--rbpcountlight${index}`} />
              ))}
            </Pie>
            <Pie
              data={data}
              dataKey='Tokens'
              nameKey='name'
              cx='50%'
              cy='50%'
              innerRadius={55}
              outerRadius={85}
            >
              {data.map((entry, index) => (
                <Cell key={index} fill={`var(--tokencountlight${index}`} />
              ))}
            </Pie>
            <Pie
              data={data}
              dataKey='Miner Tokens'
              nameKey='name'
              cx='50%'
              cy='50%'
              innerRadius={90}
              outerRadius={120}
            >
              {data.map((entry, index) => (
                <Cell key={index} fill={`var(--minertokencountlight${index}`} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
          <Legend>
            <div>
              <span>
                Inner: <br /> RBP, total: {totalRbp}
              </span>
            </div>
            <div>
              Middle: <br /> Tokens, total: {totalTokens}
            </div>
            <div>
              Outer: <br /> Miner Tokens, total: {totalMinerTokens}
            </div>
          </Legend>
        </ChartArea>
      );
    }
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
              minerIds={minerIds}
              rawBytePower={rawBytePower}
              registering={registering}
              tokenPower={tokenPower}
              write={write}
            />
          )}
        </>
      )}
    </>
  );
}

export default VoteActions;
