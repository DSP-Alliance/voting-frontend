import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import Countdown from 'react-countdown';
import type { Address } from 'components/Home';
import { useVoteEndContext } from 'common/VoteEndContext';
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
  const [currentAddress, setCurrentAddress] = useState<Address | undefined>(
    address,
  );
  const [yesOptions, setYesOptions] = useState<string[]>([]);
  const [showDetails, setShowDetails] = useState(address === undefined);
  const { voteEndTime } = useVoteEndContext();

  useEffect(() => {
    async function getVoteInfo() {
      if (currentAddress) {
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
  }, [currentAddress]); // eslint-disable-line react-hooks/exhaustive-deps

  function loadAddress() {
    publicClient
      .readContract({
        abi: voteFactoryConfig.abi,
        address: voteFactoryConfig.address,
        functionName: 'FIPnumToAddress',
        args: [
          parseInt(fipData?.fip?.replace(/"/g, '').replace(/^0+/, '') || ''),
        ],
      })
      .then((addr) => {
        setCurrentAddress(addr);
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
              <ArrowDropDownIcon
                onClick={() => {
                  setShowDetails(true);
                  loadAddress();
                }}
              />
            ) : (
              <ArrowDropUpIcon onClick={() => setShowDetails(false)} />
            ))}
        </TitleWithIcons>
        {voteEndTime && voteEndTime > Date.now() && (
          <span>
            Time left: <Countdown date={voteEndTime} />
          </span>
        )}
        {showDetails && questionText && (
          <div>
            <QuestionText>{questionText}</QuestionText>
            <Content>
              <VoteResults
                lastFipAddress={address}
                lastFipNum={parseInt(
                  fipData.fip?.replace(/"/g, '').replace(/^0+/, '') || '',
                )}
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
