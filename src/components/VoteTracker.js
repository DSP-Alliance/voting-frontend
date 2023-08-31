import React, { Component } from 'react';
import Web3 from 'web3';

class VoteTrackerComponent extends Component {
    constructor(props) {
        // Read the abi and contract address from the config file
        let abi = require('../assets/VoteFactory.abi.json');

        super(props);
        this.state = {
            FIP: 0,
            contract: null,
        };
    }

    async registerVoter(voteTrackerAddress, glifPoolAddress, minerIds) {
        if (this.state.FIP == null || this.state.contract == null) {
            throw new Error("FIP and contract must be set before registering a voter");
        }
        let voteTracker = new this.state.w3.eth.Contract(require('../assets/VoteTracker.abi.json'), voteTrackerAddress);
        let tx = await voteTracker.methods.registerVoter(glifPoolAddress, minerIds).send();
        return tx;
    }

    async castVote(voteTrackerAddress, vote) {
        if (this.state.FIP == null || this.state.contract == null) {
            throw new Error("FIP and contract must be set before registering a voter");
        }
        let voteTracker = new this.state.w3.eth.Contract(require('../assets/VoteTracker.abi.json'), voteTrackerAddress);
        let tx = await this.state.contract.methods.castVote(vote).send();
        return tx;
    }

    componentDidUpdate(prevProps) {
        if (this.props.FIP !== prevProps.FIP && this.props.address !== prevProps.address) {
            this.setState({ FIP: this.props.FIP });
            let w3 = new Web3(window.ethereum);

        }
    }
    
    handleFIPInput = async (event) => {
        let _FIP = event.target.value;
        this.setState({ FIP: event.target.value });
        let tracker = await this.getVoteTracker(_FIP).call();
        this.props.handleFIPInput(_FIP);
    }

    render() {
        return (
            <div>
                <p>Vote Tracker Address</p>
                <p>{this.props.voteTrackerAddress}</p>
                <p>Glif Pool Address</p>
                <p>{this.props.glifPoolAddress}</p>
                <p>Miner Ids</p>
                <p>{this.props.minerIds}</p>
            </div>
        );
    }
}

export default VoteTrackerComponent;