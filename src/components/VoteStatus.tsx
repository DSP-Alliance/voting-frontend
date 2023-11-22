import React from 'react';
import styled from 'styled-components';
import type { VoteResultsData } from 'hooks/useVoteResults';

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
  if (active) return <SuccessStatusContainer>Active</SuccessStatusContainer>;
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

  if (allAgreed) return <SuccessStatusContainer>Passed</SuccessStatusContainer>;

  return <FailStatusContainer>Abstain</FailStatusContainer>;
}

export default VoteStatus;
