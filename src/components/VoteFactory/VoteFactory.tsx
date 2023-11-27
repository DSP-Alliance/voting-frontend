import React from 'react';
import { Dialog, DialogTitle, DialogContent } from '@mui/material';
import { useTranslation } from 'react-i18next';

import VoteFactoryForm from './VoteFactoryForm';

function VoteFactory({
  open,
  closeModal,
}: {
  open: boolean;
  closeModal: () => void;
}) {
  const { t } = useTranslation();
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
      <DialogTitle>{t('modals.voteFactory.title')}</DialogTitle>
      <DialogContent dividers>
        <VoteFactoryForm closeModal={closeModal} />
      </DialogContent>
    </Dialog>
  );
}

export default VoteFactory;
