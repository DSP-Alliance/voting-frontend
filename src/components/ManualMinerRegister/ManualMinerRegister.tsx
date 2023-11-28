import React from 'react';
import { Dialog, DialogTitle, DialogContent, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useTranslation } from 'react-i18next';
import ManualMinerRegisterForm from './ManualMinerRegisterForm';

function ManualMinerRegisterModal({
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
      <DialogTitle>{t('modal.manualMinerRegister.title')}</DialogTitle>
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
