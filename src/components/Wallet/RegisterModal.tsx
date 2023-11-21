// import { Dialog, DialogTitle, DialogContent } from '@mui/material';
// import React, { useEffect, useState } from 'react';
// import styled from 'styled-components';
// import { useAccount, useContractWrite, useWaitForTransaction } from 'wagmi';
// import { getAddress } from 'viem';
// import axios from 'axios';

// import { voteTrackerConfig } from 'constants/voteTrackerConfig';
// import { ownableConfig } from 'constants/ownableConfig';
// import { voteFactoryConfig } from 'constants/voteFactoryConfig';
// import { RPC_URL, publicClient } from 'services/clients';
// import { formatBytesWithLabel, ZERO_ADDRESS } from 'utilities/helpers';
// import Loading from 'common/Loading';
// import type { Address } from 'components/Home';
// import MultisigRegisterModal from 'components/MultisigRegister';
// import ManualMinerRegisterModal from 'components/ManualMinerRegister';
// import Register from './Register';

// const MultisigRegisterButton = styled.button`
//   grid-column-start: 2;
//   width: 120px;
//   justify-self: center;
// `;

// /** Rewrite this flow to check if user is connected; if not
//  * take them to connection view when they want to register with wallet
//  * otherwise register them when they click register with wallet
//  */

// function RegisterModal({
//   open,
//   closeModal,
// }: {
//   open: boolean;
//   closeModal: () => void;
// }) {
//   const { isConnected } = useAccount();
//   const [agentAddress, setAgentAddress] = useState<Address>(ZERO_ADDRESS);
//   const [errorMessage, setErrorMessage] = useState('');
//   const [hasRegistered, setHasRegistered] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [minerIds, setMinerIds] = useState<string[]>([]);
//   const [rawBytePower, setRawBytePower] = useState('');
//   const [tokenPower, setTokenPower] = useState<bigint>(BigInt(0));
//   const [showMultisigRegister, setShowMultisigRegister] = useState(false);
//   const [showMinerRegister, setShowMinerRegister] = useState(false);

//   async function getHasRegistered() {
//     if (lastFipAddress) {
//       try {
//         const userHasRegistered = await publicClient.readContract({
//           address: voteFactoryConfig.address,
//           abi: voteFactoryConfig.abi,
//           functionName: 'registered',
//           args: [address || `0x`],
//         });

//         setHasRegistered(userHasRegistered);
//       } catch {
//         setHasRegistered(false);
//       }
//     }
//   }

//   useEffect(() => {
//     if (isConnected) {
//       getHasRegistered();
//     }
//   }, [lastFipAddress, address, isConnected]);

//   const {
//     data,
//     error,
//     isLoading: isLoadingWrite,
//     write,
//   } = useContractWrite({
//     abi: voteFactoryConfig.abi,
//     address: voteFactoryConfig.address,
//     functionName: 'register',
//     args: [agentAddress, minerIds.map((id) => BigInt(id.replace('f0', '')))],
//   });

//   const { isLoading: isLoadingWait, isSuccess } = useWaitForTransaction({
//     hash: data?.hash,
//   });

//   useEffect(() => {
//     if (isSuccess) {
//       setHasRegistered(true);
//     }
//   }, [isSuccess]);

//   useEffect(() => {
//     async function getByteAndTokenPower() {
//       try {
//         const [tokenPower, bytePower, minerTokenPower] =
//           await publicClient.readContract({
//             address: lastFipAddress || ZERO_ADDRESS,
//             abi: voteTrackerConfig.abi,
//             functionName: 'getVotingPower',
//             args: [address || ZERO_ADDRESS],
//           });

//         setRawBytePower(formatBytesWithLabel(parseInt(bytePower.toString())));
//         setTokenPower(bytePower > 0 ? minerTokenPower : tokenPower);
//       } catch {
//         setTokenPower(BigInt(0));
//         setRawBytePower('');
//       }
//     }

//     getByteAndTokenPower();
//   }, [address]);

//   async function addVotingPower(agentAddress: string) {
//     setLoading(true);
//     setAgentAddress(
//       getAddress(agentAddress.length > 0 ? agentAddress : ZERO_ADDRESS),
//     );

//     try {
//       let rawBytes = 0;

//       async function getMiners(address: string) {
//         const request = await axios.get(
//           `https://filfox.info/api/v1/address/${address}`,
//         );
//         const ownedMiners = request.data?.ownedMiners || [];
//         setMinerIds((prev) => [...prev, ...ownedMiners]);

//         const promises: Promise<any>[] = [];

//         ownedMiners.map((minerId: string) => {
//           promises.push(
//             axios.post(RPC_URL, {
//               headers: { 'Content-Type': 'application/json' },
//               jsonrpc: '2.0',
//               method: 'Filecoin.StateMinerPower',
//               params: [minerId, null],
//               id: 1,
//             }),
//           );
//         });

//         const promiseArray = await Promise.all(promises);
//         rawBytes = promiseArray.reduce(
//           (acc, result) =>
//             acc + parseInt(result.data.result.MinerPower.RawBytePower),
//           0,
//         );
//       }

//       await getMiners(address as string);

//       if (agentAddress.length > 0) {
//         const glifOwner = await publicClient.readContract({
//           address: getAddress(agentAddress || ZERO_ADDRESS),
//           abi: ownableConfig.abi,
//           functionName: 'owner',
//         });

//         if (glifOwner === address) {
//           await getMiners(agentAddress);
//         }
//       }

//       const [tokenPower] = await publicClient.readContract({
//         address: lastFipAddress || ZERO_ADDRESS,
//         abi: voteTrackerConfig.abi,
//         functionName: 'getVotingPower',
//         args: [address || ZERO_ADDRESS],
//       });

//       setRawBytePower(formatBytesWithLabel(rawBytes));
//       setTokenPower(tokenPower);
//     } catch (error) {
//       console.error(error);
//       setErrorMessage('Error registering you to vote');
//     } finally {
//       setLoading(false);
//     }
//   }

//   return (
//     <>
//       <Dialog open={open} onClose={closeModal}>
//         <DialogTitle>Register</DialogTitle>
//         <DialogContent dividers>
//           Please choose how you want to register
//           <Register
//             addVotingPower={addVotingPower}
//             error={errorMessage}
//             loading={loading}
//             minerIds={minerIds}
//             rawBytePower={rawBytePower}
//             registering={registering}
//             tokenPower={tokenPower}
//             write={write}
//           />
//           <MultisigRegisterButton onClick={() => setShowMultisigRegister(true)}>
//             Register Multisig
//           </MultisigRegisterButton>
//           <MultisigRegisterButton onClick={() => setShowMinerRegister(true)}>
//             Register Miner
//           </MultisigRegisterButton>
//         </DialogContent>
//       </Dialog>
//       {showMultisigRegister && (
//         <MultisigRegisterModal
//           open={showMultisigRegister}
//           closeModal={() => setShowMultisigRegister(false)}
//         />
//       )}
//       {showMinerRegister && (
//         <ManualMinerRegisterModal
//           open={showMinerRegister}
//           closeModal={() => setShowMinerRegister(false)}
//         />
//       )}
//     </>
//   );
// }

// export default RegisterModal;
