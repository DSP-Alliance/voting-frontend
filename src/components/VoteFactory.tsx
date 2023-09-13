// import React, { useState, useEffect } from 'react';
// import {
//   useAccount,
//   usePrepareSendTransaction,
//   useSendTransaction,
//   useWaitForTransaction,
//   useWalletClient,
// } from 'wagmi';
// import { Contract, Web3 } from 'web3';
// import { readContract } from 'viem/dist/types/actions/public/readContract';
// import {
//   Account,
//   Address,
//   createPublicClient,
//   encodeFunctionData,
//   formatEther,
//   fromHex,
//   getContract,
//   http,
//   parseEther,
//   toHex,
// } from 'viem';

// import { publicClient, walletClient } from '../services/clients';
// import { factory } from '../constants/factory';

// interface VoteFactoryProps {
//   handleFIPInput: (FIP: number) => void;
// }

// export function VoteFactory() {
//   const [fip, setFIP] = useState<number>(0);
//   const [length, setLength] = useState<number>(0);
//   const [twoYesOptions, setTwoYesOptions] = useState<boolean>(false);
//   const [lsdTokens, setLSDTokens] = useState<string>();
//   let abi = require('../assets/VoteFactory.abi.json');

//   const { address, connector, isConnected } = useAccount();

//   // const startVote = async () => {
//   //     let account = address as Address;
//   //     const res = await walletClient.writeContract({
//   //         abi: abi,
//   //         address: factory.address,
//   //         functionName: 'startVote',
//   //         account: address,
//   //         args: [fip, length, twoYesOptions, lsdTokens],
//   //     })
//   // }
//   // const owner = async () => {
//   //     await publicClient.readContract({
//   //         abi: factory.abi,
//   //         address: factory.address,
//   //         functionName: 'owner',
//   //     })
//   // }

//   useEffect(() => {
//     // const read = async () => {
//     //     const contract = getContract({
//     //         address: factory.address,
//     //         abi: factory.abi,
//     //         publicClient: publicClient,
//     //     })
//     // }

//     console.log(address);
//   }, [address]);

//   // const { config } = usePrepareSendTransaction({
//   //     to: VOTE_FACTORY_ADDRESS,
//   // });

//   // const { data, sendTransaction } = useSendTransaction(config);

//   // const { isLoading, isSuccess } = useWaitForTransaction({
//   //     hash: data?.hash,
//   // })

//   return (
//     <form>
//       <p>{address}</p>
//       <input
//         aria-label='FIP'
//         placeholder='0'
//         onChange={(e) => setFIP(Number(e.target.value))}
//         value={fip}
//       />
//       <br />
//       <input
//         aria-label='length'
//         placeholder='0'
//         onChange={(e) => setLength(Number(e.target.value))}
//         value={length}
//       />
//       <br />
//       <input
//         aria-label='Two Yes Options'
//         placeholder='false'
//         onChange={(e) => setTwoYesOptions(Boolean(e.target.value))}
//         value={twoYesOptions ? 'true' : 'false'}
//       />
//       <br />
//       <input
//         aria-label='LSD Tokens'
//         placeholder='0x0000...0000'
//         onChange={(e) => setLSDTokens(e.target.value)}
//         value={lsdTokens}
//       />
//       <button disabled={!fip || !length || !twoYesOptions || !lsdTokens}>
//         Send
//       </button>
//     </form>
//   );
// }

// // class VoteFactoryComponent extends Component {
// //     constructor(props) {
// //         // Read the abi and contract address from the config file
// //         let abi = require('../assets/VoteFactory.abi.json');
// //         let provider = new Web3.providers.HttpProvider("https://api.node.glif.io");
// //         let w3 = new Web3(provider);
// //         let address = VOTE_FACTORY_ADDRESS;

// //         super(props);
// //         this.state = {
// //             FIP: 0,
// //             abi: abi,
// //             contract: address,
// //             tracker: null,
// //             provider: w3,
// //         };
// //     }

// //     userIsOwner = async (owner) => {
// //         let factory = new this.state.provider.eth.Contract(this.state.abi, this.state.contract);
// //         let _owner = factory.methods.owner().call();
// //         return _owner === owner;
// //     }

// //     getVoteTracker = async (FIP) => {
// //         try {
// //             let contract = new this.state.provider.eth.Contract(this.state.abi, this.state.contract);
// //             let tracker = await contract.methods.FIPnumToAddress(FIP).call();

// //             return tracker;
// //         } catch (error) {
// //             this.setState({ tracker: "0x0000000000000000000000000000000000000000" });

// //             console.error("error fetching vote tracker address", error);
// //         }
// //     }

// //     handleFIPInput = async (event) => {
// //         let _FIP = event.target.value;

// //         if (_FIP == null || _FIP == "") {
// //             _FIP = 0;
// //         }
// //         this.setState({ FIP: event.target.value });
// //         let tracker = await this.getVoteTracker(_FIP);
// //         this.props.handleFIPInput(_FIP);
// //     }

// //     render() {
// //         return (
// //             <div>
// //                 <input
// //                     type="text"
// //                     value={this.state.FIP}
// //                     onChange={this.handleFIPInput}
// //                 />
// //                 <p>FIP: {this.state.tracker}</p>
// //             </div>
// //         );
// //     }
// // }

// // export default VoteFactoryComponent;
