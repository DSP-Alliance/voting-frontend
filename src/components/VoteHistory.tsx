import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';

const CustomFormControl = styled(FormControl)`
  label.Mui-focused {
    color: var(--portal2023-green);
  }

  [class*='MuiSelect-root'].Mui-focused fieldset {
    border-color: var(--portal2023-green);
  }

  [class*='MenuItem-root'] {
    background-color: var(--portal2023-black);
  }
`;

const CustomMenuItem = styled(MenuItem)`
  /* &.MuiMenu-root {
    background-color: var(--portal2023-black);
  } */
`;

function VoteHistory({ fips }: { fips: string[] }) {
  const [selectedFip, setSelectedFip] = useState('');

  useEffect(() => {
    // get vote history for selected fip
  }, [selectedFip]);

  return (
    <div>
      <h3>Vote History</h3>
      <CustomFormControl sx={{ m: 1, minWidth: 120 }} size='small'>
        <InputLabel>FIP</InputLabel>
        <Select
          value={selectedFip}
          label='FIP'
          onChange={(e) => setSelectedFip(e.target.value)}
        >
          {Boolean(fips.length) &&
            fips.map((fip) => {
              return (
                <CustomMenuItem key={fip} value={fip}>
                  {fip}
                </CustomMenuItem>
              );
            })}
          <CustomMenuItem value={'10'}>Ten</CustomMenuItem>
          <CustomMenuItem value={'20'}>Twenty</CustomMenuItem>
          <CustomMenuItem value={'30'}>Thirty</CustomMenuItem>
        </Select>
      </CustomFormControl>

      {/* graph here */}
    </div>
  );
}

export default VoteHistory;
