import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { getAddress } from 'viem';
import { filecoin } from 'viem/chains';
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

const Container = styled.div`
  display: grid;
  grid-template-columns: 300px auto;
  gap: 12px;
`;

const QuestionText = styled.div`
  overflow-wrap: break-word;
  margin-left: 8px;
  margin-top: 12px;
`;

const ChartArea = styled.div`
  margin: 24px;
`;

function VoteHistory({ fips }: { fips: number[] }) {
  // { yes: 0 }, { no: 0 }, { abstain: 0 }
  const [data, setData] = useState();
  const [selectedFip, setSelectedFip] = useState('');
  const [questionText, setQuestionText] = useState('');

  useEffect(() => {
    if (selectedFip) {
      // We use a promise here as multicall is enabled for this client
      // Meaning that we can reduce our load on the RPC URL and get data back faster.
      Promise.all([
        publicClient.readContract({
          abi: voteTrackerConfig.abi,
          address: getAddress(selectedFip, filecoin.id),
          functionName: 'voteStart',
        }),
        publicClient.readContract({
          abi: voteTrackerConfig.abi,
          address: getAddress(selectedFip, filecoin.id),
          functionName: 'voteLength',
        }),
        publicClient.readContract({
          abi: voteTrackerConfig.abi,
          address: getAddress(selectedFip, filecoin.id),
          functionName: 'question',
        }),
        publicClient.readContract({
          abi: voteTrackerConfig.abi,
          address: getAddress(selectedFip, filecoin.id),
          functionName: 'getVoteResultsRBP',
        }),
        publicClient.readContract({
          abi: voteTrackerConfig.abi,
          address: getAddress(selectedFip, filecoin.id),
          functionName: 'getVoteResultsMinerToken',
        }),
        publicClient.readContract({
          abi: voteTrackerConfig.abi,
          address: getAddress(selectedFip, filecoin.id),
          functionName: 'getVoteResultsToken',
        }),
        publicClient.readContract({
          abi: voteTrackerConfig.abi,
          address: getAddress(selectedFip, filecoin.id),
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
        ]: [
          number,
          number,
          string,
          readonly [bigint, bigint, bigint, bigint],
          readonly [bigint, bigint, bigint, bigint],
          readonly [bigint, bigint, bigint, bigint],
          number,
        ]) => {
          setQuestionText(question);
          // setData();
          // You can sum together all votes using the rbpVotes, minerTokenVotes, and tokenVotes to get a total vote count and calculate percentages
        },
      );
    }
  }, [selectedFip]);

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
        {questionText && <QuestionText>{questionText}</QuestionText>}
      </div>
      {data && (
        <ChartArea>
          <BarChart width={730} height={250} data={data}>
            <CartesianGrid strokeDasharray='3 3' />
            <XAxis dataKey='name' />
            <YAxis />
            <Tooltip cursor={{ fill: 'transparent' }} />
            <Legend />
            <Bar dataKey='yes' fill='var(--yesvote)' />
            <Bar dataKey='no' fill='var(--novote)' />
            <Bar dataKey='abstain' fill='var(--abstainvote)' />
          </BarChart>
        </ChartArea>
      )}
    </Container>
  );
}

export default VoteHistory;
