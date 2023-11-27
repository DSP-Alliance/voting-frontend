import React, { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';

import { voteFactoryConfig } from 'constants/voteFactoryConfig';
import { publicClient } from 'services/clients';
import ConnectorsModal from 'components/Toolbar/Wallet/ConnectorsModal';
import LatestVote from 'components/LatestVote';
import VoteHistory from 'components/VoteHistory';
import VoteFactoryModal from 'components/VoteFactory';
import RegisterModal from 'components/Toolbar/Register/RegisterModal';
import WalletMenu from 'components/Toolbar/Wallet/WalletMenu';
import { useVoteEndContext } from 'common/VoteEndContext';
import { ZERO_ADDRESS } from 'utilities/helpers';
import { useFipDataContext } from 'common/FipDataContext';
import { voteTrackerConfig } from 'constants/voteTrackerConfig';

export type Address = `0x${string}`;

const HomeContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
  border-bottom: 1px solid var(--divider);
  margin-bottom: 8px;
  padding: 24px;
  background-color: var(--bg-color);
  color: var(--primary);
`;

const HeaderText = styled.div`
  justify-self: center;
  font-family: var(--titlefontlight);
  font-size: 24px;
  font-weight: 600;
  text-transform: uppercase;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  height: 34px;
`;

const RegisterButton = styled.button`
  color: var(--primary);
  background-color: var(--white);
  border: 1px solid var(--primary);
  border-radius: 24px;
  padding: 0 12px;

  &:hover {
    color: var(--white);
  }
`;

const ConnectButton = styled.button`
  color: var(--white);
  background-color: var(--primary);
  border-radius: 24px;
  padding: 0 12px;
`;

const StartVoteButton = styled.button`
  grid-column-start: 2;
  width: 100px;
  justify-self: center;
`;

const VoteContent = styled.div`
  margin: 8px 24px;
  display: flex;
  flex-direction: column;
`;

function Home() {
  const { address, isConnected } = useAccount();
  const { t } = useTranslation();
  const [isOwner, setIsOwner] = useState(false);
  const [hasRegistered, setHasRegistered] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [showConnectors, setShowConnectors] = useState(false);
  const [showVoteFactory, setShowVoteFactory] = useState(false);
  const [showVoteModal, setShowVoteModal] = useState(false);
  const [failedToLoadFIP, setFailedToLoadFIP] = useState(false);
  const [loadingVotingPower, setLoadingVotingPower] = useState(false);
  const [rawBytePower, setRawBytePower] = useState<bigint>(BigInt(0));
  const [tokenPower, setTokenPower] = useState<bigint>(BigInt(0));

  const { voteEndTime } = useVoteEndContext();
  const { lastFipAddress } = useFipDataContext();

  useEffect(() => {
    async function getOwner() {
      try {
        const owner = await publicClient.readContract({
          abi: voteFactoryConfig.abi,
          address: voteFactoryConfig.address,
          functionName: 'starters',
          args: [address || '0x0000000000000000000000000000000000000000'],
        });

        if (owner) setIsOwner(true);
      } catch (error) {
        console.error(error);
      }
    }

    if (isConnected) getOwner();
    if (!isConnected) localStorage.removeItem('lastFipVoted');
  }, [isConnected]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    async function getHasRegistered() {
      try {
        const userHasRegistered = await publicClient.readContract({
          address: voteFactoryConfig.address,
          abi: voteFactoryConfig.abi,
          functionName: 'registered',
          args: [address || `0x`],
        });

        setHasRegistered(userHasRegistered);
      } catch {
        setHasRegistered(false);
      }
    }

    getHasRegistered();
  }, [address]);

  useEffect(() => {
    async function getByteAndTokenPower() {
      setLoadingVotingPower(true);
      try {
        const [tokenPower, bytePower, minerTokenPower] =
          await publicClient.readContract({
            address: lastFipAddress || ZERO_ADDRESS,
            abi: voteTrackerConfig.abi,
            functionName: 'getVotingPower',
            args: [address || ZERO_ADDRESS],
          });

        setRawBytePower(bytePower);
        setTokenPower(bytePower > 0 ? minerTokenPower : tokenPower);
      } catch (e) {
        console.error(e);
        setTokenPower(BigInt(0));
        setRawBytePower(BigInt(0));
      }

      setLoadingVotingPower(false);
    }

    getByteAndTokenPower();
  }, [address, lastFipAddress]);

  const lastVoteHasFinished = voteEndTime ? voteEndTime <= Date.now() : true;

  return (
    <>
      <HomeContainer>
        <Header>
          <HeaderText>{t('title')}</HeaderText>
          <ButtonContainer>
            {isOwner && (failedToLoadFIP || lastVoteHasFinished) && (
              <StartVoteButton onClick={() => setShowVoteFactory(true)}>
                {t('buttons.startVote')}
              </StartVoteButton>
            )}
            <RegisterButton onClick={() => setShowRegister(true)}>
              {t('buttons.register')}
            </RegisterButton>
            {!isConnected && (
              <ConnectButton onClick={() => setShowConnectors(true)}>
                {t('buttons.connect')}
              </ConnectButton>
            )}
            {isConnected && (
              <WalletMenu
                loadingVotingPower={loadingVotingPower}
                rawBytePower={rawBytePower}
                tokenPower={tokenPower}
              />
            )}
          </ButtonContainer>
        </Header>
        {showRegister && (
          <RegisterModal
            open={showRegister}
            closeModal={({ openVoteModal }) => {
              if (openVoteModal) setShowVoteModal(true);
              setShowRegister(false);
            }}
            hasRegistered={hasRegistered}
            setHasRegistered={setHasRegistered}
            rawBytePower={rawBytePower}
            setRawBytePower={setRawBytePower}
            tokenPower={tokenPower}
            setTokenPower={setTokenPower}
          />
        )}
        {showConnectors && (
          <ConnectorsModal
            registering={false}
            open={showConnectors}
            closeModal={({ openVoteModal }) => {
              if (openVoteModal) setShowVoteModal(true);
              setShowConnectors(false);
            }}
          />
        )}
        {showVoteFactory && (
          <VoteFactoryModal open closeModal={() => setShowVoteFactory(false)} />
        )}
        <VoteContent>
          <LatestVote
            hasRegistered={hasRegistered}
            showVoteModal={showVoteModal}
            setShowVoteModal={setShowVoteModal}
            setFailedToLoadFIP={setFailedToLoadFIP}
          />
          <VoteHistory />
        </VoteContent>
      </HomeContainer>
    </>
  );
}

export default Home;
