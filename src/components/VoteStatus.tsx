import React from 'react';
import styled from 'styled-components';
import type { VoteResultsData } from 'hooks/useVoteResults';
import { useTranslation } from 'react-i18next';

const StatusContainer = styled.span`
  border-radius: 4px;
  border-style: solid;
  border-width: 2px;
  padding: 2px 4px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
`;

const SuccessStatusContainer = styled(StatusContainer)`
  border-color: var(--success-color);
  color: var(--success-color);
`;

const FailStatusContainer = styled(StatusContainer)`
  border-color: var(--fail-color);
  color: var(--fail-color);
`;

const votingGroups = [
  'winningMinerTokens',
  'winningRbp',
  'winningTokens',
] as const;

function VoteStatus({
  voteResultsData,
  active,
}: {
  voteResultsData: VoteResultsData;
  active: boolean;
}) {
  const { t } = useTranslation();
  if (active)
    return <SuccessStatusContainer>{t('active')}</SuccessStatusContainer>;
  if (voteResultsData.loading) return null;

  let allAgreed = true;
  let winningQuestion = '';

  for (const group of votingGroups) {
    if (!voteResultsData[group]) continue;
    if (!winningQuestion) {
      winningQuestion = voteResultsData[group];
      continue;
    }
    if (winningQuestion !== voteResultsData[group]) {
      allAgreed = false;
      break;
    }
  }

  if (!winningQuestion) return null;

  if (allAgreed)
    return <SuccessStatusContainer>{t('passed')}</SuccessStatusContainer>;

  return <FailStatusContainer>{t('abstain')}</FailStatusContainer>;
}

export default VoteStatus;
