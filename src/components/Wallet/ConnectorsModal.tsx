import React from 'react';
import { useConnect } from 'wagmi';
import styled from 'styled-components';
import { Dialog, DialogTitle, DialogContent } from '@mui/material';

import ErrorMessage from 'common/ErrorMessage';

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
  justify-content: center;
`;

const ConnectButton = styled.button`
  margin-right: 12px;
`;

export function Connectors({
  open,
  closeModal,
}: {
  open: boolean;
  closeModal: () => void;
}) {
  const { connect, connectors, error, isLoading, pendingConnector } =
    useConnect();

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
                <ConnectButton
                  disabled={!connector.ready}
                  key={connector.id}
                  onClick={() => {
                    connect({ connector });
                  }}
                >
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

export default Connectors;
