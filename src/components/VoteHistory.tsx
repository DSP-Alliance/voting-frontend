import React, { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import { voteTrackerConfig } from 'constants/voteTrackerConfig';
import { publicClient } from 'services/clients';
import { voteFactoryConfig } from 'constants/voteFactoryConfig';

const Container = styled.div`
  display: grid;
  grid-template-columns: 150px 300px auto;
  gap: 12px;
`;

const QuestionText = styled.div`
  overflow-wrap: break-word;
  margin-top: 24px;
`;

const ChartArea = styled.div`
  margin: 24px;
`;

function VoteHistory({ fips }: { fips: number[] }) {
  const [data, setData] = useState<{ [key: string]: any }[]>([]);
  const [selectedFip, setSelectedFip] = useState('');
  const [questionText, setQuestionText] = useState('');
  const [startTime, setStartTime] = useState<number>(0);
  const [length, setLength] = useState<number>(0);
  const [winningVote, setWinningVote] = useState<number>();

  useEffect(() => {
    if (selectedFip) {
      // We use a promise here as multicall is enabled for this client
      // Meaning that we can reduce our load on the RPC URL and get data back faster.
      publicClient
        .readContract({
          abi: voteFactoryConfig.abi,
          address: voteFactoryConfig.address,
          functionName: 'FIPnumToAddress',
          args: [parseInt(selectedFip)],
        })
        .then((addr) => {
          Promise.all([
            publicClient.readContract({
              abi: voteTrackerConfig.abi,
              address: addr,
              functionName: 'voteStart',
            }),
            publicClient.readContract({
              abi: voteTrackerConfig.abi,
              address: addr,
              functionName: 'voteLength',
            }),
            publicClient.readContract({
              abi: voteTrackerConfig.abi,
              address: addr,
              functionName: 'question',
            }),
            publicClient.readContract({
              abi: voteTrackerConfig.abi,
              address: addr,
              functionName: 'getVoteResultsRBP',
            }),
            publicClient.readContract({
              abi: voteTrackerConfig.abi,
              address: addr,
              functionName: 'getVoteResultsMinerToken',
            }),
            publicClient.readContract({
              abi: voteTrackerConfig.abi,
              address: addr,
              functionName: 'getVoteResultsToken',
            }),
            publicClient.readContract({
              abi: voteTrackerConfig.abi,
              address: addr,
              functionName: 'winningVote',
            }),
          ]).then(
            ([
              startTime,
              length,
              question,
              rbpVotes,
              minerTokenVotes,
              tokenVotes,
              winningVote, // This is quite ugly.
            ]) => {
              setQuestionText(question);
              setStartTime(startTime);
              setLength(length);
              setWinningVote(winningVote);
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
            },
          );
        });
    }
  }, [selectedFip]);

  const timestamp = new Date(startTime * 1000).toLocaleString();

  const timeLength = () => {
    let hours = 0;
    const minutes = length / 60;
    if (minutes > 60) {
      hours = minutes / 60;
    }

    return hours
      ? `${hours} hours` + minutes && `, ${minutes} minutes`
      : `${minutes} minutes`;
  };

  const winningVoteText = () => {
    if (winningVote === 0) return 'Yes 1';
    if (winningVote === 1) return 'Yes 1';
    if (winningVote === 2) return 'Yes 1';
    if (winningVote === 3) return 'Yes 1';
  };

  return (
    <Container>
      <div>
        <h3>Vote History</h3>
        <FormControl sx={{ m: 1, minWidth: 120 }} size='small'>
          <InputLabel>FIP</InputLabel>
          <Select
            value={selectedFip}
            label='FIP'
            onChange={(e) => setSelectedFip(e.target.value)}
          >
            {Boolean(fips.length) &&
              fips.map((fip) => {
                return (
                  <MenuItem key={fip} value={fip}>
                    {fip}
                  </MenuItem>
                );
              })}
          </Select>
        </FormControl>
      </div>
      <div>
        {questionText && <QuestionText>{questionText}</QuestionText>}
        {Boolean(startTime) && <p>Started: {timestamp}</p>}
        {Boolean(length) && <p>Length of time: {timeLength()}</p>}
        {winningVote && <p>Winning vote: {winningVoteText()}</p>}
      </div>
      {data.length > 0 && (
        <ChartArea>
          <BarChart width={730} height={250} data={data}>
            <CartesianGrid strokeDasharray='3 3' />
            <XAxis dataKey='name' />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey='RPB' fill='var(--rpbcount)' />
            <Bar dataKey='Tokens' fill='var(--tokencount)' />
            <Bar dataKey='Miner Tokens' fill='var(--minertokencount)' />
          </BarChart>
        </ChartArea>
      )}
    </Container>
  );
}

export default VoteHistory;
