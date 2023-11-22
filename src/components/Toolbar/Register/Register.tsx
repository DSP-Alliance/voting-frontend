import React, { useState } from 'react';
import styled from 'styled-components';
import { TextField } from '@mui/material';
import ClipLoader from 'react-spinners/ClipLoader';
import { useAccount, useContractWrite, useWaitForTransaction } from 'wagmi';
import { formatEther, getAddress } from 'viem';
import axios from 'axios';

import { voteTrackerConfig } from 'constants/voteTrackerConfig';
import { ownableConfig } from 'constants/ownableConfig';
import { voteFactoryConfig } from 'constants/voteFactoryConfig';
import { RPC_URL, publicClient } from 'services/clients';
import { formatBytesWithLabel, ZERO_ADDRESS } from 'utilities/helpers';
import Loading from 'common/Loading';
import type { Address } from 'components/Home';
import RegisterConfirmation from './RegisterConfirmation';
import { useFipDataContext } from 'common/FipDataContext';

const ActionArea = styled.div`
  display: flex;
  flex-direction: column;
`;

const ErrorMessage = styled.div`
  font-size: 14px;
  background-color: var(--error-bg);
  color: var(--error);
  border-radius: 4px;
  padding: 12px;
  word-wrap: break-word;
  max-width: 50ch;
  margin-top: 8px;
`;

const RegisterButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 200px;
`;

// addVotingPower,
// error,
// loading,
// registering,
// write,
// rawBytePower,
// tokenPower,
// minerIds,
function Register({
  setShowMultisigRegister,
  setHasRegistered,
}: {
  setShowMultisigRegister: React.Dispatch<React.SetStateAction<boolean>>;
  setHasRegistered: React.Dispatch<React.SetStateAction<boolean>>;
  // addVotingPower: (address: string) => void;
  // error: string | undefined;
  // loading: boolean;
  // registering: boolean;
  // write: () => void;
  // rawBytePower: string;
  // tokenPower: bigint | null;
  // minerIds: string[];
}) {
  const { address } = useAccount();
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [showAddressField, setShowAddressField] = useState<boolean>();
  const [minerIds, setMinerIds] = useState<string[]>([]);
  const [rawBytePower, setRawBytePower] = useState('');
  const [tokenPower, setTokenPower] = useState<bigint>(BigInt(0));
  const [showConfirmation, setShowConfirmation] = useState(false);

  const { lastFipAddress } = useFipDataContext();

  async function addVotingPower(agentAddress: string | undefined) {
    setLoading(true);

    const agentAddressToAdd = agentAddress
      ? getAddress(agentAddress)
      : ZERO_ADDRESS;

    try {
      let rawBytes = 0;

      async function getMiners(address: string) {
        const request = await axios.get(
          `https://filfox.info/api/v1/address/${address}`,
        );
        const ownedMiners = request.data?.ownedMiners || [];
        setMinerIds((prev) => [...prev, ...ownedMiners]);

        const promises: Promise<any>[] = [];

        ownedMiners.map((minerId: string) => {
          promises.push(
            axios.post(RPC_URL, {
              headers: { 'Content-Type': 'application/json' },
              jsonrpc: '2.0',
              method: 'Filecoin.StateMinerPower',
              params: [minerId, null],
              id: 1,
            }),
          );
        });

        const promiseArray = await Promise.all(promises);
        rawBytes = promiseArray.reduce(
          (acc, result) =>
            acc + parseInt(result.data.result.MinerPower.RawBytePower),
          rawBytes, // TODO Lisa check if this should be RawBytePower (to acc) or 0 (because it overrides)
        );
      }

      await getMiners(address as string);

      if (agentAddress) {
        const glifOwner = await publicClient.readContract({
          address: agentAddressToAdd,
          abi: ownableConfig.abi,
          functionName: 'owner',
        });

        if (glifOwner === address) {
          await getMiners(agentAddress);
        }
      }

      const [tokenPower] = await publicClient.readContract({
        address: lastFipAddress || ZERO_ADDRESS,
        abi: voteTrackerConfig.abi,
        functionName: 'getVotingPower',
        args: [address || ZERO_ADDRESS],
      });

      setRawBytePower(formatBytesWithLabel(rawBytes));
      setTokenPower(tokenPower);
    } catch (error) {
      console.error(error);
      setErrorMessage('Error registering you to vote');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <ActionArea>
        {!showAddressField && (
          <RegisterButtonContainer>
            <button
              disabled={loading}
              onClick={() => {
                addVotingPower('');
                setShowConfirmation(true);
              }}
            >
              Register Wallet
            </button>
            <button
              disabled={loading}
              onClick={() => {
                setShowAddressField(true);
              }}
            >
              Register Wallet With Agent
            </button>
            <button
              onClick={() => {
                setShowMultisigRegister(true);
              }}
            >
              Register Multisig
            </button>
          </RegisterButtonContainer>
        )}
        {loading && <ClipLoader color='var(--primary)' />}
        {showAddressField && (
          <RegisterConfirmation
            addVotingPower={addVotingPower}
            showAddressField={showAddressField}
            setShowAddressField={setShowAddressField}
            setHasRegistered={setHasRegistered}
            minerIds={minerIds}
            rawBytePower={rawBytePower}
            tokenPower={tokenPower}
            showConfirmation={showConfirmation}
            setShowConfirmation={setShowConfirmation}
          />
        )}
      </ActionArea>
      {errorMessage && <ErrorMessage>Error: {errorMessage}</ErrorMessage>}
    </div>
  );
}

export default Register;
