import React from 'react';
import { Dialog, DialogTitle, DialogContent } from '@mui/material';
import MultisigRegisterForm from './MultisigRegisterForm';

function MultisigRegisterModal({
  open,
  closeModal,
}: {
  open: boolean;
  closeModal: () => void;
}) {
  return (
    <Dialog
      open={open}
      onClose={closeModal}
      fullWidth
      maxWidth='sm'
      PaperProps={{
        style: {
          color: 'var(--font-color)',
        },
      }}
    >
      <DialogTitle>Register Multisig</DialogTitle>
      <DialogContent dividers>
        <MultisigRegisterForm closeModal={closeModal} />
      </DialogContent>
    </Dialog>
  );
}

export default MultisigRegisterModal;
