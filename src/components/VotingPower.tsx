import React, { useState } from 'react';
import styled from 'styled-components';
import { TextField } from '@mui/material';

function VotingPower({ rawBytePower, tokenPower }: { rawBytePower: string, tokenPower: bigint | null }) {
  console.log(tokenPower)
  return <>
    <div>{rawBytePower && <p>{rawBytePower}</p>}</div>
    <div>{tokenPower !== null ? <p>{tokenPower.toString()} $FIL</p> : <></>}</div>
  </>;
}

export default VotingPower;
