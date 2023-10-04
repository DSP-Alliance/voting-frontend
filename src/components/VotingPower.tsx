import React from 'react';
import { formatEther } from 'viem';
import { useAccount } from 'wagmi';
import styled from 'styled-components';

const InfoText = styled.span`
  font-style: italic;
`;

function VotingPower({
  hasRegistered,
  hasVoted,
  rawBytePower,
  tokenPower,
}: {
  hasRegistered: boolean;
  hasVoted: boolean;
  rawBytePower: string;
  tokenPower: bigint | null;
}) {
  const { isConnected } = useAccount();

  return (
    <>
      <h4>Wallet Voting Power</h4>
      {!isConnected && (
        <InfoText>Connect your account to display voting power</InfoText>
      )}
      {isConnected && !hasVoted && hasRegistered && (
        <>
          <div>{rawBytePower && <p>RBP: {rawBytePower}</p>}</div>
          <div>
            {tokenPower !== null ? <p>{formatEther(tokenPower)} $FIL</p> : null}
          </div>
        </>
      )}
    </>
  );
}

export default VotingPower;
