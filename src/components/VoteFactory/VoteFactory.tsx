import React from 'react';
import { Dialog, DialogTitle, DialogContent } from '@mui/material';

import VoteFactoryForm from './VoteFactoryForm';

function VoteFactory({
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
      <DialogTitle>Create Vote</DialogTitle>
      <DialogContent dividers>
        <VoteFactoryForm closeModal={closeModal} />
      </DialogContent>
    </Dialog>
  );
}

export default VoteFactory;
