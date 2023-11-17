import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import dayjs from 'dayjs';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import Countdown from 'react-countdown';
import type { Address } from 'components/Home';
import { useVoteEndContext } from 'common/VoteEndContext';
import Loading from 'common/Loading';
import VoteStatus from 'components/VoteStatus';
import VoteResults from 'components/VoteResults';
import { voteTrackerConfig } from 'constants/voteTrackerConfig';
import { voteFactoryConfig } from 'constants/voteFactoryConfig';
import { publicClient } from 'services/clients';
import type { FipData } from 'services/fipService';

const TitleWithIcons = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  justify-content: space-between;
`;

const TitleContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
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

const VoteEndedLabel = styled.div`
  color: var(--caption);
  font-size: 16px;
  font-weight: 600;
  text-transform: uppercase;
`;

function VoteData({
  address,
  fipData,
  showExpandButton = false,
}: {
  address: Address | undefined;
  fipData: FipData;
  showExpandButton?: boolean;
}) {
  const [questionText, setQuestionText] = useState('');
  const [loadingVoteInfo, setLoadingVoteInfo] = useState(false);
  const [loadingAddress, setLoadingAddress] = useState(false);
  const [voteEndTime, setVoteEndTime] = useState<number | undefined>(undefined);
  const [currentAddress, setCurrentAddress] = useState<Address | undefined>(
    address,
  );
  const [yesOptions, setYesOptions] = useState<string[]>([]);
  const [showDetails, setShowDetails] = useState(address !== undefined);

  useEffect(() => {
    async function getVoteInfo() {
      if (currentAddress) {
        setLoadingVoteInfo(true);
        try {
          const question = await publicClient.readContract({
            address: currentAddress,
            abi: voteTrackerConfig.abi,
            functionName: 'question',
          });
          const yesOption1 = await publicClient.readContract({
            address: currentAddress,
            abi: voteTrackerConfig.abi,
            functionName: 'yesOptions',
            args: [BigInt(0)],
          });
          const yesOption2 = await publicClient.readContract({
            address: currentAddress,
            abi: voteTrackerConfig.abi,
            functionName: 'yesOptions',
            args: [BigInt(1)],
          });
          const voteStartTime = await publicClient.readContract({
            abi: voteTrackerConfig.abi,
            address: currentAddress,
            functionName: 'voteStart',
          });

          const voteLength = await publicClient.readContract({
            abi: voteTrackerConfig.abi,
            address: currentAddress,
            functionName: 'voteLength',
          });

          const endTime = (voteStartTime + voteLength) * 1000;
          setVoteEndTime(endTime);

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
        setLoadingVoteInfo(false);
      }
    }

    getVoteInfo();
  }, [currentAddress]); // eslint-disable-line react-hooks/exhaustive-deps

  function loadAddress() {
    setLoadingAddress(true);
    publicClient
      .readContract({
        abi: voteFactoryConfig.abi,
        address: voteFactoryConfig.address,
        functionName: 'FIPnumToAddress',
        args: [
          parseInt(fipData?.fip?.replace(/"/g, '').replace(/^0+/, '') || '0'),
        ],
      })
      .then((addr) => {
        setCurrentAddress(addr);
        setLoadingAddress(false);
      });
  }

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

  function renderEndTime() {
    if (!voteEndTime) return null;

    if (voteEndTime > Date.now())
      return (
        <span>
          Time left: <Countdown date={voteEndTime} />
        </span>
      );

    return (
      <VoteEndedLabel>
        Ended {dayjs(voteEndTime).format('DD MMM YYYY')}
      </VoteEndedLabel>
    );
  }

  return (
    <div>
      <div>
        <TitleWithIcons>
          <TitleContainer>
            <Title>{fipData?.title}</Title>{' '}
            <VoteStatus status={fipData?.status || 'unknown'} />
          </TitleContainer>
          {showExpandButton &&
            (showDetails ? (
              <ArrowDropUpIcon onClick={() => setShowDetails(false)} />
            ) : (
              <ArrowDropDownIcon
                onClick={() => {
                  setShowDetails(true);
                  if (!currentAddress) loadAddress();
                }}
              />
            ))}
        </TitleWithIcons>
        {renderEndTime()}
        {(loadingVoteInfo || loadingAddress) && <Loading />}
        {showDetails && questionText && (
          <div>
            <QuestionText>{questionText}</QuestionText>
            <Content>
              <VoteResults
                lastFipAddress={currentAddress}
                lastFipNum={parseInt(
                  fipData.fip?.replace(/"/g, '').replace(/^0+/, '') || '',
                )}
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
