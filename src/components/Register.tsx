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

function Register({
  addVotingPower,
  error,
  loading,
  write,
}: {
  addVotingPower: (address: string) => void;
  error: string;
  loading: boolean;
  write: () => void;
}) {
  const [agentAddress, setAgentAddress] = useState('');
  const [showAddressField, setShowAddressField] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  return (
    <div>
      <ActionArea>
        {!showConfirmation && (
          <>
            <button
              disabled={loading}
              onClick={() => addVotingPower(agentAddress)}
            >
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
          </>
        )}
        {showConfirmation && (
          <>
            {/* <p>{minerIds.map((id) => <li>id</li>)} */}
            {/* <div>{rawBytePower && <p>{rawBytePower}</p>}</div>
            <div>
              {tokenPower !== null ? <p>{tokenPower.toString()} $FIL</p> : null}
            </div> */}
            <button onClick={() => write?.()}>Confirm registration</button>
          </>
        )}
      </ActionArea>
      {error && <ErrorMessage>Error: {error}</ErrorMessage>}
    </div>
  );
}

export default Register;
