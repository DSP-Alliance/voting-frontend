import React from 'react';
import { formatEther } from 'viem';
import { useAccount } from 'wagmi';
import styled from 'styled-components';

const Header = styled.h3`
  font-family: var(--titlefont);
`;

const InfoText = styled.span`
  font-style: italic;
`;

function VotingPower({
  hasRegistered,
  rawBytePower,
  tokenPower,
}: {
  hasRegistered: boolean;
  rawBytePower: string;
  tokenPower: bigint | null;
}) {
  const { isConnected } = useAccount();

  return (
    <>
      <Header>Wallet Voting Power</Header>
      {!isConnected && (
        <InfoText>Connect your account to display voting power</InfoText>
      )}
      {isConnected && (
        <>
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
          {!hasRegistered && (
            <InfoText>Register when a vote is active</InfoText>
          )}
        </>
      )}
    </>
  );
}

export default VotingPower;
