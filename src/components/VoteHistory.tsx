import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { voteFactoryConfig } from 'constants/voteFactoryConfig';
import { voteTrackerConfig } from 'constants/voteTrackerConfig';
import { publicClient } from 'services/clients';
import { getAddress } from 'viem';
import { filecoin } from 'viem/chains';

const CustomFormControl = styled(FormControl)`
  label.Mui-focused {
    color: var(--blue);
  }

  [class*='MuiSelect-root'].Mui-focused fieldset {
    border-color: var(--blue);
  }

  [class*='MenuItem-root'] {
    background-color: #000;
  }
`;

function VoteHistory({ fips }: { fips: number[] }) {
  const [selectedFip, setSelectedFip] = useState('');

  useEffect(() => {
    // get vote history for selected fip
    // We use a promise here as multicall is enabled for this client
    // Meaning that we can reduce our load on the RPC URL and get data back faster.
    Promise.all([
      publicClient.readContract({
        abi: voteTrackerConfig.abi,
        address: getAddress(selectedFip, filecoin.id),
        functionName: 'voteStart',
      }),
      publicClient.readContract({
        abi: voteTrackerConfig.abi,
        address: getAddress(selectedFip, filecoin.id),
        functionName: 'voteLength',
      }),
      publicClient.readContract({
        abi: voteTrackerConfig.abi,
        address: getAddress(selectedFip, filecoin.id),
        functionName: 'question',
      }),
      publicClient.readContract({
        abi: voteTrackerConfig.abi,
        address: getAddress(selectedFip, filecoin.id),
        functionName: 'getVoteResultsRBP',
      }),
      publicClient.readContract({
        abi: voteTrackerConfig.abi,
        address: getAddress(selectedFip, filecoin.id),
        functionName: 'getVoteResultsMinerToken',
      }),
      publicClient.readContract({
        abi: voteTrackerConfig.abi,
        address: getAddress(selectedFip, filecoin.id),
        functionName: 'getVoteResultsToken',
      }),
      publicClient.readContract({
        abi: voteTrackerConfig.abi,
        address: getAddress(selectedFip, filecoin.id),
        functionName: 'winningVote',
      }),
    ]).then(([startTime, 
      length, 
      question, 
      rbpVotes, 
      minerTokenVotes, 
      tokenVotes, 
      winningVote
      // This is quite ugly.
    ]: [number, number, string, readonly [bigint, bigint, bigint, bigint], readonly [bigint, bigint, bigint, bigint], readonly [bigint, bigint, bigint, bigint], number]
    ) => {
      // Set all our states
      // You can sum together all votes using the rbpVotes, minerTokenVotes, and tokenVotes to get a total vote count and calculate percentages
    })
  }, [selectedFip]);

  return (
    <div>
      <h3>Vote History</h3>
      <CustomFormControl sx={{ m: 1, minWidth: 120 }} size='small'>
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
      </CustomFormControl>

      {/* graph here */}
    </div>
  );
}

export default VoteHistory;
