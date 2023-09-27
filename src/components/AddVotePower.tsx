import React, { useState } from 'react';
import styled from 'styled-components';
import { TextField } from '@mui/material';

const ActionArea = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ErrorMessage = styled.div`
  color: var(--rederror);
  word-wrap: break-word;
`;

function AddVotePower({
  addVotingPower,
  error,
  loading,
}: {
  addVotingPower: (address: string) => void;
  error: string;
  loading: boolean;
}) {
  const [agentAddress, setAgentAddress] = useState('');

  return (
    <div>
      <ActionArea>
        <button disabled={loading} onClick={() => addVotingPower(agentAddress)}>
          Register to Vote
        </button>
        <TextField
          size='small'
          margin='normal'
          label='Add Agent Address (optional)'
          fullWidth
          value={agentAddress}
          onChange={(e) => setAgentAddress(e.target.value)}
        />
      </ActionArea>
      {error && <ErrorMessage>Error: {error}</ErrorMessage>}
    </div>
  );
}

export default AddVotePower;
