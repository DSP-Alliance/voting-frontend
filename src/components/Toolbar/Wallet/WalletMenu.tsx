import * as React from 'react';
import { Menu, MenuItem } from '@mui/material';
import { useDisconnect } from 'wagmi';
import styled from 'styled-components';
import { formatEther } from 'viem';

import KebabMenuIcon from 'assets/kebab-menu.svg';

const WalletButton = styled.button`
  color: var(--white);
  background-color: var(--primary);
  border-radius: 24px;
  padding: 0 12px;
  display: flex;
  gap: 4px;
  align-items: center;
`;

const Image = styled.img`
  color: var(--white);
  height: 10px;
  width: 10px;
`;

function WalletMenu({
  rawBytePower,
  tokenPower,
}: {
  rawBytePower: string;
  tokenPower: bigint | null;
}) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const { disconnect } = useDisconnect();

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDisconnect = (e: React.MouseEvent) => {
    e.preventDefault();
    disconnect();
    setAnchorEl(null);
  };

  function renderVotingPower() {
    return (
      <>
        <div>{rawBytePower && <p>RBP: {rawBytePower}</p>}</div>
        <div>
          {tokenPower !== null ? <p>{formatEther(tokenPower)} $FIL</p> : null}
        </div>
      </>
    );
  }

  return (
    <>
      <WalletButton
        id='wallet-button'
        aria-controls={open ? 'wallet-menu' : undefined}
        aria-haspopup='true'
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
      >
        Wallet
        <Image src={KebabMenuIcon} />
      </WalletButton>
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
        <MenuItem onClick={handleDisconnect}>Disconnect</MenuItem>
      </Menu>
    </>
  );
}

export default WalletMenu;
