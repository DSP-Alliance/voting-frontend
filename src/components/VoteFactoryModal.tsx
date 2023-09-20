import React from 'react';
import { Dialog, DialogTitle, DialogContent } from '@mui/material';
import styled from 'styled-components';

import VoteFactory from './VoteFactory';
import type { Address } from './Home';

const CustomDialog = styled(Dialog)`
  [class*='MuiPaper-root'] {
    background-color: var(--portal2023-cream);
  }
`;

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
    <CustomDialog open={open} onClose={closeModal} fullWidth maxWidth='sm'>
      <DialogTitle>Create Vote</DialogTitle>
      <DialogContent dividers>
        <VoteFactory address={address} closeModal={closeModal} />
      </DialogContent>
    </CustomDialog>
  );
}

export default VoteFactoryModal;
