import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

import { publicClient } from 'services/clients';
import { voteTrackerConfig } from 'constants/voteTrackerConfig';
import VoteResults from 'components/VoteResults';
import VotePicker from 'components/VotePicker';
import Register from 'components/Register';
import type { Address } from './Home';

interface VoteActionsProps {
  address: Address | undefined;
  addVotingPower: (agentAddress: string) => void;
  countdownValue: number | undefined;
  errorMessage: string | undefined;
  hasRegistered: boolean;
  hasVoted: boolean;
  loadingFipData: boolean;
  lastFipNum: number | undefined;
  lastFipAddress: Address | undefined;
  loading: boolean;
  minerIds: string[];
  rawBytePower: string;
  registering: boolean;
  setHasVoted: React.Dispatch<React.SetStateAction<boolean>>;
  tokenPower: bigint | null;
  write: () => void;
}

const QuestionText = styled.div`
  margin-bottom: 12px;
`;

function VoteActions({
  addVotingPower,
  countdownValue,
  errorMessage,
  hasRegistered,
  hasVoted,
  loadingFipData,
  lastFipNum,
  lastFipAddress,
  loading,
  minerIds,
  rawBytePower,
  registering,
  setHasVoted,
  tokenPower,
  write,
}: VoteActionsProps) {
  const [questionText, setQuestionText] = useState('');
  const [yesOptions, setYesOptions] = useState<string[]>([]);

  useEffect(() => {
    async function getVoteInfo() {
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
          setYesOptions([yesOption1, ...(yesOption2 ? [yesOption2] : [])]);
        } catch {
          setYesOptions([]);
        }
      }
    }

    getVoteInfo();
  }, [lastFipAddress]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      {(!Boolean(countdownValue) || hasVoted) && (
        <>
          <h4>Latest Vote Results</h4>
          <QuestionText>{questionText}</QuestionText>
          <VoteResults
            lastFipNum={lastFipNum}
            lastFipAddress={lastFipAddress}
            loading={loadingFipData || countdownValue === undefined}
            yesOption1={yesOptions[0]}
          />
        </>
      )}
      {Boolean(countdownValue) && !hasVoted && (
        <>
          <h4>Choose Vote</h4>
          <QuestionText>{questionText}</QuestionText>
          {hasRegistered && (
            <VotePicker
              setHasVoted={setHasVoted}
              lastFipAddress={lastFipAddress}
              yesOption1={yesOptions[0]}
              yesOption2={yesOptions[1]}
            />
          )}
          {!hasRegistered && (
            <Register
              addVotingPower={addVotingPower}
              error={errorMessage}
              loading={loading}
              minerIds={minerIds}
              rawBytePower={rawBytePower}
              registering={registering}
              tokenPower={tokenPower}
              write={write}
            />
          )}
        </>
      )}
    </>
  );
}

export default VoteActions;
