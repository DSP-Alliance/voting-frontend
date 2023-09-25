import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';

const CustomFormControl = styled(FormControl)`
  label.Mui-focused {
    color: var(--blue);
  }

  [class*='MuiSelect-root'].Mui-focused fieldset {
    border-color: var(--blue);
  }

  [class*='MenuItem-root'] {
    background-color: #000;
  }
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
                <MenuItem key={fip} value={fip}>
                  {fip}
                </MenuItem>
              );
            })}
          <MenuItem value={'10'}>Ten</MenuItem>
          <MenuItem value={'20'}>Twenty</MenuItem>
          <MenuItem value={'30'}>Thirty</MenuItem>
        </Select>
      </CustomFormControl>

      {/* graph here */}
    </div>
  );
}

export default VoteHistory;
