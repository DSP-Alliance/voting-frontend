import React from 'react';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import styled from 'styled-components';

const Container = styled.div`
  grid-column-start: 3;
  justify-self: end;
  display: flex;
`;

const OptionsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const ConnectorsContainer = styled.div`
  display: flex;
  justify-content: end;
`;

const ConnectedText = styled.div`
  font-size: 14px;
  margin-right: 12px;
`;

const ConnectButton = styled.button`
  margin-right: 12px;
`;

const ErrorMessage = styled.div`
  align-self: center;
  color: var(--error);
`;

export function Connectors() {
  const { connector, isConnected } = useAccount();
  const { connect, connectors, error, isLoading, pendingConnector } =
    useConnect();
  const { disconnect } = useDisconnect();

  function renderContent() {
    if (connector && isConnected) {
      return (
        <OptionsContainer>
          <ConnectedText>Connected to {connector.name}</ConnectedText>
          <ConnectButton
            onClick={(e) => {
              e.preventDefault();
              disconnect();
            }}
          >
            Disconnect
          </ConnectButton>
        </OptionsContainer>
      );
    }

    return (
      <OptionsContainer>
        <ConnectorsContainer>
          {connectors.map((connector) => (
            <ConnectButton
              disabled={!connector.ready}
              key={connector.id}
              onClick={() => {
                connect({ connector })
              }}
            >
              Connect to {connector.name}
              {!connector.ready && ' (unsupported)'}
              {isLoading &&
                connector.id === pendingConnector?.id &&
                ' (connecting)'}
            </ConnectButton>
          ))}
        </ConnectorsContainer>
        {error && <ErrorMessage>{error.message}</ErrorMessage>}
      </OptionsContainer>
    );
  }

  return <Container>{renderContent()}</Container>;
}

export default Connectors;
