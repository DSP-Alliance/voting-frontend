import React, { useEffect } from 'react';
import styled from 'styled-components';
import { useContractWrite, useWaitForTransaction } from 'wagmi';
import { formatEther } from 'viem';
import ClipLoader from 'react-spinners/ClipLoader';

import { voteFactoryConfig } from 'constants/voteFactoryConfig';
import { ZERO_ADDRESS, formatBytesWithLabel } from 'utilities/helpers';
import ErrorMessage from 'common/ErrorMessage';
import type { Address } from 'components/Home';

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
  align-items: center;
  gap: 12px;
`;

function RegisterConfirmation({
  closeModal,
  minerIds,
  rawBytePower,
  tokenPower,
  agentAddress,
  setShowConfirmation,
  setHasRegistered,
}: {
  closeModal: () => void;
  minerIds: string[];
  rawBytePower: bigint;
  tokenPower: bigint;
  agentAddress: string;
  setShowConfirmation: React.Dispatch<React.SetStateAction<boolean>>;
  setHasRegistered: React.Dispatch<React.SetStateAction<boolean>>;
}) {
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
      (agentAddress as Address) || ZERO_ADDRESS,
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
      closeModal();
    }
  }, [isSuccess]);

  return (
    <>
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
        <p>RBP: {formatBytesWithLabel(parseInt(rawBytePower.toString()))}</p>
        <p>{formatEther(tokenPower)} $FIL</p>
        <ButtonContainer>
          <BackButton
            disabled={registering}
            onClick={() => setShowConfirmation(false)}
          >
            Go back
          </BackButton>
          {!registering && (
            <ConfirmButton disabled={registering} onClick={() => write?.()}>
              Confirm registration
            </ConfirmButton>
          )}
          {registering && <ClipLoader color='var(--primary)' size='20px' />}
        </ButtonContainer>
      </>
      {error && <ErrorMessage message={error.message} />}
    </>
  );
}

export default RegisterConfirmation;
