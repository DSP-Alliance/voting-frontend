import * as React from 'react';
import { Menu, MenuItem } from '@mui/material';
import { useDisconnect } from 'wagmi';
import styled from 'styled-components';
import { formatEther } from 'viem';

import KebabMenuIcon from 'assets/kebab-menu.svg';
import RoundedButton from 'common/RoundedButton';
import { formatBytesWithLabel } from 'utilities/helpers';

const Image = styled.img`
  color: var(--white);
  height: 10px;
  width: 10px;
`;

const WalletPower = styled.div`
  display: flex;
  flex-direction: column;
  align-items: start;
  gap: 12px;
  padding: 12px;
`;

const DisconnectText = styled.p`
  color: var(--red);
`;

function WalletMenu({
  rawBytePower,
  tokenPower,
}: {
  rawBytePower: bigint;
  tokenPower: bigint;
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

  return (
    <>
      <RoundedButton
        id='wallet-button'
        aria-controls={open ? 'wallet-menu' : undefined}
        aria-haspopup='true'
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
      >
        Wallet
        <Image src={KebabMenuIcon} />
      </RoundedButton>
      <Menu
        id='wallet-menu'
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'wallet-button',
        }}
      >
        <WalletPower>
          <span>
            RBP: {formatBytesWithLabel(parseInt(rawBytePower.toString()))}
          </span>
          <span>{(+formatEther(tokenPower)).toFixed(4)} $FIL</span>
        </WalletPower>
        <MenuItem onClick={handleDisconnect}>
          <DisconnectText>Disconnect</DisconnectText>
        </MenuItem>
      </Menu>
    </>
  );
}

export default WalletMenu;
