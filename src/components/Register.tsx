import React, { useState } from 'react';
import styled from 'styled-components';
import { TextField } from '@mui/material';
import { formatEther } from 'viem';
import ClipLoader from 'react-spinners/ClipLoader';

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
  font-size: 14px;
  color: var(--error);
  word-wrap: break-word;
  max-width: 50ch;
  margin-top: 8px;
`;

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 12px;
`;

const BackButton = styled.button`
  background-color: #fff;
  color: var(--primary);
  border: 1px solid var(--primary);

  &:hover:enabled {
    background-color: #e1e3e1;
  }
`;

function Register({
  addVotingPower,
  error,
  loading,
  registering,
  write,
  rawBytePower,
  tokenPower,
  minerIds,
}: {
  addVotingPower: (address: string) => void;
  error: string | undefined;
  loading: boolean;
  registering: boolean;
  write: () => void;
  rawBytePower: string;
  tokenPower: bigint | null;
  minerIds: string[];
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
              onClick={() => {
                addVotingPower(agentAddress);
                setShowConfirmation(true);
              }}
            >
              Register to Vote
            </button>
            <AddressCheckbox>
              <input
                disabled={loading}
                type='checkbox'
                id='addAgentAddress'
                checked={showAddressField}
                onChange={() => setShowAddressField(!showAddressField)}
              />
              <label htmlFor='addAgentAddress'>Add Agent Address?</label>
            </AddressCheckbox>
            {showAddressField && (
              <TextField
                disabled={loading}
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
        {loading && <ClipLoader color='var(--primary)' />}
        {showConfirmation && !loading && (
          <>
            {minerIds && (
              <div>
                Miner IDs:
                {minerIds.length
                  ? minerIds.map((id, index) => (
                      <li key={index}>{id.toString()}</li>
                    ))
                  : ' -'}
              </div>
            )}
            <div>{rawBytePower && <p>RBP: {rawBytePower}</p>}</div>
            <div>
              {tokenPower !== null ? (
                <p>{formatEther(tokenPower)} $FIL</p>
              ) : null}
            </div>
            <ButtonContainer>
              <BackButton
                disabled={registering}
                onClick={() => setShowConfirmation(false)}
              >
                Go back
              </BackButton>
              {!registering && (
                <button disabled={registering} onClick={() => write?.()}>
                  Confirm registration
                </button>
              )}
              {registering && <ClipLoader color='var(--primary)' />}
            </ButtonContainer>
          </>
        )}
      </ActionArea>
      {error && <ErrorMessage>Error: {error}</ErrorMessage>}
    </div>
  );
}

export default Register;
