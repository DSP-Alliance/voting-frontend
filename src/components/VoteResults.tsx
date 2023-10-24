import React, { useEffect, useState } from 'react';
import { Cell, PieChart, Pie, Tooltip } from 'recharts';
import styled from 'styled-components';
import ClipLoader from 'react-spinners/ClipLoader';
import { formatEther } from 'viem';

import { publicClient } from 'services/clients';
import { voteTrackerConfig } from 'constants/voteTrackerConfig';
import { formatBytesWithLabel, indexOfMax } from 'utilities/helpers';
import type { Address } from './Home';
import {
  NameType,
  Payload,
  ValueType,
} from 'recharts/types/component/DefaultTooltipContent';

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

const Label = styled.div`
  color: var(--primary);
`;

const DataText = styled.div`
  margin-top: 4px;
  color: var(--caption);
`;

function format_value(
  value: ValueType,
  name: NameType,
  props: Payload<ValueType, NameType>,
): string {
  switch (props.dataKey) {
    case 'RBP':
      return formatBytesWithLabel(Number(value));
    case 'Tokens':
      return `${formatEther(BigInt(value.toString())).slice(0, 8)} $FIL`;
    case 'Miner Tokens':
      return `${formatEther(BigInt(value.toString())).slice(0, 8)} $FIL`;
    default:
      return '';
  }
}

function VoteResults({
  lastFipNum,
  lastFipAddress,
  loading,
  yesOptions,
}: {
  lastFipNum: number | undefined;
  lastFipAddress: Address | undefined;
  loading: boolean;
  yesOptions: string[];
}) {
  const [data, setData] = useState<{ [key: string]: string | number }[]>([]);
  const [totalRbp, setTotalRbp] = useState('');
  const [totalTokens, setTotalTokens] = useState('');
  const [totalMinerTokens, setTotalMinerTokens] = useState('');
  const [winningRbp, setWinningRbp] = useState('');
  const [winningTokens, setWinningTokens] = useState('');
  const [winningMinerTokens, setWinningMinerTokens] = useState('');

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
          formatEther(tokenVotes.reduce((a, b) => a + b, BigInt(0))),
        );
        setTotalMinerTokens(
          formatEther(minerTokenVotes.reduce((a, b) => a + b, BigInt(0))),
        );

        const yesOption1 = yesOptions[0];
        const yesOption2 = yesOptions[1];

        const VOTES = [
          yesOption1 && yesOption1.length > 0 ? yesOption1 : 'Yes',
          yesOption2 && yesOption2.length > 0 ? yesOption2 : 'Yes 2',
          'No',
          'Abstain',
        ];

        setWinningRbp(VOTES[indexOfMax([...rbpVotes])]);
        setWinningTokens(VOTES[indexOfMax([...tokenVotes])]);
        setWinningMinerTokens(VOTES[indexOfMax([...minerTokenVotes])]);

        setData([
          {
            name: yesOption1,
            RBP: Number(rbpVotes[0]),
            Tokens: Number(tokenVotes[0]),
            'Miner Tokens': Number(minerTokenVotes[0]),
          },
          ...(yesOption2
            ? [
                {
                  name: yesOption2,
                  RBP: Number(rbpVotes[1]),
                  Tokens: Number(tokenVotes[1]),
                  'Miner Tokens': Number(minerTokenVotes[1]),
                },
              ]
            : []),
          {
            name: 'No',
            RBP: Number(rbpVotes[2]),
            Tokens: Number(tokenVotes[2]),
            'Miner Tokens': Number(minerTokenVotes[2]),
          },
          {
            name: 'Abstain',
            RBP: Number(rbpVotes[3]),
            Tokens: Number(tokenVotes[3]),
            'Miner Tokens': Number(minerTokenVotes[3]),
          },
        ]);
      });
    }
  }, [lastFipAddress]); // eslint-disable-line react-hooks/exhaustive-deps

  if (loading) return <ClipLoader color='var(--primary)' />;

  if (lastFipNum) {
    if (data.length === 0) return <InfoText>No vote data</InfoText>;

    return (
      <ChartArea>
        <PieChart width={300} height={300}>
          <Tooltip
            separator=': '
            formatter={(value, name, props) => [
              format_value(value, name, props),
              name,
            ]}
          />
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
              <Label>Inner:</Label>
              RBP
              <DataText>
                Total: {totalRbp || '-'}
                <br />
                Winning: {winningRbp || '-'}
              </DataText>
            </span>
          </div>
          <div>
            <Label>Middle:</Label>
            Tokens
            <DataText>
              Total: {totalTokens || '-'}
              <br />
              Winning: {winningTokens || '-'}
            </DataText>
          </div>
          <div>
            <Label>Outer:</Label>
            Miner Tokens
            <DataText>
              Total: {totalMinerTokens || '-'}
              <br />
              Winning: {winningMinerTokens || '-'}
            </DataText>
          </div>
        </Legend>
      </ChartArea>
    );
  }
  return <InfoText>Last vote data does not exist</InfoText>;
}

export default VoteResults;
