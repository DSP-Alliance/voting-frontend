import React, { Component, useState, useEffect } from 'react';
import Web3 from 'web3';

class ConnectWalletComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            connected: false,
            addresses: []
        };
    }

    connectWallet = async () => {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        // Get the current chain ID
        const chainId = await window.ethereum.request({ method: 'eth_chainId' });
        if (chainId !== 314) {
            // Request to change to chain Id 314
            await window.ethereum.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: '0x13a' }],
            });
        }
        return accounts;
    }

    handleConnect = async () => {
        let accounts = [];
        try {
            accounts = await this.connectWallet();
        } catch (error) {
            console.error(error);
        }
        this.setState({ 
            connected: true,
            addresses: accounts
        });
        
    }

    handleDisconnect = async () => {
        this.setState({ 
            connected: false,
            addresses: []
        });
    }

    render() {
        if (this.state.connected) {
            return (
                <div>
                    <button onClick={this.handleDisconnect}>
                        Disconnect
                    </button>
                </div>
            );
        } else {
            return (
                <div>
                    <button onClick={this.handleConnect}>
                        Connect Wallet
                    </button>
                </div>
            );
        }
    }
}

export default ConnectWalletComponent;