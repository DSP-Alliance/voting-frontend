import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useContractWrite, useWaitForTransaction } from 'wagmi';

import { voteTrackerConfig } from 'constants/voteTrackerConfig';
import { useFipDataContext } from 'common/FipDataContext';
import ErrorMessage from 'common/ErrorMessage';

const VotePickerContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  align-items: center;
  margin: auto;
`;

const VoteButton = styled.button`
  min-width: 150px;
`;

function VotePicker({
  setHasVoted,
  yesOption1,
  yesOption2,
}: {
  setHasVoted: React.Dispatch<React.SetStateAction<boolean>>;
  yesOption1: string;
  yesOption2: string;
}) {
  const [vote, setVote] = useState<bigint>(BigInt(0));
  const [hasClicked, setHasClicked] = useState(false);

  const { lastFipAddress } = useFipDataContext();

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
      localStorage.setItem('lastFipVoted', lastFipAddress || '');
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
      <VoteButton
        type='button'
        disabled={isLoadingWrite || isLoadingWait}
        onClick={() => {
          submitVote(BigInt(0));
        }}
      >
        {yesOption1}
      </VoteButton>
      {yesOption2 && (
        <VoteButton
          type='button'
          disabled={isLoadingWrite || isLoadingWait}
          onClick={() => {
            submitVote(BigInt(3));
          }}
        >
          {yesOption2}
        </VoteButton>
      )}
      <VoteButton
        type='button'
        disabled={isLoadingWrite || isLoadingWait}
        onClick={(e) => {
          submitVote(BigInt(1));
        }}
      >
        No
      </VoteButton>
      <VoteButton
        type='button'
        disabled={isLoadingWrite || isLoadingWait}
        onClick={(e) => {
          submitVote(BigInt(2));
        }}
      >
        Abstain
      </VoteButton>
      {error && <ErrorMessage message={error.message} />}
    </VotePickerContainer>
  );
}

export default VotePicker;
