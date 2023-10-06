import React from 'react';
import { Dialog, DialogTitle, DialogContent } from '@mui/material';

import VoteFactory from './VoteFactory';

function VoteFactoryModal({
  open,
  closeModal,
  getFipData,
  initialVotesLength,
  setLastFipNum,
}: {
  open: boolean;
  closeModal: () => void;
  getFipData: () => void;
  initialVotesLength: number;
  setLastFipNum: React.Dispatch<React.SetStateAction<number | undefined>>;
}) {
  return (
    <Dialog open={open} onClose={closeModal} fullWidth maxWidth='sm'>
      <DialogTitle>Create Vote</DialogTitle>
      <DialogContent dividers>
        <VoteFactory
          closeModal={closeModal}
          getFipData={getFipData}
          initialVotesLength={initialVotesLength}
          setLastFipNum={setLastFipNum}
        />
      </DialogContent>
    </Dialog>
  );
}

export default VoteFactoryModal;
