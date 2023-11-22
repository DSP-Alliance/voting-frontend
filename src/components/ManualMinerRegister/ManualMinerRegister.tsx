import React from 'react';
import { Dialog, DialogTitle, DialogContent, IconButton } from '@mui/material';
import ManualMinerRegisterForm from './ManualMinerRegisterForm';
import CloseIcon from '@mui/icons-material/Close';

function ManualMinerRegisterModal({
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
      <DialogTitle>Manual Miner Registration</DialogTitle>
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
        <ManualMinerRegisterForm closeModal={closeModal} />
      </DialogContent>
    </Dialog>
  );
}

export default ManualMinerRegisterModal;
