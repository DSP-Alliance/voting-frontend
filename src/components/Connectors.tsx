import React from 'react';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  flex-direction: row;
  gap: 12px;
  justify-content: end;
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

const ConnectedContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const ConnectButton = styled.button`
  padding: 12px;
  margin-right: 12px;
`;

const ErrorMessage = styled.div`
  align-self: center;
`;

export function Connectors() {
  const { address, connector, isConnected } = useAccount();
  const { connect, connectors, error, isLoading, pendingConnector } =
    useConnect();
  const { disconnect } = useDisconnect();

  function renderContent() {
    if (connector && isConnected) {
      return (
        <ConnectedContainer>
          <div>Connected to {connector.name}</div>
          <ConnectButton
            onClick={(e) => {
              e.preventDefault();
              disconnect();
            }}
          >
            Disconnect
          </ConnectButton>
        </ConnectedContainer>
      );
    }

    return (
      <OptionsContainer>
        <ConnectorsContainer>
          {connectors.map((connector) => (
            <ConnectButton
              disabled={!connector.ready}
              key={connector.id}
              onClick={() => connect({ connector })}
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
