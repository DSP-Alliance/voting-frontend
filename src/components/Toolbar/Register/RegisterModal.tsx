import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import styled from 'styled-components';

import MultisigRegisterModal from 'components/MultisigRegister';
import ManualMinerRegisterModal from 'components/ManualMinerRegister';
import Register from './Register';
import ConnectorsModal from '../Wallet/ConnectorsModal';

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 12px;
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

function RegisterModal({
  open,
  closeModal,
  hasRegistered,
  setHasRegistered,
  rawBytePower,
  setRawBytePower,
  tokenPower,
  setTokenPower,
}: {
  open: boolean;
  closeModal: () => void;
  hasRegistered: boolean;
  setHasRegistered: React.Dispatch<React.SetStateAction<boolean>>;
  rawBytePower: bigint;
  setRawBytePower: React.Dispatch<React.SetStateAction<bigint>>;
  tokenPower: bigint;
  setTokenPower: React.Dispatch<React.SetStateAction<bigint>>;
}) {
  const [showConnectorsModal, setShowConnectorsModal] = useState(false);
  const [showMultisigRegister, setShowMultisigRegister] = useState(false);
  const [showMinerRegister, setShowMinerRegister] = useState(false);

  function renderRegisterStart() {
    return (
      <>
        <DialogContent dividers>
          Please choose how you want to register.
          <Register
            setShowMultisigRegister={setShowMultisigRegister}
            setHasRegistered={setHasRegistered}
            rawBytePower={rawBytePower}
            setRawBytePower={setRawBytePower}
            tokenPower={tokenPower}
            setTokenPower={setTokenPower}
            closeModal={closeModal}
          />
          {showConnectorsModal && (
            <ConnectorsModal
              open={true}
              closeModal={() => setShowConnectorsModal(false)}
            />
          )}
        </DialogContent>
      </>
    );
  }

  function renderFinishedRegister() {
    return (
      <>
        <DialogContent dividers>
          Your wallet is registered. Choose an option below.
          <ButtonContainer>
            <ModalButton onClick={() => setShowMultisigRegister(true)}>
              Register Multisig
            </ModalButton>
            <ModalButton onClick={() => setShowMinerRegister(true)}>
              Register Miner
            </ModalButton>
          </ButtonContainer>
        </DialogContent>
      </>
    );
  }

  return (
    <>
      <Dialog
        open={open}
        onClose={closeModal}
        fullWidth
        PaperProps={{
          style: {
            color: 'var(--font-color)',
          },
        }}
      >
        <DialogTitle>Register</DialogTitle>
        <IconButton
          aria-label='close'
          onClick={closeModal}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
          }}
        >
          <CloseIcon />
        </IconButton>
        {!hasRegistered && renderRegisterStart()}
        {hasRegistered && renderFinishedRegister()}
      </Dialog>
      {showMultisigRegister && (
        <MultisigRegisterModal
          open={showMultisigRegister}
          closeModal={() => setShowMultisigRegister(false)}
        />
      )}
      {showMinerRegister && (
        <ManualMinerRegisterModal
          open={showMinerRegister}
          closeModal={() => setShowMinerRegister(false)}
        />
      )}
    </>
  );
}

export default RegisterModal;
