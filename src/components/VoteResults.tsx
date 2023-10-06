import React, { useEffect, useState } from 'react';
import { Cell, PieChart, Pie, Tooltip } from 'recharts';
import styled from 'styled-components';
import ClipLoader from 'react-spinners/ClipLoader';

import { publicClient } from 'services/clients';
import { voteTrackerConfig } from 'constants/voteTrackerConfig';
import { formatBytesWithLabel } from 'utilities/helpers';
import type { Address } from './Home';

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

function VoteResults({
  lastFipNum,
  lastFipAddress,
  loadingFipData,
  yesOption1,
  yesOption2,
}: {
  lastFipNum: number | undefined;
  lastFipAddress: Address | undefined;
  loadingFipData: boolean;
  yesOption1: string;
  yesOption2: string;
}) {
  const [data, setData] = useState<{ [key: string]: string | number }[]>([]);
  const [totalRbp, setTotalRbp] = useState('');
  const [totalTokens, setTotalTokens] = useState('');
  const [totalMinerTokens, setTotalMinerTokens] = useState('');
  // const [loading, setLoading] = useState(false);

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
            name: yesOption1,
            RPB: Number(rbpVotes[0]),
            Tokens: Number(minerTokenVotes[0]),
            'Miner Tokens': Number(tokenVotes[0]),
          },
          ...(yesOption2
            ? [
                {
                  name: yesOption2,
                  RPB: Number(rbpVotes[1]),
                  Tokens: Number(minerTokenVotes[1]),
                  'Miner Tokens': Number(tokenVotes[1]),
                },
              ]
            : []),
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

        console.log('hi lisa useeffect', rbpVotes);

        // setLoading(false);
      });
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (loadingFipData) return <ClipLoader color='var(--primary)' />;

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

export default VoteResults;
