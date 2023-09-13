import React, { useState, useEffect } from 'react';
// import {
//   useAccount,
//   usePrepareSendTransaction,
//   useSendTransaction,
//   useWaitForTransaction,
//   useWalletClient,
// } from 'wagmi';
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
import { voteFactoryConfig } from 'constants/voteFactoryConfig';

// interface VoteFactoryProps {
//   handleFIPInput: (FIP: number) => void;
// }

export function VoteFactory() {
  return <div>{voteFactoryConfig.toString()}</div>;
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
}

export default VoteFactory;
