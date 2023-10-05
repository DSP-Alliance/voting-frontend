import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useContractWrite, useWaitForTransaction } from 'wagmi';

import { publicClient } from 'services/clients';
import { voteTrackerConfig } from 'constants/voteTrackerConfig';
import type { Address } from './Home';

const VotePickerContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

function VotePicker({
  lastFipAddress,
  setHasVoted,
}: {
  lastFipAddress: Address | undefined;
  setHasVoted: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [questionText, setQuestionText] = useState('');
  const [vote, setVote] = useState<bigint>(BigInt(0));
  const [yesOptions, setYesOptions] = useState<string[]>([]);
  const [hasClicked, setHasClicked] = useState(false);

  useEffect(() => {
    async function getYesOptions() {
      if (lastFipAddress) {
        try {
          const question = await publicClient.readContract({
            address: lastFipAddress,
            abi: voteTrackerConfig.abi,
            functionName: 'question',
          });
          const yesOption1 = await publicClient.readContract({
            address: lastFipAddress,
            abi: voteTrackerConfig.abi,
            functionName: 'yesOptions',
            args: [BigInt(0)],
          });
          const yesOption2 = await publicClient.readContract({
            address: lastFipAddress,
            abi: voteTrackerConfig.abi,
            functionName: 'yesOptions',
            args: [BigInt(1)],
          });

          setQuestionText(question);
          if (yesOption1.length > 0 && yesOption2.length > 0) {
            setYesOptions([yesOption1, yesOption2]);
          }
        } catch {
          setYesOptions([]);
        }
      }
    }

    getYesOptions();
  }, []);

  const { data, error, isError, write } = useContractWrite({
    abi: voteTrackerConfig.abi,
    address: lastFipAddress,
    functionName: 'castVote',
    args: [vote],
  });

  const { isLoading, isSuccess } = useWaitForTransaction({
    hash: data?.hash,
  });

  useEffect(() => {
    if (isSuccess) {
      setHasVoted(true);
    }
  });

  function submitVote(vote: bigint) {
    setHasClicked(true);
    setVote(vote);
  }

  useEffect(() => {
    if (!hasClicked) return;

    console.log(vote)
    setHasClicked(false);
    write?.();
  }, [vote, hasClicked]);

  return (
    <VotePickerContainer>
      <div>{questionText}</div>
      <button
        disabled={isLoading}
        onClick={() => {
          submitVote(BigInt(0));
        }}
      >
        {yesOptions[0]}
      </button>
      {yesOptions[1] && (
        <button
          disabled={isLoading}
          onClick={() => {
            submitVote(BigInt(3));
          }}
        >
          {yesOptions[1]}
        </button>
      )}
      <button
        disabled={isLoading}
        onClick={() => {
          submitVote(BigInt(1));
        }}
      >
        No
      </button>
      <button
        disabled={isLoading}
        onClick={() => {
          submitVote(BigInt(2));
        }}
      >
        Abstain
      </button>
    </VotePickerContainer>
  );
}

export default VotePicker;
