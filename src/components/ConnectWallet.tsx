import React, { Component, useState, useEffect } from 'react';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { filecoin } from 'wagmi/chains';

interface ConnectWalletProps {
    onClick: () => void;
    connected: boolean;
    addresses: string[];
}

export const ConnectWallet: React.FC<ConnectWalletProps> = ({ onClick, connected, addresses }) => {
    const { address, connector, isConnected } = useAccount()
    const { connect, connectors, error, isLoading, pendingConnector } =
        useConnect()
    const { disconnect } = useDisconnect()

    if (connector && isConnected) {
        return (
          <div>
            <div>Connected to {connector.name}</div>
            <button onClick={(e) => {
              e.preventDefault();
              disconnect();
            }}>Disconnect</button>
          </div>
        )
      }
    
      return (
        <div>
          {connectors.map((connector) => (
            <button
              disabled={!connector.ready}
              key={connector.id}
              onClick={() => connect({ connector })}
            >
              {connector.name}
              {!connector.ready && ' (unsupported)'}
              {isLoading &&
                connector.id === pendingConnector?.id &&
                ' (connecting)'}
            </button>
          ))}
    
          {error && <div>{error.message}</div>}
        </div>
      )
}

//export default ConnectWallet;