import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import { useAccount } from 'wagmi';
import { getAddress } from 'viem';
import axios from 'axios';
import { Tooltip } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { voteTrackerConfig } from 'constants/voteTrackerConfig';
import { ownableConfig } from 'constants/ownableConfig';
import { RPC_URL, publicClient } from 'services/clients';
import { ZERO_ADDRESS } from 'utilities/helpers';
import RegisterConfirmation from './RegisterConfirmation';
import { useFipDataContext } from 'common/FipDataContext';
import Loading from 'common/Loading';
import ConnectorsModal from '../Wallet/ConnectorsModal';
import RegisterAgent from './RegisterAgent';

const ActionArea = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 12px;
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
  align-items: center;
  gap: 8px;
`;

const ModalButton = styled.button`
  color: var(--primary);
  background-color: var(--white);
  border: 1px solid var(--primary);
  border-radius: 24px;
  padding: 8 24px;
  width: 300px;

  &:hover {
    color: var(--white);
  }
`;

function Register({
  setShowMultisigRegister,
  setHasRegistered,
  rawBytePower,
  setRawBytePower,
  tokenPower,
  setTokenPower,
  setShowMinerRegister,
  closeModal,
}: {
  setShowMultisigRegister: React.Dispatch<React.SetStateAction<boolean>>;
  setHasRegistered: React.Dispatch<React.SetStateAction<boolean>>;
  rawBytePower: bigint;
  setRawBytePower: React.Dispatch<React.SetStateAction<bigint>>;
  tokenPower: bigint;
  setTokenPower: React.Dispatch<React.SetStateAction<bigint>>;
  setShowMinerRegister: React.Dispatch<React.SetStateAction<boolean>>;
  closeModal: ({ openVoteModal }: { openVoteModal: boolean }) => void;
}) {
  const { t } = useTranslation();
  const { address, isConnected } = useAccount();
  const [agentAddress, setAgentAddress] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const openVoteModalRef = useRef<boolean>(false);
  const [minerIds, setMinerIds] = useState<string[]>([]);
  const [showConnectorsModal, setShowConnectorsModal] = useState(false);
  const [showAddressField, setShowAddressField] = useState<boolean>(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const { lastFipAddress } = useFipDataContext();

  async function addVotingPower(agent: string | undefined) {
    setLoading(true);

    const agentAddressToAdd = agent ? getAddress(agent) : ZERO_ADDRESS;

    try {
      let rawBytes = rawBytePower;

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
          0,
        );
      }

      await getMiners(agent as string);

      if (agent) {
        const glifOwner = await publicClient.readContract({
          address: lastFipAddress || ZERO_ADDRESS,
          abi: ownableConfig.abi,
          functionName: 'owner',
        });

        if (glifOwner === address) {
          await getMiners(agent);
        }
      }

      const [tokenPower] = await publicClient.readContract({
        address: lastFipAddress || ZERO_ADDRESS,
        abi: voteTrackerConfig.abi,
        functionName: 'getVotingPower',
        args: [address || ZERO_ADDRESS],
      });

      setRawBytePower(rawBytes);
      setTokenPower(tokenPower);
    } catch (error) {
      console.error(error);
      setErrorMessage('Error registering you to vote');
    } finally {
      setLoading(false);
    }
  }

  function handleWalletConnect() {
    if (!isConnected) {
      setShowConnectorsModal(true);
    } else {
      addVotingPower('');
      setShowConfirmation(true);
    }
  }

  function handleWalletWithAgentClick() {
    if (!isConnected) {
      setShowConnectorsModal(true);
    } else {
      setShowAddressField(true);
    }
  }

  return (
    <div>
      {showConnectorsModal && (
        <ConnectorsModal
          open
          registering
          closeModal={({ openVoteModal }) => {
            openVoteModalRef.current = openVoteModal;
            setShowConnectorsModal(false);
          }}
        />
      )}
      <ActionArea>
        {!showAddressField && !showConfirmation && (
          <RegisterButtonContainer>
            <ModalButton disabled={loading} onClick={handleWalletConnect}>
              {loading ? (
                <Loading size={20} />
              ) : (
                t('modals.register.buttons.wallet')
              )}
            </ModalButton>
            <Tooltip
              title={t('modals.register.buttons.walletWithAgentTooltip')}
            >
              <ModalButton
                disabled={loading}
                onClick={handleWalletWithAgentClick}
              >
                {t('modals.register.buttons.walletWithAgent')}
              </ModalButton>
            </Tooltip>
            <ModalButton onClick={() => setShowMultisigRegister(true)}>
              {t('modals.register.buttons.multisig')}
            </ModalButton>
            <ModalButton onClick={() => setShowMinerRegister(true)}>
              {t('modals.register.buttons.miner')}
            </ModalButton>
          </RegisterButtonContainer>
        )}
        {showAddressField && (
          <RegisterAgent
            loading={loading}
            agentAddress={agentAddress}
            setAgentAddress={setAgentAddress}
            addVotingPower={addVotingPower}
            setShowAddressField={setShowAddressField}
            setShowConfirmation={setShowConfirmation}
          />
        )}
        {showConfirmation && (
          <RegisterConfirmation
            closeModal={() => {
              closeModal({ openVoteModal: openVoteModalRef.current });
            }}
            agentAddress={agentAddress}
            minerIds={minerIds}
            rawBytePower={rawBytePower}
            tokenPower={tokenPower}
            setHasRegistered={setHasRegistered}
            setShowConfirmation={setShowConfirmation}
          />
        )}
      </ActionArea>
      {errorMessage && <ErrorMessage>Error: {errorMessage}</ErrorMessage>}
    </div>
  );
}

export default Register;
