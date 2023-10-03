import React, { useState } from 'react';
import styled from 'styled-components';

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
  console.log(tokenPower);

  function renderContent() {
    if (!hasVoted && hasRegistered) {
      return (
        <>
          <h4>Wallet Voting Power</h4>
          <div>{rawBytePower && <p>{rawBytePower}</p>}</div>
          <div>
            {tokenPower !== null ? <p>{tokenPower.toString()} $FIL</p> : null}
          </div>
        </>
      );
    }

    return <h4>Voting Power</h4>;
  }

  return <>{renderContent()}</>;
}

export default VotingPower;
