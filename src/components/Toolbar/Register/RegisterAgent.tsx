import React from 'react';
import styled from 'styled-components';
import { TextField } from '@mui/material';

import Loading from 'common/Loading';

const BackButton = styled.button`
  background-color: var(--white);
  color: var(--primary);
  border: 1px solid var(--primary);
  border-radius: 24px;

  &:hover:enabled {
    background-color: #e1e3e1;
  }
`;

const ConfirmButton = styled.button`
  color: var(--white);
  background-color: var(--primary);
  border-radius: 24px;
`;

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 12px;
  align-items: center;
`;

function RegisterConfirmation({
  loading,
  setShowConfirmation,
  setShowAddressField,
  addVotingPower,
  agentAddress,
  setAgentAddress,
}: {
  loading: boolean;
  setShowConfirmation: React.Dispatch<React.SetStateAction<boolean>>;
  setShowAddressField: React.Dispatch<React.SetStateAction<boolean>>;
  addVotingPower: (address?: string | undefined) => void;
  agentAddress: string;
  setAgentAddress: React.Dispatch<React.SetStateAction<string>>;
}) {
  return (
    <>
      <TextField
        disabled={loading}
        size='small'
        margin='normal'
        label='Agent Address'
        fullWidth
        value={agentAddress}
        onChange={(e) => setAgentAddress(e.target.value)}
      />
      <ButtonContainer>
        <BackButton onClick={() => setShowAddressField(false)}>
          Go back
        </BackButton>
        {!loading && (
          <ConfirmButton
            onClick={() => {
              addVotingPower(agentAddress);
              setShowAddressField(false);
              setShowConfirmation(true);
            }}
          >
            Check voting power
          </ConfirmButton>
        )}
        {loading && <Loading />}
      </ButtonContainer>
    </>
  );
}

export default RegisterConfirmation;
