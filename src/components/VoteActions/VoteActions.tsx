import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';

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
  margin: 0;
`;

const LatestVoteContent = styled.div`
  min-width: 500px;
`;

const Content = styled.div`
  min-width: 350px;
`;

const QuestionText = styled.div`
  margin: 12px 0;
`;

function VoteActions({
  hasRegistered,
  hasVoted,
  setHasVoted,
}: VoteActionsProps) {
  const { t } = useTranslation();
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

  if (loadingFipData || loading) return <Loading />;

  if (
    (!voteEndTime || voteEndTime <= Date.now() || hasVoted) &&
    yesOptions.length > 0
  ) {
    return (
      <LatestVoteContent>
        <Header>{t('modals.voteActions.latestVoteResults')}</Header>
        <QuestionText>{questionText}</QuestionText>
        <QuestionText>
          {t('modals.voteActions.winningVote')}: {winningVoteText}
        </QuestionText>
        <VoteResults voteResultsData={voteResultsData} />
      </LatestVoteContent>
    );
  }

  if (voteEndTime && voteEndTime > Date.now() && !hasVoted) {
    return (
      <Content>
        <Header>{t('modals.VoteActions.chooseVote')}</Header>
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
            <i>{t('modals.VoteActions.registerToVote')}</i>
          </p>
        )}
      </Content>
    );
  }

  return null;
}

export default VoteActions;
