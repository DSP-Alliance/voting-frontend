import React, { Component } from 'react';

class ConnectWalletComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            connected: false,
            addresses: [],
        };
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