import React from 'react';
import { Dialog, DialogTitle, DialogContent } from '@mui/material';

import VoteFactory from './VoteFactory';
import type { Address } from './Home';

function VoteFactoryModal({
  address,
  open,
  closeModal,
}: {
  address: Address;
  open: boolean;
  closeModal: () => void;
}) {
  return (
    <Dialog open={open} onClose={closeModal} fullWidth maxWidth='sm'>
      <DialogTitle>Create Vote</DialogTitle>
      <DialogContent dividers>
        <VoteFactory address={address} closeModal={closeModal} />
      </DialogContent>
    </Dialog>
  );
}

export default VoteFactoryModal;
