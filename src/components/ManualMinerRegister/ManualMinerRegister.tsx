import React from 'react';
import { Dialog, DialogTitle, DialogContent } from '@mui/material';
import ManualMinerRegisterForm from './ManualMinerRegisterForm';

function ManualMinerRegisterModal({
  open,
  closeModal,
}: {
  open: boolean;
  closeModal: () => void;
}) {
  return (
    <Dialog open={open} onClose={closeModal} fullWidth maxWidth='sm'>
      <DialogTitle>Manual Miner Registration</DialogTitle>
      <DialogContent dividers>
        <ManualMinerRegisterForm closeModal={closeModal} />
      </DialogContent>
    </Dialog>
  );
}

export default ManualMinerRegisterModal;
