import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Label,
  Legend,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import ClipLoader from 'react-spinners/ClipLoader';

import { voteTrackerConfig } from 'constants/voteTrackerConfig';
import { publicClient } from 'services/clients';
import { voteFactoryConfig } from 'constants/voteFactoryConfig';
import { formatBytes, getLargestUnit, timeLength } from 'utilities/helpers';

const Container = styled.div`
  display: grid;
  grid-template-columns: 150px 300px auto;
  gap: 12px;

  @media (max-width: 920px) {
    grid-template-columns: 1fr;
  }
`;

const LoaderContainer = styled.div`
  align-self: center;
`;

const QuestionText = styled.div`
  overflow-wrap: break-word;
  margin-top: 24px;
`;

const ChartArea = styled.div`
  margin: 24px;
`;

function VoteHistory({ fips }: { fips: number[] }) {
  const [data, setData] = useState<{ [key: string]: string | number }[]>([]);
  const [length, setLength] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [questionText, setQuestionText] = useState('');
  const [selectedFip, setSelectedFip] = useState('');
  const [startTime, setStartTime] = useState<number>(0);
  const [yAxisUnit, setYAxisUnit] = useState<string>('');
  const [winningVoteText, setWinningVoteText] = useState('');

  useEffect(() => {
    if (selectedFip) {
      setLoading(true);
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
            publicClient.readContract({
              abi: voteTrackerConfig.abi,
              address: addr,
              functionName: 'yesOptions',
              args: [BigInt(0)],
            }),
            publicClient.readContract({
              abi: voteTrackerConfig.abi,
              address: addr,
              functionName: 'yesOptions',
              args: [BigInt(1)],
            }),
          ]).then(
            ([
              startTime,
              length,
              question,
              rbpVotes,
              minerTokenVotes,
              tokenVotes,
              winningVote,
              yesOption1,
              yesOption2,
            ]) => {
              setQuestionText(question);
              setStartTime(startTime);
              setLength(length);

              if (winningVote === 0) setWinningVoteText(yesOption1);
              if (winningVote === 1) setWinningVoteText('No');
              if (winningVote === 2) setWinningVoteText('Abstain');
              if (winningVote === 3) setWinningVoteText(yesOption2);

              const unit = getLargestUnit([
                ...rbpVotes,
                ...minerTokenVotes,
                ...tokenVotes,
              ]);
              setYAxisUnit(unit);

              setData([
                {
                  name: yesOption1,
                  RPB: formatBytes(Number(rbpVotes[0]), unit),
                  Tokens: formatBytes(Number(minerTokenVotes[0]), unit),
                  'Miner Tokens': formatBytes(Number(tokenVotes[0]), unit),
                },
                {
                  name: yesOption2,
                  RPB: formatBytes(Number(rbpVotes[1]), unit),
                  Tokens: formatBytes(Number(minerTokenVotes[1]), unit),
                  'Miner Tokens': formatBytes(Number(tokenVotes[1]), unit),
                },
                {
                  name: 'No',
                  RPB: formatBytes(Number(rbpVotes[2]), unit),
                  Tokens: formatBytes(Number(minerTokenVotes[2]), unit),
                  'Miner Tokens': formatBytes(Number(tokenVotes[2]), unit),
                },
                {
                  name: 'Abstain',
                  RPB: formatBytes(Number(rbpVotes[3]), unit),
                  Tokens: formatBytes(Number(minerTokenVotes[3]), unit),
                  'Miner Tokens': formatBytes(Number(tokenVotes[3]), unit),
                },
              ]);

              setLoading(false);
            },
          );
        });
    }
  }, [selectedFip]);

  const timestamp = new Date(startTime * 1000).toLocaleString();

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
      {loading && (
        <LoaderContainer>
          <ClipLoader color='var(--primary)' />
        </LoaderContainer>
      )}
      {!loading && (
        <div>
          {questionText && <QuestionText>{questionText}</QuestionText>}
          {Boolean(startTime) && <p>Started: {timestamp}</p>}
          {Boolean(length) && <p>Length of time: {timeLength(length)}</p>}
          {winningVoteText && <p>Winning vote: {winningVoteText}</p>}
        </div>
      )}
      {data.length > 0 && !loading && (
        <ChartArea>
          <BarChart width={800} height={300} data={data}>
            <CartesianGrid strokeDasharray='3 3' />
            <XAxis
              dataKey='name'
              tickFormatter={(value: string) => {
                const limit = 20;
                if (value.length < limit) return value;
                return `${value.substring(0, limit)}...`;
              }}
            />
            <YAxis width={50}>
              <Label
                angle={90}
                value={yAxisUnit}
                position='insideLeft'
                style={{ textAnchor: 'middle' }}
              />
            </YAxis>
            <Tooltip />
            <Legend />
            <Bar dataKey='RPB' fill='var(--rbpcount)' />
            <Bar dataKey='Tokens' fill='var(--tokencount)' />
            <Bar dataKey='Miner Tokens' fill='var(--minertokencount)' />
          </BarChart>
        </ChartArea>
      )}
    </Container>
  );
}

export default VoteHistory;
