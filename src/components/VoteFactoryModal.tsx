import React from 'react';
import { Dialog, DialogTitle, DialogContent } from '@mui/material';

import VoteFactory from './VoteFactory';

function VoteFactoryModal({
  open,
  closeModal,
  getFipData,
}: {
  open: boolean;
  closeModal: () => void;
  getFipData: () => void;
}) {
  return (
    <Dialog open={open} onClose={closeModal} fullWidth maxWidth='sm'>
      <DialogTitle>Create Vote</DialogTitle>
      <DialogContent dividers>
        <VoteFactory closeModal={closeModal} getFipData={getFipData} />
      </DialogContent>
    </Dialog>
  );
}

export default VoteFactoryModal;
