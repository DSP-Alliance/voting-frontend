import React from 'react';
import styled from 'styled-components';

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

function VoteStatus({ status }: { status: string }) {
  if (status === 'Final' || status === 'Active' || status === 'Passed')
    return <SuccessStatusContainer>{status}</SuccessStatusContainer>;

  return <FailStatusContainer>{status}</FailStatusContainer>;
}

export default VoteStatus;
