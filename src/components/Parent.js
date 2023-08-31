import React, { Component, useState } from 'react';
import VoteFactoryComponent from './VoteFactory';
import VoteTrackerComponent from './VoteTracker';

class ParentComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            FIP: 0,
        };
    }

    handleFIPInput = async (_FIP) => {
        this.setState({ FIP: _FIP });
    }

    render() {
        return (
            <div>
                <VoteFactoryComponent FIP={this.state.FIP} handleFIPInput={this.handleFIPInput}/>
                <VoteTrackerComponent FIP={this.state.FIP} handleFIPInput={this.handleFIPInput}/>
            </div>
        );
    }
}

export default ParentComponent;