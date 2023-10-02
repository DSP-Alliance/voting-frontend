import React, { useState } from 'react';
import styled from 'styled-components';
import { TextField } from '@mui/material';

function VotingPower({ rawBytePower, tokenPower }: { rawBytePower: string, tokenPower: bigint }) {
  return <>
    <div>{rawBytePower && <p>{rawBytePower}</p>}</div>
    <div>{tokenPower > BigInt(0) && <p>{tokenPower.toString()} $FIL</p>}</div>
  </>;
}

export default VotingPower;
