import React from 'react';
import styled from 'styled-components';
import ClipLoader from 'react-spinners/ClipLoader';

import ResultsChart from 'components/VoteResults/ResultsChart';
import type { VoteResultsData } from 'hooks/useVoteResults';

const InfoText = styled.span`
  font-style: italic;
`;

const ChartContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
`;

function VoteResults({
  voteResultsData: {
    loading,
    totalRbp,
    totalTokens,
    totalMinerTokens,
    rbpData,
    tokenData,
    minerTokenData,
    winningRbp,
    winningTokens,
    winningMinerTokens,
  },
}: {
  voteResultsData: VoteResultsData;
}) {
  if (loading) return <ClipLoader color='var(--primary)' />;

  if (!Boolean(totalRbp) && !Boolean(totalTokens) && !Boolean(totalMinerTokens))
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

export default VoteResults;
