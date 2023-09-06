import React, { Component, useState } from 'react';
import VoteFactoryComponent from './VoteFactory';
import VoteTrackerComponent from './VoteTracker';
import ConnectWalletComponent from './ConnectWallet';

class ParentComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            FIP: 0,
            accounts: [],
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

    handleFIPInput = async (_FIP) => {
        this.setState({ FIP: _FIP });
    }

    handleAccountsInput = async (_accounts) => {
        console.log(_accounts)
        this.setState({ accounts: _accounts });
    }

    render() {

        return (
            <div>
                <ConnectWalletComponent accounts={this.state.addresses} handleAccountsInput={this.handleAccountsInput}/>
                <VoteFactoryComponent FIP={this.state.FIP} handleFIPInput={this.handleFIPInput}/>
                <VoteTrackerComponent FIP={this.state.FIP} handleFIPInput={this.handleFIPInput}/>
            </div>
        );
    }
}

export default ParentComponent;