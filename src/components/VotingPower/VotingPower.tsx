import React from 'react';
import { formatEther } from 'viem';
import { useAccount } from 'wagmi';
import styled from 'styled-components';

import Register from './Register';

interface VotingPowerProps {
  addVotingPower: (agentAddress: string) => void;
  errorMessage: string | undefined;
  hasRegistered: boolean;
  loading: boolean;
  minerIds: string[];
  rawBytePower: string;
  registering: boolean;
  tokenPower: bigint | null;
  write: () => void;
}

const Header = styled.h3`
  font-family: var(--titlefont);
`;

const InfoText = styled.span`
  font-style: italic;
`;

function VotingPower({
  addVotingPower,
  errorMessage,
  hasRegistered,
  loading,
  minerIds,
  rawBytePower,
  registering,
  tokenPower,
  write,
}: VotingPowerProps) {
  const { isConnected } = useAccount();

  return (
    <>
      <Header>Wallet Voting Power</Header>
      {!isConnected && (
        <InfoText>Connect your account to display voting power</InfoText>
      )}
      {isConnected && (
        <>
          {!hasRegistered && (
            <Register
              addVotingPower={addVotingPower}
              error={errorMessage}
              loading={loading}
              minerIds={minerIds}
              rawBytePower={rawBytePower}
              registering={registering}
              tokenPower={tokenPower}
              write={write}
            />
          )}
          {hasRegistered && (
            <>
              <div>{rawBytePower && <p>RBP: {rawBytePower}</p>}</div>
              <div>
                {tokenPower !== null ? (
                  <p>{formatEther(tokenPower)} $FIL</p>
                ) : null}
              </div>
            </>
          )}
        </>
      )}
    </>
  );
}

export default VotingPower;
