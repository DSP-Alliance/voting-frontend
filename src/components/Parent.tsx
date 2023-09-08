import React, { Component, useState } from 'react';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { Address } from 'viem'
import "viem/window";
import { VoteFactory } from './VoteFactory';


export function Profile() {
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
      <VoteFactory />
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
