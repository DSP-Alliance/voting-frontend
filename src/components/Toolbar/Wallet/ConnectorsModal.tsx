import React, { useEffect } from 'react';
import { useConnect, useAccount } from 'wagmi';
import styled from 'styled-components';
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
  justify-content: center;
`;

// const ConnectButton = styled.button`
//   margin-right: 12px;
// `;

function ConnectorsModal({
  open,
  closeModal,
}: {
  open: boolean;
  closeModal: () => void;
}) {
  const { connect, connectors, error, isLoading, pendingConnector } =
    useConnect();
  const { isConnected } = useAccount();

  useEffect(() => {
    if (isConnected) closeModal();
  }, [isConnected]);

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
        <DialogTitle>Connect Wallet</DialogTitle>
        <DialogContent dividers>
          <OptionsContainer>
            Choose a method to connect.
            {error && <ErrorMessage message={error.message} />}
            <ConnectorsContainer>
              {connectors.map((connector) => (
                <Button
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
                </Button>
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
