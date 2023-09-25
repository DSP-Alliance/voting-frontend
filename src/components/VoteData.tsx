import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import Countdown from 'react-countdown';

import VotePicker from 'components/VotePicker';
import FIPInfo from 'components/FIPInfo';
import { publicClient } from 'services/clients';
import type { Address } from './Home';
import { voteFactoryConfig } from 'constants/voteFactoryConfig';
import { voteTrackerConfig } from 'constants/voteTrackerConfig';

const VoteDataContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const DataSections = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 12px;
`;

const VoteSection = styled.div`
  display: block;
  border: 1px solid var(--blue);
  padding: 24px;
`;

const InfoText = styled.span`
  font-style: italic;
`;

function VoteData({
  address,
  lastFipNum,
  countdownValue,
}: {
  address: Address | undefined;
  lastFipNum: number | undefined;
  countdownValue: number;
}) {
  return (
    <VoteDataContainer>
      <div>
        Time left: <Countdown date={Date.now() + countdownValue} />
      </div>
      <DataSections>
        <VoteSection>
          <h4>Latest Vote FIP</h4>
          {lastFipNum && <FIPInfo num={lastFipNum} />}
          {!lastFipNum && <InfoText>Last vote data does not exist</InfoText>}
        </VoteSection>
        <VoteSection>
          {/* if have already voted */}
          {!Boolean(countdownValue) && <h4>Latest Vote Results</h4>}
          {Boolean(countdownValue) && (
            <>
              <h4>Choose Vote</h4>
              <VotePicker address={address} />
            </>
          )}
          {/* https://github.com/0xpluto/fip-voting/blob/master/src/components/TotalVotes.tsx */}
        </VoteSection>
        <VoteSection>
          {/* if have already voted */}
          {/* <h4>Voting Power</h4> */}
          <h4>Wallet Voting Power</h4>
          {/* https://github.com/0xpluto/fip-voting/blob/e19da9798c2756fcc471a91b1ae03c4f492bb3c3/src/components/VotingPower.tsx */}
        </VoteSection>
      </DataSections>
    </VoteDataContainer>
    // Previous votes chart
    // https://github.com/0xpluto/fip-voting/blob/master/src/components/PreviousVotes.tsx */}
  );
}

export default VoteData;
