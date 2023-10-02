import React, { useState } from 'react';
import styled from 'styled-components';
import { TextField } from '@mui/material';

const ActionArea = styled.div`
  display: flex;
  flex-direction: column;
`;

const AddressCheckbox = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 4px;
  margin-top: 4px;
`;

const ErrorMessage = styled.div`
  color: var(--error);
  word-wrap: break-word;
  margin-top: 8px;
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
  const [showAddressField, setShowAddressField] = useState(false);

  return (
    <div>
      <ActionArea>
        <button disabled={loading} onClick={() => addVotingPower(agentAddress)}>
          Register to Vote
        </button>
        <AddressCheckbox>
          <input
            type='checkbox'
            id='addAgentAddress'
            checked={showAddressField}
            onChange={() => setShowAddressField(!showAddressField)}
          />
          <label htmlFor='addAgentAddress'>Add Agent Address?</label>
        </AddressCheckbox>
        {showAddressField && (
          <TextField
            size='small'
            margin='normal'
            label='Agent Address'
            fullWidth
            value={agentAddress}
            onChange={(e) => setAgentAddress(e.target.value)}
          />
        )}
      </ActionArea>
      {error && <ErrorMessage>Error: {error}</ErrorMessage>}
    </div>
  );
}

export default AddVotePower;
