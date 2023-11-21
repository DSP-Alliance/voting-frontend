import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

import { publicClient } from 'services/clients';
import { voteTrackerConfig } from 'constants/voteTrackerConfig';
import VoteResults from 'components/VoteResults';
import { getWinningText } from 'utilities/helpers';
import { useVoteEndContext } from 'common/VoteEndContext';
import { useFipDataContext } from 'common/FipDataContext';
import Loading from 'common/Loading';
import useVoteResults from 'hooks/useVoteResults';
import VotePicker from './VotePicker';

interface VoteActionsProps {
  hasRegistered: boolean;
  hasVoted: boolean;
  setHasVoted: React.Dispatch<React.SetStateAction<boolean>>;
}

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
  const [loading, setLoading] = useState(false);
  const [questionText, setQuestionText] = useState('');
  const [winningVoteText, setWinningVoteText] = useState('');
  const [yesOptions, setYesOptions] = useState<string[]>([]);

  const { loadingFipData, lastFipAddress } = useFipDataContext();
  const voteResultsData = useVoteResults({
    fipAddress: lastFipAddress,
    yesOptions,
  });

  const { voteEndTime } = useVoteEndContext();

  useEffect(() => {
    async function getVoteInfo() {
      if (lastFipAddress) {
        setLoading(true);
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
          setLoading(false);
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
      {(loadingFipData || loading) && <Loading />}
      {(!voteEndTime || voteEndTime <= Date.now() || hasVoted) &&
        yesOptions.length > 0 && (
          <>
            <Header>Latest Vote Results</Header>
            <QuestionText>{questionText}</QuestionText>
            <QuestionText>Winning vote: {winningVoteText}</QuestionText>
            <VoteResults voteResultsData={voteResultsData} />
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
