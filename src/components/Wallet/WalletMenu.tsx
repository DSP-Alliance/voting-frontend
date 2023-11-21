import * as React from 'react';
import { Button, Menu, MenuItem } from '@mui/material';
import { useDisconnect } from 'wagmi';

function WalletMenu() {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const { disconnect } = useDisconnect();

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (e: React.MouseEvent) => {
    e.preventDefault();
    disconnect();
    setAnchorEl(null);
  };

  function renderVotingPower() {
    return (
      <>
        <span>RBP: hello</span>
        {/* <div>{rawBytePower && <p>RBP: {rawBytePower}</p>}</div>
        <div>
          {tokenPower !== null ? <p>{formatEther(tokenPower)} $FIL</p> : null}
        </div> */}
      </>
    );
  }

  return (
    <div>
      <Button
        id='wallet-button'
        aria-controls={open ? 'wallet-menu' : undefined}
        aria-haspopup='true'
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
      >
        Wallet
      </Button>
      <Menu
        id='wallet-menu'
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'wallet-button',
        }}
      >
        {renderVotingPower()}
        <MenuItem onClick={handleClose}>Disconnect</MenuItem>
      </Menu>
    </div>
  );
}

export default WalletMenu;