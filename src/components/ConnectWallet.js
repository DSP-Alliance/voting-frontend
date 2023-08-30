import React, { Component } from 'react';
import VOTE_FACTORY_ADDRESS from '../assets/addresses.js';
import Web3 from 'web3';

class ConnectWalletComponent extends Component {
    constructor(props) {
        // Read the abi and contract address from the config file
        let abi = require('../assets/VoteFactory.abi.json');

        super(props);
        this.state = {
            connected: false,
            addresses: [],
            factory: new Web3.eth.Contract(abi, VOTE_FACTORY_ADDRESS),
            w3: new Web3("https://api.node.glif.io")
        };
    }

    async votes() {
        let votes = await this.state.factory.methods.deployedVotes().call();
        return votes;
    }

    async getVoteAddress(fip) {
        let address = await this.state.factory.methods.FIPnumToAddress(fip).call();
        return address;
    }

    async registerVoter(voteTrackerAddress, glifPoolAddress, minerIds) {
        let voteTracker = new this.state.w3.eth.Contract(require('../assets/VoteTracker.abi.json'), voteTrackerAddress);
        let tx = await voteTracker.methods.registerVoter(glifPoolAddress, minerIds).send();
        return tx;
    }

    async castVote(voteTrackerAddress, vote) {
        let voteTracker = new this.state.w3.eth.Contract(require('../assets/VoteTracker.abi.json'), voteTrackerAddress);
        let tx = await voteTracker.methods.castVote(vote).send();
        return tx;
    }

    async connectWallet() {
        try {
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            this.setState({ addresses: accounts });
            this.setState({ connected: true });
            window.ethereum.connected = true;
            console.log(accounts);
        } catch (error) {
            console.error(error);
        }
        // Do something with accounts[0]
        console.log(window.ethereum.connected)
    }

    async disconnectWallet() {
        window.ethereum.connected = false;
        this.setState({ connected: false });
        this.setState({ addresses: [] });
    }

    render() {
        if (this.state.connected) {
            return (
                <div>
                    <button onClick={() => this.setState(this.disconnectWallet)}>
                        Disconnect
                    </button>
                </div>
            );
        } else {
            return (
                <div>
                    <button onClick={() => this.setState(this.connectWallet)}>
                        Connect Wallet
                    </button>
                </div>
            );
        }
    }
}

export default ConnectWalletComponent;