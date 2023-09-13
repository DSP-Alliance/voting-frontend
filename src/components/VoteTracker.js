// import React, { Component } from 'react';
// import Web3 from 'web3';

// class VoteTrackerComponent extends Component {
//   constructor(props) {
//     super(props);
//     let provider = new Web3.providers.HttpProvider('https://api.node.glif.io');
//     let w3 = new Web3(provider);
//     this.state = {
//       FIP: 0,
//       address: null,
//       w3: w3,
//     };
//   }

//   async registerVoter(voteTrackerAddress, glifPoolAddress, minerIds) {
//     let voteTracker = new this.state.w3.eth.Contract(
//       require('../constants/VoteTracker.abi.json'),
//       voteTrackerAddress
//     );
//     let tx = await voteTracker.methods
//       .registerVoter(glifPoolAddress, minerIds)
//       .send();
//     return tx;
//   }

//   async castVote(voteTrackerAddress, vote) {
//     let voteTracker = new this.state.w3.eth.Contract(
//       require('../constants/VoteTracker.abi.json'),
//       voteTrackerAddress
//     );
//     let tx = await voteTracker.methods.castVote(vote).send();
//     return tx;
//   }

//   componentDidUpdate(prevProps) {
//     if (
//       this.props.FIP !== prevProps.FIP &&
//       this.props.address !== prevProps.address
//     ) {
//       this.setState({ FIP: this.props.FIP, address: this.props.address });
//       let w3 = new Web3(window.ethereum);
//     }
//   }

//   handleFIPInput = async (event) => {
//     let _FIP = event.target.value;
//     this.setState({ FIP: event.target.value });
//     let tracker = await this.getVoteTracker(_FIP).call();
//     this.setState({ address: tracker });
//     this.props.handleFIPInput(_FIP);
//   };

//   render() {
//     return (
//       <div>
//         <p>Vote Tracker Address</p>
//         <p>{this.props.voteTrackerAddress}</p>
//         <p>Glif Pool Address</p>
//         <p>{this.props.glifPoolAddress}</p>
//         <p>Miner Ids</p>
//         <p>{this.props.minerIds}</p>
//       </div>
//     );
//   }
// }

// export default VoteTrackerComponent;
