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