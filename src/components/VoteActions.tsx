import React, { useState } from 'react';
import styled from 'styled-components';
import { getAddress } from 'viem';
import axios from 'axios';
import ClipLoader from 'react-spinners/ClipLoader';

import { RPC_URL, publicClient } from 'services/clients';
import { ownableConfig } from 'constants/ownableConfig';
import VotePicker from 'components/VotePicker';
import AddVotePower from 'components/AddVotePower';
import type { Address } from './Home';

interface VoteActionsProps {
  address: Address | undefined;
  addVotingPower: (agentAddress: string) => void;
  countdownValue: number;
  errorMessage: string;
  hasRegistered: boolean;
  hasVoted: boolean;
  loadingFipData: boolean;
  lastFipNum: number | undefined;
  lastFipAddress: Address | undefined;
  loading: boolean;
}

const InfoText = styled.span`
  font-style: italic;
`;

function VoteActions({
  address,
  addVotingPower,
  countdownValue,
  errorMessage,
  hasRegistered,
  hasVoted,
  loadingFipData,
  lastFipNum,
  lastFipAddress,
  loading,
}: VoteActionsProps) {
  function renderVoteResults() {
    // show latest vote results
    if (lastFipNum) return <p>hi</p>;
    return <InfoText>Last vote data does not exist</InfoText>;
  }

  return (
    <>
      {(!Boolean(countdownValue) || hasVoted) && (
        <>
          <h4>Latest Vote Results</h4>
          {loadingFipData ? (
            <ClipLoader color='var(--primary)' />
          ) : (
            renderVoteResults()
          )}
        </>
      )}
      {Boolean(countdownValue) && !hasVoted && (
        <>
          <h4>Choose Vote</h4>
          {hasRegistered && (
            <VotePicker address={address} lastFipAddress={lastFipAddress} />
          )}
          {!hasRegistered && (
            <AddVotePower
              addVotingPower={addVotingPower}
              error={errorMessage}
              loading={loading}
            />
          )}
        </>
      )}
    </>
  );
}

export default VoteActions;
