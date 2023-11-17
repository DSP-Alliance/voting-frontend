import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import ClipLoader from 'react-spinners/ClipLoader';

import { publicClient } from 'services/clients';
import { voteTrackerConfig } from 'constants/voteTrackerConfig';
import VoteResults from 'components/VoteResults';
import { getWinningText } from 'utilities/helpers';
import { useVoteEndContext } from 'common/VoteEndContext';
import { useFipDataContext } from 'common/FipDataContext';
import VotePicker from './VotePicker';

interface VoteActionsProps {
  hasRegistered: boolean;
  hasVoted: boolean;
  setHasVoted: React.Dispatch<React.SetStateAction<boolean>>;
}

const LoaderContainer = styled.div`
  margin-top: 60px;
  display: flex;
  justify-content: center;
`;

const Header = styled.h3`
  font-family: var(--titlefont);
`;

const QuestionText = styled.div`
  margin-bottom: 12px;
`;

function VoteActions({
  hasRegistered,
  hasVoted,
  setHasVoted,
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

          const newYesOptions = [
            yesOption1,
            ...(yesOption2 ? [yesOption2] : []),
          ];

          setQuestionText(question);
          setWinningVoteText(getWinningText(winningVote, newYesOptions));

          setYesOptions(newYesOptions);
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
            <Header>Latest Vote Results</Header>
            <QuestionText>{questionText}</QuestionText>
            <QuestionText>Winning vote: {winningVoteText}</QuestionText>
            <VoteResults
              lastFipAddress={lastFipAddress}
              lastFipNum={lastFipNum}
              yesOptions={yesOptions}
            />
          </>
        )}
      {voteEndTime && voteEndTime > Date.now() && !hasVoted && (
        <>
          <Header>Choose Vote</Header>
          <QuestionText>{questionText}</QuestionText>
          {hasRegistered && (
            <VotePicker
              setHasVoted={setHasVoted}
              yesOption1={yesOptions[0]}
              yesOption2={yesOptions[1]}
            />
          )}
          {!hasRegistered && (
            <p>
              <i>Register in order to vote</i>
            </p>
          )}
        </>
      )}
    </>
  );
}

export default VoteActions;
