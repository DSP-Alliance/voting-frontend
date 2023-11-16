import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import ClipLoader from 'react-spinners/ClipLoader';
import Countdown from 'react-countdown';
import { useVoteEndContext } from 'common/VoteEndContext';
import { useFipDataContext } from 'common/FipDataContext';
import VoteStatus from 'components/VoteStatus';
import VoteResults from 'components/VoteResults';
import { voteTrackerConfig } from 'constants/voteTrackerConfig';
import { publicClient } from 'services/clients';
import { getFip } from 'services/fipService';
import type { FipData } from 'services/fipService';

const LoaderContainer = styled.div`
  display: flex;
  justify-content: center;
`;

const Title = styled.span`
  color: var(--font-color);
  font-size: 24px;
  font-weight: 600;
`;

const QuestionText = styled.div`
  color: var(--font-color);
  margin: 12px 0;
  font-weight: 600;
  font-size: 18px;
`;

const Content = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 24px;
`;

const Subheader = styled.div`
  color: var(--font-color);
  font-weight: 600;
  margin-top: 24px;
`;

const AuthorsContent = styled.div`
  color: #595959;
`;

const Link = styled.a`
  color: var(--primary);
  word-break: break-all;
`;

function VoteData() {
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [questionText, setQuestionText] = useState('');
  const [yesOptions, setYesOptions] = useState<string[]>([]);
  const [fipData, setFipData] = useState<FipData>();
  const { voteEndTime } = useVoteEndContext();

  const {
    lastFipNum: num,
    loadingFipData,
    lastFipAddress,
    lastFipNum,
  } = useFipDataContext();

  useEffect(() => {
    async function getFIPInfo() {
      if (num) {
        try {
          const response = await getFip(num);
          setFipData(response);
        } catch (error: any) {
          setErrorMessage(JSON.stringify(error));
        }
      }
    }

    getFIPInfo();
  }, [num]); // eslint-disable-line react-hooks/exhaustive-deps

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

          const newYesOptions = [
            yesOption1,
            ...(yesOption2 ? [yesOption2] : []),
          ];

          setQuestionText(question);

          setYesOptions(newYesOptions);
        } catch (err) {
          console.error(err);
          setYesOptions([]);
        }
      }
    }

    getVoteInfo();
  }, [lastFipAddress]); // eslint-disable-line react-hooks/exhaustive-deps

  console.log({ fipData, voteEndTime });

  const renderDiscussionLinks = (links: string | undefined) => {
    if (links) {
      const linksArray = links.split(', ').map((link) => {
        return (
          <li key={link}>
            <Link href={link} target='_blank' rel='noreferrer'>
              {link}
            </Link>
          </li>
        );
      });

      return linksArray;
    } else {
      return '-';
    }
  };

  if (loadingFipData)
    return (
      <LoaderContainer>
        <ClipLoader color='var(--primary)' />
      </LoaderContainer>
    );

  return (
    <div>
      <div>
        <Title>{fipData?.title}</Title>{' '}
        <VoteStatus status={fipData?.status || 'unknown'} />
        {voteEndTime && voteEndTime > Date.now() && (
          <span>
            Time left: <Countdown date={voteEndTime} />
          </span>
        )}
        {questionText && (
          <div>
            <QuestionText>{questionText}</QuestionText>
            <Content>
              <VoteResults
                lastFipAddress={lastFipAddress}
                lastFipNum={lastFipNum}
                loading={voteEndTime === undefined}
                yesOptions={yesOptions}
              />
              <div>
                <Subheader>Authors</Subheader>
                <AuthorsContent>
                  {fipData?.author?.replace(/\"/g, '')}
                </AuthorsContent>
                <Subheader>Discussions</Subheader>
                <div>
                  {fipData && renderDiscussionLinks(fipData['discussions-to'])}
                </div>
              </div>
            </Content>
          </div>
        )}
      </div>
    </div>
  );
}

export default VoteData;
