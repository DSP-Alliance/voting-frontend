import React, { useEffect } from 'react';
import { useConnect, useAccount } from 'wagmi';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { Button, Dialog, DialogTitle, DialogContent } from '@mui/material';

import ErrorMessage from 'common/ErrorMessage';
import CoinbaseLogo from 'assets/Logo_Coinbase.png';
import MetaMaskLogo from 'assets/Logo_MetaMask.png';

const Container = styled.div`
  grid-column-start: 3;
  justify-self: end;
  display: flex;
  margin-right: 12px;
`;

const OptionsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const ConnectorsContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-items: center;
  align-items: center;
`;

const ConnectButton = styled(Button)`
  width: 300px;
  gap: 12px;
`;

function ConnectorsModal({
  open,
  closeModal,
  registering,
}: {
  open: boolean;
  closeModal: ({ openVoteModal }: { openVoteModal: boolean }) => void;
  registering: boolean;
}) {
  const { t } = useTranslation();
  const { connect, connectors, error, isLoading, pendingConnector } =
    useConnect();
  const { isConnected } = useAccount();

  useEffect(() => {
    if (isConnected) closeModal({ openVoteModal: false });
  }, [isConnected, registering]);

  function renderContent() {
    return (
      <Dialog
        open={open}
        onClose={closeModal}
        fullWidth
        maxWidth='sm'
        PaperProps={{
          style: {
            color: 'var(--font-color)',
          },
        }}
      >
        <DialogTitle>{t('modals.connectors.title')}</DialogTitle>
        <DialogContent dividers>
          <OptionsContainer>
            {t('modals.connectors.optionsLabel')}
            {error && <ErrorMessage message={error.message} />}
            <ConnectorsContainer>
              {connectors.map((connector) => (
                <ConnectButton
                  disabled={!connector.ready}
                  key={connector.id}
                  onClick={() => {
                    connect({ connector });
                  }}
                >
                  {connector.id === 'coinbaseWallet' && (
                    <img src={CoinbaseLogo} width='30px' height='30px' />
                  )}
                  {connector.id === 'metaMask' && (
                    <img src={MetaMaskLogo} width='30px' height='30px' />
                  )}
                  {connector.name}
                  {!connector.ready && ' (unsupported)'}
                  {isLoading &&
                    connector.id === pendingConnector?.id &&
                    ' (connecting)'}
                </ConnectButton>
              ))}
            </ConnectorsContainer>
          </OptionsContainer>
        </DialogContent>
      </Dialog>
    );
  }

  return <Container>{renderContent()}</Container>;
}

export default ConnectorsModal;
