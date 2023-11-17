import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import ClipLoader from 'react-spinners/ClipLoader';

import { publicClient } from 'services/clients';
import { voteTrackerConfig } from 'constants/voteTrackerConfig';
import { indexOfMax } from 'utilities/helpers';
import ResultsChart from 'components/VoteResults/ResultsChart';
import type { Address } from 'components/Home';

const InfoText = styled.span`
  font-style: italic;
`;

const ChartContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
`;

function VoteResults({
  lastFipNum,
  lastFipAddress,
  yesOptions,
}: {
  lastFipNum: number | undefined;
  lastFipAddress: Address | undefined;
  yesOptions: string[];
}) {
  const [loading, setLoading] = useState(false);
  const [rbpData, setRbpData] = useState<{ [key: string]: string | number }[]>(
    [],
  );
  const [tokenData, setTokenData] = useState<
    { [key: string]: string | number }[]
  >([]);
  const [minerTokenData, setMinerTokenData] = useState<
    { [key: string]: string | number }[]
  >([]);
  const [totalRbp, setTotalRbp] = useState<number>(0);
  const [totalTokens, setTotalTokens] = useState<bigint>();
  const [totalMinerTokens, setTotalMinerTokens] = useState<bigint>();
  const [winningRbp, setWinningRbp] = useState('');
  const [winningTokens, setWinningTokens] = useState('');
  const [winningMinerTokens, setWinningMinerTokens] = useState('');

  useEffect(() => {
    if (lastFipAddress) {
      setLoading(true);
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
      ])
        .then(([rbpVotes, minerTokenVotes, tokenVotes]) => {
          setTotalRbp(rbpVotes.reduce((a, b) => a + Number(b), 0));
          setTotalTokens(tokenVotes.reduce((a, b) => a + b, BigInt(0)));
          setTotalMinerTokens(
            minerTokenVotes.reduce((a, b) => a + b, BigInt(0)),
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

          setRbpData([
            {
              name: yesOption1,
              RBP: Number(rbpVotes[0]),
            },
            ...(yesOption2
              ? [
                  {
                    name: yesOption2,
                    RBP: Number(rbpVotes[1]),
                  },
                ]
              : []),
            {
              name: 'No',
              RBP: Number(rbpVotes[2]),
            },
            {
              name: 'Abstain',
              RBP: Number(rbpVotes[3]),
            },
          ]);

          setTokenData([
            {
              name: yesOption1,
              Tokens: Number(tokenVotes[0]),
            },
            ...(yesOption2
              ? [
                  {
                    name: yesOption2,
                    Tokens: Number(tokenVotes[1]),
                  },
                ]
              : []),
            {
              name: 'No',
              Tokens: Number(tokenVotes[2]),
            },
            {
              name: 'Abstain',
              Tokens: Number(tokenVotes[3]),
            },
          ]);

          setMinerTokenData([
            {
              name: yesOption1,
              'Miner Tokens': Number(minerTokenVotes[0]),
            },
            ...(yesOption2
              ? [
                  {
                    name: yesOption2,
                    'Miner Tokens': Number(minerTokenVotes[1]),
                  },
                ]
              : []),
            {
              name: 'No',
              'Miner Tokens': Number(minerTokenVotes[2]),
            },
            {
              name: 'Abstain',
              'Miner Tokens': Number(minerTokenVotes[3]),
            },
          ]);
        })
        .finally(() => setLoading(false));
    }
  }, [lastFipAddress]); // eslint-disable-line react-hooks/exhaustive-deps

  if (loading) return <ClipLoader color='var(--primary)' />;

  if (lastFipNum) {
    if (
      !Boolean(totalRbp) &&
      !Boolean(totalTokens) &&
      !Boolean(totalMinerTokens)
    )
      return <InfoText>No vote data</InfoText>;

    return (
      <ChartContainer>
        {Boolean(totalRbp) && (
          <ResultsChart
            type='RBP'
            data={rbpData}
            totalCount={totalRbp}
            winning={winningRbp}
          />
        )}
        {Boolean(totalTokens) && (
          <ResultsChart
            type='Tokens'
            data={tokenData}
            totalCount={Number(totalTokens)}
            winning={winningTokens}
          />
        )}
        {Boolean(totalMinerTokens) && (
          <ResultsChart
            type='Miner Tokens'
            data={minerTokenData}
            totalCount={Number(totalMinerTokens)}
            winning={winningMinerTokens}
          />
        )}
      </ChartContainer>
    );
  }
  return <InfoText>Last vote data does not exist</InfoText>;
}

export default VoteResults;
