import React from 'react';
import { Dialog, DialogTitle, DialogContent } from '@mui/material';
import MultisigRegisterForm from './MultisigRegisterForm';

function MultisigRegisterModal({
  open,
  closeModal,
  currentVoteAddress
}: {
  open: boolean;
  closeModal: () => void;
  currentVoteAddress: string;
}) {
  return (
    <Dialog open={open} onClose={closeModal} fullWidth maxWidth='sm'>
      <DialogTitle>Register Multisig</DialogTitle>
      <DialogContent dividers>
        <MultisigRegisterForm closeModal={closeModal} currentVoteAddress={currentVoteAddress} />
      </DialogContent>
    </Dialog>
  );
}

export default MultisigRegisterModal;
