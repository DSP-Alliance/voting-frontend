import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import ClipLoader from 'react-spinners/ClipLoader';

import { publicClient } from 'services/clients';
import { voteTrackerConfig } from 'constants/voteTrackerConfig';
import VoteResults from 'components/VoteResults';
import VotePicker from 'components/VotePicker';
import Register from 'components/Register';
import { getWinningText } from 'utilities/helpers';
import { useVoteEndContext } from './VoteEndContext';
import { useFipDataContext } from './FipDataContext';

interface VoteActionsProps {
  addVotingPower: (agentAddress: string) => void;
  errorMessage: string | undefined;
  hasRegistered: boolean;
  hasVoted: boolean;
  loading: boolean;
  minerIds: string[];
  rawBytePower: string;
  registering: boolean;
  setHasVoted: React.Dispatch<React.SetStateAction<boolean>>;
  tokenPower: bigint | null;
  write: () => void;
}

const LoaderContainer = styled.div`
  margin-top: 60px;
  display: flex;
  justify-content: center;
`;

const QuestionText = styled.div`
  margin-bottom: 12px;
`;

function VoteActions({
  addVotingPower,
  errorMessage,
  hasRegistered,
  hasVoted,
  loading,
  minerIds,
  rawBytePower,
  registering,
  setHasVoted,
  tokenPower,
  write,
}: VoteActionsProps) {
  const [questionText, setQuestionText] = useState('');
  const [winningVoteText, setWinningVoteText] = useState('');
  const [yesOptions, setYesOptions] = useState<string[]>([]);

  const { loadingFipData, lastFipNum, lastFipAddress } = useFipDataContext();

  const { voteEndTime } = useVoteEndContext();

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
          const winningVote = await publicClient.readContract({
            address: lastFipAddress,
            abi: voteTrackerConfig.abi,
            functionName: 'winningVote',
          });

          setQuestionText(question);
          setWinningVoteText(getWinningText(winningVote, yesOptions));

          setYesOptions([yesOption1, ...(yesOption2 ? [yesOption2] : [])]);
        } catch (err) {
          console.error(err);
          setYesOptions([]);
        }
      }
    }

    getVoteInfo();
  }, [lastFipAddress]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      {loadingFipData && (
        <LoaderContainer>
          <ClipLoader color='var(--primary)' />
        </LoaderContainer>
      )}
      {(!voteEndTime || voteEndTime <= Date.now() || hasVoted) &&
        yesOptions.length > 0 && (
          <>
            <h4>Latest Vote Results</h4>
            <QuestionText>{questionText}</QuestionText>
            <QuestionText>Winning vote: {winningVoteText}</QuestionText>
            <VoteResults
              lastFipAddress={lastFipAddress}
              lastFipNum={lastFipNum}
              loading={voteEndTime === undefined}
              yesOptions={yesOptions}
            />
          </>
        )}
      {voteEndTime && voteEndTime > Date.now() && !hasVoted && (
        <>
          <h4>Choose Vote</h4>
          <QuestionText>{questionText}</QuestionText>
          {hasRegistered && (
            <VotePicker
              setHasVoted={setHasVoted}
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
