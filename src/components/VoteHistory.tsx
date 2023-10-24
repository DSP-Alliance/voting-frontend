import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import ClipLoader from 'react-spinners/ClipLoader';

import { publicClient } from 'services/clients';
import { voteFactoryConfig } from 'constants/voteFactoryConfig';
import VoteResults from './VoteResults';
import { Address } from 'viem';
import { ZERO_ADDRESS, get_winning_text, timeLength } from 'utilities/helpers';
import { voteTrackerConfig } from 'constants/voteTrackerConfig';

const Container = styled.div`
  display: grid;
  grid-template-columns: 150px 300px auto;
  gap: 12px;

  @media (max-width: 920px) {
    grid-template-columns: 1fr;
  }
`;

const LoaderContainer = styled.div`
  align-self: center;
`;

const QuestionText = styled.div`
  overflow-wrap: break-word;
  margin-top: 24px;
`;

const ChartArea = styled.div`
  margin: 24px;

  @media (max-width: 1080px) {
    grid-column-start: 1;
  }
`;

function VoteHistory({ fips }: { fips: number[] }) {
  const [loading, setLoading] = useState(false);
  const [selectedFip, setSelectedFip] = useState('');
  const [voteAddress, setVoteAddress] = useState<Address>(ZERO_ADDRESS);
  const [yesOptions, setYesOptions] = useState<string[]>([]);
  const [questionText, setQuestionText] = useState('');
  const [winningVoteText, setWinningVoteText] = useState('');
  const [startTime, setStartTime] = useState<number>(0);
  const [length, setLength] = useState<number>(0);

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
              setWinningVoteText(get_winning_text(winningVote, yesOptions));

              setVoteAddress(addr);
              setLoading(false);
            },
          );
        });
    }
  }, [selectedFip]);

  const timestamp = new Date(startTime * 1000).toLocaleString();

  return (
    <Container>
      <div>
        <h3>Vote History</h3>
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
                    {fip}
                  </MenuItem>
                );
              })}
          </Select>
        </FormControl>
      </div>
      {loading && (
        <LoaderContainer>
          <ClipLoader color='var(--primary)' />
        </LoaderContainer>
      )}
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
    </Container>
  );
}

export default VoteHistory;
