import React, { useState } from 'react';
import styled from 'styled-components';

import { publicClient } from 'services/clients';
import { voteTrackerConfig } from 'constants/voteTrackerConfig';
import type { Address } from './Home';

const VotePickerContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

function VotePicker({
  address,
  minerIds,
}: {
  address: Address | undefined;
  minerIds: string[];
}) {
  const [vote, setVote] = useState(0);
  const [glifPool, setGlifPool] = useState('0');

  async function sendVote() {
    const encodedVote = encodeVote(vote);
  }

  function encodeVote(vote: number) {
    return vote;
    // switch (vote % 3) {
    //   // yes Vote
    //   case 0: { // If we have two yes options then (vote % 6) can only equal 0 or 3
    //     if (doubleYesVote && vote % 6 >= 3) {
    //       // If it is 3 then it is for option 2
    //       yesVoteOption2 += weight;
    //     } else {
    //       // If it is 0 or there is no second yes option
    //       yesVoteOption1 += weight;
    //     }
    //   }
    //   // no Vote
    //   case 1:
    //     noVote += weight;
    //   // abstain Vote
    //   case 2:
    //     abstainVote += weight;
    // }
  }

  return (
    <VotePickerContainer>
      <button>Yes</button>
      <button>No</button>
      <button>Abstain</button>
    </VotePickerContainer>
  );
}

export default VotePicker;
