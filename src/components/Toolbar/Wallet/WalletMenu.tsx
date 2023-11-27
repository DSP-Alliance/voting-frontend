import * as React from 'react';
import { Menu, MenuItem } from '@mui/material';
import { useDisconnect } from 'wagmi';
import styled from 'styled-components';
import { formatEther } from 'viem';
import { useTranslation } from 'react-i18next';

import KebabMenuIcon from 'assets/kebab-menu.svg';
import RoundedButton from 'common/RoundedButton';
import Loading from 'common/Loading';
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
  loadingVotingPower,
  rawBytePower,
  tokenPower,
}: {
  loadingVotingPower: boolean;
  rawBytePower: bigint;
  tokenPower: bigint;
}) {
  const { t } = useTranslation();
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

  function renderWallerPower() {
    if (loadingVotingPower) return <Loading />;
    if (rawBytePower === 0n && tokenPower === 0n)
      return t('messages.noVotingPower');
    return (
      <>
        <span>{t('labels.votingPower')}</span>
        <ul>
          <li>
            {t('labels.rbp')}:{' '}
            {formatBytesWithLabel(parseInt(rawBytePower.toString()))}
          </li>
          <li>
            {(+formatEther(tokenPower)).toFixed(4)} ${t('labels.fil')}
          </li>
        </ul>
      </>
    );
  }

  return (
    <>
      <RoundedButton
        id='wallet-button'
        aria-controls={open ? 'wallet-menu' : undefined}
        aria-haspopup='true'
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
      >
        {t('buttons.wallet')}
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
        <WalletPower>{renderWallerPower()}</WalletPower>
        <MenuItem onClick={handleDisconnect}>
          <DisconnectText>{t('buttons.disconnect')}</DisconnectText>
        </MenuItem>
      </Menu>
    </>
  );
}

export default WalletMenu;
