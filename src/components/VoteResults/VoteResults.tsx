import React from 'react';
import styled from 'styled-components';
import ClipLoader from 'react-spinners/ClipLoader';
import { useTranslation } from 'react-i18next';

import ResultsChart from 'components/VoteResults/ResultsChart';
import type { VoteResultsData } from 'hooks/useVoteResults';
import MultipleChart from './MultipleChart';

const InfoText = styled.span`
  font-style: italic;
`;

const ChartContainer = styled.div`
  // display: grid;
  // grid-template-columns: 1fr 1fr 1fr;
  display: flex;
  gap: 12px;
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
  isActive,
}: {
  voteResultsData: VoteResultsData;
  isActive: boolean;
}) {
  const { t } = useTranslation();
  if (loading) return <ClipLoader color='var(--primary)' />;

  if (!Boolean(totalRbp) && !Boolean(totalTokens) && !Boolean(totalMinerTokens))
    return <InfoText>{t('noVoteData')}</InfoText>;

  return (
    <ChartContainer>
      {isActive ? (
        <>
          {Boolean(totalRbp) && (
            <ResultsChart
              type='RBP'
              data={rbpData}
              totalCount={totalRbp}
              winning={winningRbp}
              isActive={isActive}
            />
          )}
          {Boolean(totalTokens) && (
            <ResultsChart
              type='Tokens'
              data={tokenData}
              totalCount={Number(totalTokens)}
              winning={winningTokens}
              isActive={isActive}
            />
          )}
          {Boolean(totalMinerTokens) && (
            <ResultsChart
              type='Miner Tokens'
              data={minerTokenData}
              totalCount={Number(totalMinerTokens)}
              winning={winningMinerTokens}
              isActive={isActive}
            />
          )}
        </>
      ) : (
        <>
          <MultipleChart
            rbpData={rbpData}
            totalRbp={Number(totalRbp)}
            tokenData={tokenData}
            totalTokens={Number(totalTokens)}
            minerTokenData={minerTokenData}
            totalMinerTokens={Number(totalMinerTokens)}
          ></MultipleChart>
        </>
      )}
    </ChartContainer>
  );
}

export default VoteResults;
