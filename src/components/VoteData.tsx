import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 12px;
  margin: 0 12px;
`;

const VoteSection = styled.div`
  display: block;
  border: 1px solid gray;
  padding: 12px;
`;

function VoteData() {
  return (
    <Container>
      <VoteSection>
        <h5>Latest Vote FIP</h5>
        <p>Hello</p>
      </VoteSection>
      <VoteSection>
        <h5>Latest Vote Results</h5>
      </VoteSection>
      <VoteSection>
        <h5>Voting Power</h5>
      </VoteSection>
    </Container>
  );
}

export default VoteData;
