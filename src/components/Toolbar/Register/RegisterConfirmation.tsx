import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useAccount, useContractWrite, useWaitForTransaction } from 'wagmi';
import { TextField } from '@mui/material';
import { formatEther } from 'viem';
import ClipLoader from 'react-spinners/ClipLoader';

import { voteTrackerConfig } from 'constants/voteTrackerConfig';
import { ownableConfig } from 'constants/ownableConfig';
import { voteFactoryConfig } from 'constants/voteFactoryConfig';
import { RPC_URL, publicClient } from 'services/clients';
import { formatBytesWithLabel, ZERO_ADDRESS } from 'utilities/helpers';
import Loading from 'common/Loading';
import type { Address } from 'components/Home';

const BackButton = styled.button`
  background-color: var(--white);
  color: var(--primary);
  border: 1px solid var(--primary);

  &:hover:enabled {
    background-color: #e1e3e1;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 12px;
  align-items: center;
`;

function RegisterConfirmation({
  minerIds,
  rawBytePower,
  tokenPower,
  showConfirmation,
  setShowConfirmation,
  showAddressField,
  setShowAddressField,
  setHasRegistered,
  addVotingPower,
}: {
  minerIds: string[];
  rawBytePower: string;
  tokenPower: bigint | null;
  showConfirmation: boolean;
  setShowConfirmation: React.Dispatch<React.SetStateAction<boolean>>;
  showAddressField: boolean;
  setShowAddressField: React.Dispatch<
    React.SetStateAction<boolean | undefined>
  >;
  setHasRegistered: React.Dispatch<React.SetStateAction<boolean>>;
  addVotingPower: (address?: string | undefined) => void;
}) {
  const { address } = useAccount();
  const [agentAddress, setAgentAddress] = useState('');
  const [loading, setLoading] = useState(false);

  // THIS IS THE REGISTER FUNCTION
  const {
    data,
    error,
    isLoading: isLoadingWrite,
    write,
  } = useContractWrite({
    abi: voteFactoryConfig.abi,
    address: voteFactoryConfig.address,
    functionName: 'register',
    args: [
      agentAddress as Address,
      minerIds.map((id) => BigInt(id.replace('f0', ''))),
    ],
  });

  const { isLoading: isLoadingWait, isSuccess } = useWaitForTransaction({
    hash: data?.hash,
  });

  const registering = isLoadingWrite || isLoadingWait;

  useEffect(() => {
    if (isSuccess) {
      setHasRegistered(true);
    }
  }, [isSuccess]);

  return (
    <>
      {showAddressField && (
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
            <BackButton onClick={() => setShowAddressField(undefined)}>
              Go back
            </BackButton>
            <button onClick={() => addVotingPower(agentAddress)}>
              Register
            </button>
            {/* {!registering && (
              <button disabled={registering} onClick={() => write?.()}>
                Confirm registration
              </button>
            )} */}
            {/* {registering && <ClipLoader color='var(--primary)' size='20px' />} */}
          </ButtonContainer>
        </>
      )}
      {showConfirmation && (
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
            {tokenPower !== null ? <p>{formatEther(tokenPower)} $FIL</p> : null}
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
            {registering && <ClipLoader color='var(--primary)' size='20px' />}
          </ButtonContainer>
        </>
      )}
    </>
  );
}

export default RegisterConfirmation;
