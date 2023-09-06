import React, { Component } from 'react';
import { Contract, Web3 } from 'web3';

const VOTE_FACTORY_ADDRESS = '0xf109f754cdea239d2811d1f285471e0dc25d918e'

class VoteFactoryComponent extends Component {
    constructor(props) {
        // Read the abi and contract address from the config file
        let abi = require('../assets/VoteFactory.abi.json');
        let provider = new Web3.providers.HttpProvider("https://api.node.glif.io");
        let w3 = new Web3(provider);
        let address = VOTE_FACTORY_ADDRESS;

        super(props);
        this.state = {
            FIP: 0,
            abi: abi,
            contract: address,
            tracker: null,
            provider: w3,
        };
    }

    startVote= async (fipNum, length, doubleYesOption, lsdTokens) => {
        let factory = new this.state.provider.eth.Contract(this.state.abi, this.state.contract);
        let _startVote = factory.methods.startVote(fipNum, length, doubleYesOption, lsdTokens).send();
        return _startVote;
    }

    userIsOwner = async (owner) => {
        let factory = new this.state.provider.eth.Contract(this.state.abi, this.state.contract);
        let _owner = factory.methods.owner().call();
        return _owner === owner; 
    }

    getVoteTracker = async (FIP) => {
        try {
            let contract = new Contract(this.state.abi, this.state.contract, this.state.provider)
            let tracker = await contract.methods.FIPnumToAddress(FIP).call();
            
            return tracker;
        } catch (error) {
            this.setState({ tracker: "0x0000000000000000000000000000000000000000" });

            console.error("error fetching vote tracker address", error);
        }
    }

    handleFIPInput = async (event) => {
        let _FIP = event.target.value;

        if (_FIP == null || _FIP == "") {
            _FIP = 0;
        }
        this.setState({ FIP: event.target.value });
        let tracker = await this.getVoteTracker(_FIP);
        this.props.handleFIPInput(_FIP);
    }

    render() {
        return (
            <div>
                <input 
                    type="text"
                    value={this.state.FIP}
                    onChange={this.handleFIPInput}
                />
                <p>FIP: {this.state.tracker}</p>
            </div>
        );
    }
}

export default VoteFactoryComponent;