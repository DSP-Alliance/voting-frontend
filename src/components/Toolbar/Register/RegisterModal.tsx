import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';

import RoundedButton from 'components/common/RoundedButton';
import MultisigRegisterModal from 'components/MultisigRegister';
import ManualMinerRegisterModal from 'components/ManualMinerRegister';
import Register from './Register';

const actionButtonWidth = '300px';

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 12px;
  gap: 8px;
`;

const ModalButton = styled.button`
  color: var(--primary);
  background-color: var(--white);
  border: 1px solid var(--primary);
  border-radius: 24px;
  padding: 8 24px;
  width: ${actionButtonWidth};

  &:hover {
    color: var(--white);
  }
`;

function RegisterModal({
  open,
  closeModal,
  hasRegistered,
  setHasRegistered,
  rawBytePower,
  setRawBytePower,
  tokenPower,
  setTokenPower,
}: {
  open: boolean;
  closeModal: ({ openVoteModal }: { openVoteModal: boolean }) => void;
  hasRegistered: boolean;
  setHasRegistered: React.Dispatch<React.SetStateAction<boolean>>;
  rawBytePower: bigint;
  setRawBytePower: React.Dispatch<React.SetStateAction<bigint>>;
  tokenPower: bigint;
  setTokenPower: React.Dispatch<React.SetStateAction<bigint>>;
}) {
  const [showMultisigRegister, setShowMultisigRegister] = useState(false);
  const [showMinerRegister, setShowMinerRegister] = useState(false);
  const { t } = useTranslation();

  function renderRegisterStart() {
    return (
      <>
        <DialogContent dividers>
          <Register
            setShowMultisigRegister={setShowMultisigRegister}
            setHasRegistered={setHasRegistered}
            rawBytePower={rawBytePower}
            setRawBytePower={setRawBytePower}
            tokenPower={tokenPower}
            setTokenPower={setTokenPower}
            closeModal={closeModal}
          />
        </DialogContent>
      </>
    );
  }

  function renderFinishedRegister() {
    return (
      <>
        <DialogContent dividers>
          {t('modals.register.finished.header')}
          <ButtonContainer>
            <RoundedButton
              onClick={() => closeModal({ openVoteModal: true })}
              width={actionButtonWidth}
            >
              {t('buttons.vote')}
            </RoundedButton>
            <ModalButton onClick={() => setShowMultisigRegister(true)}>
              {t('modals.register.buttons.multisig')}
            </ModalButton>
            <ModalButton onClick={() => setShowMinerRegister(true)}>
              {t('modals.register.buttons.miner')}
            </ModalButton>
          </ButtonContainer>
        </DialogContent>
      </>
    );
  }

  return (
    <>
      <Dialog
        open={open}
        onClose={closeModal}
        fullWidth
        PaperProps={{
          style: {
            color: 'var(--font-color)',
          },
        }}
      >
        <DialogTitle>{t('modals.register.title')}</DialogTitle>
        <IconButton
          aria-label='close'
          onClick={() => closeModal({ openVoteModal: false })}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
          }}
        >
          <CloseIcon />
        </IconButton>
        {!hasRegistered && renderRegisterStart()}
        {hasRegistered && renderFinishedRegister()}
      </Dialog>
      {showMultisigRegister && (
        <MultisigRegisterModal
          open={showMultisigRegister}
          closeModal={() => setShowMultisigRegister(false)}
        />
      )}
      {showMinerRegister && (
        <ManualMinerRegisterModal
          open={showMinerRegister}
          closeModal={() => setShowMinerRegister(false)}
        />
      )}
    </>
  );
}

export default RegisterModal;
