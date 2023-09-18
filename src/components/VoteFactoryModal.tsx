import React from 'react';
import styled from 'styled-components';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  // DialogActions,
} from '@mui/material';

import VoteFactory from './VoteFactory';
import type { Address } from './Home';

const BackDrop = styled.aside`
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  overflow-y: auto;
  background-color: grey;
  opacity: 0.5;
`;

const Container = styled.div`
  position: relative;
  top: 15%;
  margin: auto;
  width: 90%;
  min-height: unset;
  max-height: 70vh;
  border-radius: 4px;
  box-shadow: none;
  background-color: var(--portal2023-tan);
  opacity: 1;

  @media screen and (min-width: 440px) {
    width: 90%;
  }

  @media screen and (min-width: 770px) {
    width: 700px;
  }
  padding-bottom: unset;
`;

const DefaultHeader = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 12px;
  border-bottom: 1px solid black;
  text-align: center;

  @media screen and (min-width: 440px) {
    padding: 0;
  }
`;

const HeaderText = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const Title = styled.h3`
  color: black;
  font-weight: bold;
`;

const CloseIcon = styled.div`
  cursor: pointer;
  color: black;
  font-size: 24px;

  svg {
    height: 24px;
  }
`;

const Content = styled.div`
  padding: 12px;

  @media screen and (min-width: 440px) {
    padding: 12px;
  }
`;

// const ModalContainer = styled.div`
//   background: #eee;
//   display: flex;
//   justify-content: center;
//   align-items: center;
// `;

// const Modal = styled.div`
//   width: 500px;
//   background: white;
//   border: 1px solid #ccc;
//   transition: 1.1s ease-out;
//   box-shadow: -2rem 2rem 2rem rgba(black, 0.2);
//   filter: blur(0);
//   transform: scale(1);
//   opacity: 1;
// `;

const CloseButton = styled.button`
  border: none;
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
    <Dialog open={open} onClose={closeModal} fullWidth maxWidth='sm'>
      <DialogTitle>Create Vote</DialogTitle>
      <DialogContent dividers>
        <VoteFactory address={address} closeModal={closeModal} />
      </DialogContent>
    </Dialog>
  );
}

export default VoteFactoryModal;
