import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import styled from 'styled-components';

import MultisigRegisterModal from 'components/MultisigRegister';
import ManualMinerRegisterModal from 'components/ManualMinerRegister';
import Register from './Register';
import ConnectorsModal from '../Wallet/ConnectorsModal';

const MultisigRegisterButton = styled.button`
  grid-column-start: 2;
  width: 120px;
  justify-self: center;
`;

function RegisterModal({
  open,
  closeModal,
  hasRegistered,
  setHasRegistered,
}: {
  open: boolean;
  closeModal: () => void;
  hasRegistered: boolean;
  setHasRegistered: React.Dispatch<React.SetStateAction<boolean>>;
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
          <MultisigRegisterButton onClick={() => setShowMultisigRegister(true)}>
            Register Multisig
          </MultisigRegisterButton>
          <MultisigRegisterButton onClick={() => setShowMinerRegister(true)}>
            Register Miner
          </MultisigRegisterButton>
        </DialogContent>
      </>
    );
  }

  return (
    <>
      <Dialog
        open={open}
        onClose={closeModal}
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
