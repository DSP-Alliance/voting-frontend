import React, { useState } from 'react';
import styled from 'styled-components';
import { TextField } from '@mui/material';

const ErrorMessage = styled.div`
  color: var(--rederror);
  word-wrap: break-word;
`;

function VotingPower({
  addAgent,
  error,
  loading,
  rawBytePower,
}: {
  addAgent: (address: string) => void;
  error: string;
  loading: boolean;
  rawBytePower: string;
}) {
  const [agentAddress, setAgentAddress] = useState('');

  return (
    <div>
      {!rawBytePower && (
        <>
          <TextField
            size='small'
            label='Add Agent Address'
            value={agentAddress}
            onChange={(e) => setAgentAddress(e.target.value)}
          />
          <button disabled={loading} onClick={() => addAgent(agentAddress)}>
            Add
          </button>
        </>
      )}
      {rawBytePower && <p>{rawBytePower}</p>}
      {error && <ErrorMessage>Error: {error}</ErrorMessage>}
    </div>
  );
}

export default VotingPower;
