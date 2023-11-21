import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent } from '@mui/material';
import styled from 'styled-components';

import MultisigRegisterModal from 'components/MultisigRegister';
import ManualMinerRegisterModal from 'components/ManualMinerRegister';

const MultisigRegisterButton = styled.button`
  grid-column-start: 2;
  width: 120px;
  justify-self: center;
`;

function RegisterModal({
  open,
  closeModal,
}: {
  open: boolean;
  closeModal: () => void;
}) {
  const [showMultisigRegister, setShowMultisigRegister] = useState(false);
  const [showMinerRegister, setShowMinerRegister] = useState(false);

  return (
    <>
      <Dialog open={open} onClose={closeModal}>
        <DialogTitle>Register</DialogTitle>
        <DialogContent dividers>
          Please choose how you want to register
          {/* <Register
            addVotingPower={addVotingPower}
            error={errorMessage}
            loading={loading}
            minerIds={minerIds}
            rawBytePower={rawBytePower}
            registering={registering}
            tokenPower={tokenPower}
            write={write}
          /> */}
          <MultisigRegisterButton onClick={() => setShowMultisigRegister(true)}>
            Register Multisig
          </MultisigRegisterButton>
          <MultisigRegisterButton onClick={() => setShowMinerRegister(true)}>
            Register Miner
          </MultisigRegisterButton>
        </DialogContent>
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
