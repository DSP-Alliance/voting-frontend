import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

import VotePicker from 'components/VotePicker';
import FIPInfo from 'components/FIPInfo';
import type { Address } from './Home';

const VoteDataContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin: 24px;
`;

const DataSections = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 12px;
`;

const VoteSection = styled.div`
  display: block;
  border: 1px solid var(--portal2023-green);
  padding: 24px;
`;

function VoteData({ address }: { address: Address | undefined }) {
  const [lastFipNum, setLastFipNum] = useState(75);
  useEffect(() => {
    // get vote data from the blockchain
    // getVoteResults for latest deployedVotes FIP
  }, []);

  return (
    <VoteDataContainer>
      <div>Time left: 00:00:00</div>
      <DataSections>
        {/* Add countdown for time left on vote if one is active */}
        <VoteSection>
          <h5>Latest Vote FIP</h5>
          <FIPInfo num={lastFipNum} />
        </VoteSection>
        <VoteSection>
          {/* if have already voted */}
          {/* <h5>Latest Vote Results</h5> */}
          <h5>Choose Vote</h5>
          <VotePicker address={address} />
          {/* https://github.com/0xpluto/fip-voting/blob/master/src/components/TotalVotes.tsx */}
        </VoteSection>
        <VoteSection>
          {/* if have already voted */}
          {/* <h5>Voting Power</h5> */}
          <h5>Wallet Voting Power</h5>
          {/* https://github.com/0xpluto/fip-voting/blob/e19da9798c2756fcc471a91b1ae03c4f492bb3c3/src/components/VotingPower.tsx */}
        </VoteSection>
      </DataSections>
    </VoteDataContainer>
    // Previous votes chart
    // https://github.com/0xpluto/fip-voting/blob/master/src/components/PreviousVotes.tsx */}
  );
}

export default VoteData;
