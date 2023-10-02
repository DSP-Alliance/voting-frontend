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
  address,
  lastFipAddress,
  minerIds,
}: {
  address: Address | undefined;
  lastFipAddress: Address | undefined;
  minerIds: bigint[];
}) {
  const [vote, setVote] = useState<bigint>(BigInt(0));
  const [yesOptions, setYesOptions] = useState<string[]>([]);
  const [glifPool, setGlifPool] = useState('0');

  async function sendVote() {
    const encodedVote = encodeVote(vote);
  }

  useEffect(() => {
    async function getYesOptions() {
      if (lastFipAddress) {
        try {
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

  function encodeVote(vote: bigint) {
    return vote;
    // switch (vote % 3) {
    //   // yes Vote
    //   case 0: { // If we have two yes options then (vote % 6) can only equal 0 or 3
    //     if (doubleYesVote && vote % 6 >= 3) {
    //       // If it is 3 then it is for option 2
    //       yesVoteOption2 += weight;
    //     } else {
    //       // If it is 0 or there is no second yes option
    //       yesVoteOption1 += weight;
    //     }
    //   }
    //   // no Vote
    //   case 1:
    //     noVote += weight;
    //   // abstain Vote
    //   case 2:
    //     abstainVote += weight;
    // }
  }

  return (
    <VotePickerContainer>
      <button onClick={() => {setVote(BigInt(0)); write?.()}}>Yes</button>
      {
        // yes options mapping
      }
      <button onClick={() => {setVote(BigInt(1)); write?.()}}>No</button>
      <button onClick={() => {setVote(BigInt(2)); write?.()}}>Abstain</button>
    </VotePickerContainer>
  );
}

export default VotePicker;
