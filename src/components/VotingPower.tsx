import React, { useState } from 'react';
import styled from 'styled-components';
import { TextField } from '@mui/material';

function VotingPower({ rawBytePower }: { rawBytePower: string }) {
  return <div>{rawBytePower && <p>{rawBytePower}</p>}</div>;
}

export default VotingPower;
