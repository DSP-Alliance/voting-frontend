import React from 'react';
import { TextField } from '@mui/material';

function VotingPower() {
  return (
    <div>
      <TextField size='small' label='Add Agent Address' />
      <button
        onClick={() => {
          // addAgent()
          // https://filfox.info/api/v1/address/%7BagentAddress%7D
        }}
      >
        Add
      </button>
    </div>
  );
}

export default VotingPower;
