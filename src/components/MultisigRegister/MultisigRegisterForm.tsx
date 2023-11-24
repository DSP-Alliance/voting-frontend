import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { DialogActions, FormControl, TextField, Tooltip } from '@mui/material';
import { encodeFunctionData } from 'viem';
import axios from 'axios';

import { voteFactoryConfig } from 'constants/voteFactoryConfig';
import { ZERO_ADDRESS, cbor_encode } from 'utilities/helpers';
import CodeSnippet from 'common/CodeSnippet';
import ErrorMessage from 'common/ErrorMessage';

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const FormWithSpace = styled(FormControl)`
  gap: 12px;
`;

function MultisigRegisterForm({ closeModal }: { closeModal: () => void }) {
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [factoryFilAddress, setFactoryFilAddress] = useState<string>('');
  const [msigAddress, setMsigAddress] = useState<string>('');
  const [txId, setTxId] = useState<string>('');
  const [proposerAddress, setProposerAddress] = useState<string>('');

  useEffect(() => {
    async function getAddresses() {
      try {
        const addressResponse = await axios.get(
          `https://filfox.info/api/v1/address/${voteFactoryConfig.address}`,
        );
        setFactoryFilAddress(addressResponse.data.address);
      } catch (error: any) {
        setErrorMessage(error.message);
      }
    }

    getAddresses();
  }, []);

  return (
    <>
      <Form>
        <p>
          In order to use a multisignature wallet as a voter, you must propose a
          new transaction in order to register as a voter.
        </p>
        <p>1) Create the registration proposal</p>
        <FormControl fullWidth>
          <Tooltip
            title='Input the multisig address you wish to register to vote with.'
            placement='top'
          >
            <TextField
              id='outlined-controlled'
              label='Multisig Address'
              value={msigAddress}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                setMsigAddress(event.target.value);
              }}
            />
          </Tooltip>
        </FormControl>
        <CodeSnippet
          code={
            `lotus msig propose ${msigAddress} ${factoryFilAddress} 0 3844450837 ` +
            cbor_encode(
              encodeFunctionData({
                abi: voteFactoryConfig.abi,
                functionName: 'register',
                args: [ZERO_ADDRESS, []],
              }),
            )
          }
        />
        <p>
          Depending on your multisig approval threshold, N of M signers must run
          the approval command.
        </p>
        <p>2) Approve the registration proposal with signers</p>
        <FormWithSpace fullWidth>
          <Tooltip
            title='This will be displayed in the lotus cli after the proposal command was used and the transaction has completed.'
            placement='top'
          >
            <TextField
              id='outlined-controlled'
              label='Transaction ID'
              value={txId}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                setTxId(event.target.value);
              }}
            />
          </Tooltip>
          <Tooltip
            title='The address that sent the proposal on behalf of the multisig.'
            placement='top'
          >
            <TextField
              id='outlined-controlled'
              label='Proposer Address'
              value={proposerAddress}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                setProposerAddress(event.target.value);
              }}
            />
          </Tooltip>
        </FormWithSpace>
        <CodeSnippet
          code={
            `lotus msig approve ${msigAddress} ${txId} ${proposerAddress} ${factoryFilAddress} 0 3844450837 ` +
            cbor_encode(
              encodeFunctionData({
                abi: voteFactoryConfig.abi,
                functionName: 'register',
                args: [ZERO_ADDRESS, []],
              }),
            )
          }
        />
        <DialogActions>
          <button onClick={closeModal}>Okay</button>
        </DialogActions>
      </Form>
      {errorMessage && <ErrorMessage message={errorMessage} />}
    </>
  );
}

export default MultisigRegisterForm;
