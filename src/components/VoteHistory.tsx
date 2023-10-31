import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import ClipLoader from 'react-spinners/ClipLoader';
import { Address } from 'viem';

import { publicClient } from 'services/clients';
import { getFip } from 'services/fipService';
import VoteResults from 'components/VoteResults';
import ErrorMessage from 'common/ErrorMessage';
import { voteFactoryConfig } from 'constants/voteFactoryConfig';
import { voteTrackerConfig } from 'constants/voteTrackerConfig';
import { ZERO_ADDRESS, getWinningText, timeLength } from 'utilities/helpers';
import { useFipDataContext } from 'common/FipDataContext';

const VoteHistoryContainer = styled.div`
  display: block;
  margin: 24px;
  padding: 24px;
  border: 1px solid var(--blueshadow);
  border-radius: 8px;
  box-shadow: 0 3px 3px 0 var(--blueshadow);
`;

const ResultsContainer = styled.div`
  display: grid;
  grid-template-columns: 300px auto;
  gap: 12px;

  @media (max-width: 920px) {
    grid-template-columns: 1fr;
  }
`;

const Header = styled.h3`
  font-family: var(--titlefont);
`;

const SelectFipArea = styled.div`
  display: flex;
  flex-direction: row;
`;

const LoaderContainer = styled.div`
  align-self: center;
`;

const QuestionText = styled.div`
  overflow-wrap: break-word;
  margin-top: 24px;
`;

function VoteHistory() {
  const [allFipData, setAllFipData] = useState<any[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [selectedFip, setSelectedFip] = useState('');
  const [voteAddress, setVoteAddress] = useState<Address>(ZERO_ADDRESS);
  const [yesOptions, setYesOptions] = useState<string[]>([]);
  const [questionText, setQuestionText] = useState('');
  const [winningVoteText, setWinningVoteText] = useState('');
  const [startTime, setStartTime] = useState<number>(0);
  const [length, setLength] = useState<number>(0);

  const { fipList: fips } = useFipDataContext();

  useEffect(() => {
    async function getFIPInfo() {
      try {
        const response = await Promise.all(fips.map((fip) => getFip(fip)));
        setAllFipData(response);
      } catch (error: any) {
        setErrorMessage(JSON.stringify(error));
      }
    }

    if (fips.length > 0) getFIPInfo();
  }, [fips]);

  useEffect(() => {
    if (selectedFip) {
      setLoading(true);
      // We use a promise here as multicall is enabled for this client
      // Meaning that we can reduce our load on the RPC URL and get data back faster.
      publicClient
        .readContract({
          abi: voteFactoryConfig.abi,
          address: voteFactoryConfig.address,
          functionName: 'FIPnumToAddress',
          args: [parseInt(selectedFip)],
        })
        .then((addr) => {
          Promise.all([
            publicClient.readContract({
              abi: voteTrackerConfig.abi,
              address: addr,
              functionName: 'yesOptions',
              args: [BigInt(0)],
            }),
            publicClient.readContract({
              abi: voteTrackerConfig.abi,
              address: addr,
              functionName: 'yesOptions',
              args: [BigInt(1)],
            }),
            publicClient.readContract({
              abi: voteTrackerConfig.abi,
              address: addr,
              functionName: 'voteStart',
            }),
            publicClient.readContract({
              abi: voteTrackerConfig.abi,
              address: addr,
              functionName: 'voteLength',
            }),
            publicClient.readContract({
              abi: voteTrackerConfig.abi,
              address: addr,
              functionName: 'question',
            }),
            publicClient.readContract({
              abi: voteTrackerConfig.abi,
              address: addr,
              functionName: 'winningVote',
            }),
          ]).then(
            ([
              yesOption1,
              yesOption2,
              voteStart,
              voteLength,
              question,
              winningVote,
            ]) => {
              const yesOptions = [yesOption1, yesOption2];
              setYesOptions(yesOptions);

              setStartTime(voteStart);
              setLength(voteLength);
              setQuestionText(question);
              setWinningVoteText(getWinningText(winningVote, yesOptions));

              setVoteAddress(addr);
              setLoading(false);
            },
          );
        });
    }
  }, [selectedFip]);

  const timestamp = new Date(startTime * 1000).toLocaleString();

  return (
    <VoteHistoryContainer>
      <Header>Vote History</Header>
      <SelectFipArea>
        <FormControl sx={{ m: 1, minWidth: 120 }} size='small'>
          <InputLabel>FIP</InputLabel>
          <Select
            value={selectedFip}
            label='FIP'
            onChange={(e) => setSelectedFip(e.target.value)}
          >
            {Boolean(fips.length) &&
              fips.map((fip) => {
                return (
                  <MenuItem key={fip} value={fip}>
                    {fip + ' - '}
                    {
                      allFipData.find(
                        (f) =>
                          parseInt(
                            f.fip.replace(/"/g, '').replace(/^0+/, ''),
                          ) === fip,
                      )?.title
                    }
                  </MenuItem>
                );
              })}
          </Select>
        </FormControl>
        {loading && (
          <LoaderContainer>
            <ClipLoader color='var(--primary)' size='20px' />
          </LoaderContainer>
        )}
        {errorMessage && <ErrorMessage message={errorMessage} />}
      </SelectFipArea>
      <ResultsContainer>
        {!loading && voteAddress != ZERO_ADDRESS && (
          <>
            <div>
              {questionText && <QuestionText>{questionText}</QuestionText>}
              {Boolean(startTime) && <p>Started: {timestamp}</p>}
              {Boolean(length) && (
                <p>Length of time: {timeLength(length / 60)}</p>
              )}
              {winningVoteText && <p>Winning vote: {winningVoteText}</p>}
            </div>
            <VoteResults
              lastFipAddress={voteAddress}
              lastFipNum={parseInt(selectedFip)}
              loading={false}
              yesOptions={yesOptions}
            />
          </>
        )}
      </ResultsContainer>
    </VoteHistoryContainer>
  );
}

export default VoteHistory;
