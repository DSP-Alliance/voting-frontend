import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useContractWrite, useWaitForTransaction } from 'wagmi';

import { voteTrackerConfig } from 'constants/voteTrackerConfig';
import type { Address } from './Home';

const VotePickerContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const ErrorMessage = styled.div`
  font-size: 14px;
  align-self: center;
  word-wrap: break-word;
  max-width: 50ch;
  color: var(--error);
`;

function VotePicker({
  lastFipAddress,
  setHasVoted,
  yesOption1,
  yesOption2,
}: {
  lastFipAddress: Address | undefined;
  setHasVoted: React.Dispatch<React.SetStateAction<boolean>>;
  yesOption1: string;
  yesOption2: string;
}) {
  const [vote, setVote] = useState<bigint>(BigInt(0));
  const [hasClicked, setHasClicked] = useState(false);

  const {
    data,
    error,
    isLoading: isLoadingWrite,
    write,
  } = useContractWrite({
    abi: voteTrackerConfig.abi,
    address: lastFipAddress,
    functionName: 'castVote',
    args: [vote],
  });

  const { isLoading: isLoadingWait, isSuccess } = useWaitForTransaction({
    hash: data?.hash,
  });

  useEffect(() => {
    if (isSuccess) {
      setHasVoted(true);
    }
  }, [isSuccess]); // eslint-disable-line react-hooks/exhaustive-deps

  function submitVote(vote: bigint) {
    setHasClicked(true);
    setVote(vote);
  }

  useEffect(() => {
    if (!hasClicked) return;

    setHasClicked(false);
    write?.();
  }, [hasClicked]);

  return (
    <VotePickerContainer>
      <button
        type='button'
        disabled={isLoadingWrite || isLoadingWait}
        onClick={() => {
          submitVote(BigInt(0));
        }}
      >
        {yesOption1}
      </button>
      {yesOption2 && (
        <button
          type='button'
          disabled={isLoadingWrite || isLoadingWait}
          onClick={() => {
            submitVote(BigInt(3));
          }}
        >
          {yesOption2}
        </button>
      )}
      <button
        type='button'
        disabled={isLoadingWrite || isLoadingWait}
        onClick={(e) => {
          submitVote(BigInt(1));
        }}
      >
        No
      </button>
      <button
        type='button'
        disabled={isLoadingWrite || isLoadingWait}
        onClick={(e) => {
          submitVote(BigInt(2));
        }}
      >
        Abstain
      </button>
      {error && <ErrorMessage>{error.message}</ErrorMessage>}
    </VotePickerContainer>
  );
}

export default VotePicker;
