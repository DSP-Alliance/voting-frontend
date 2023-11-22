import React from 'react';
import { Dialog, DialogTitle, DialogContent, IconButton } from '@mui/material';
import MultisigRegisterForm from './MultisigRegisterForm';
import CloseIcon from '@mui/icons-material/Close';

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
      <DialogContent dividers>
        <MultisigRegisterForm closeModal={closeModal} />
      </DialogContent>
    </Dialog>
  );
}

export default MultisigRegisterModal;
