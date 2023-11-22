import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import {
  DialogActions,
  Select,
  InputLabel,
  FormControl,
  MenuItem,
  TextField,
} from '@mui/material';
import { encodeFunctionData } from 'viem';
import axios from 'axios';

import { voteTrackerConfig } from 'constants/voteTrackerConfig';
import { voteFactoryConfig } from 'constants/voteFactoryConfig';
import { ZERO_ADDRESS, cbor_encode } from 'utilities/helpers';
import CodeSnippet from 'common/CodeSnippet';
import ErrorMessage from 'common/ErrorMessage';
import { useFipDataContext } from 'common/FipDataContext';

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
  const [vote, setVote] = useState<number | string>(0);
  const [factoryFilAddress, setFactoryFilAddress] = useState<string>('');
  const [voteFilAddress, setVoteFilAddress] = useState<string>('');
  const [msigAddress, setMsigAddress] = useState<string>('');
  const [txId, setTxId] = useState<string>('');
  const [proposerAddress, setProposerAddress] = useState<string>('');

  const { lastFipAddress: currentVoteAddress } = useFipDataContext();

  useEffect(() => {
    async function getAddresses() {
      try {
        const addressResponse = await axios.get(
          `https://filfox.info/api/v1/address/${voteFactoryConfig.address}`,
        );
        setFactoryFilAddress(addressResponse.data.address);

        const voteAddress = await axios.get(
          `https://filfox.info/api/v1/address/${currentVoteAddress}`,
        );
        setVoteFilAddress(voteAddress.data.address);
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
          <TextField
            id='outlined-controlled'
            label='Multisig Address'
            value={msigAddress}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              setMsigAddress(event.target.value);
            }}
          />
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
          <TextField
            id='outlined-controlled'
            label='Transaction ID'
            value={txId}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              setTxId(event.target.value);
            }}
          />
          <TextField
            id='outlined-controlled'
            label='Proposer Address'
            value={proposerAddress}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              setProposerAddress(event.target.value);
            }}
          />
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
        <p>
          After proposing and approving the registration transaction, propose
          and approve another transaction. Use this form to generate the call
          data to include in your proposal.
        </p>
        <p>3) Create the vote proposal</p>
        <FormControl fullWidth>
          <InputLabel id='demo-simple-select-label'>Vote</InputLabel>
          <Select
            labelId='demo-simple-select-label'
            id='demo-simple-select'
            value={vote}
            label='Vote'
            onChange={(e) => {
              setVote(e.target.value);
            }}
          >
            <MenuItem value={0}>Yes</MenuItem>
            <MenuItem value={3}>Yes 2</MenuItem>
            <MenuItem value={1}>No</MenuItem>
            <MenuItem value={2}>Abstain</MenuItem>
          </Select>
        </FormControl>
        <CodeSnippet
          code={
            `lotus msig propose ${msigAddress} ${voteFilAddress} 0 3844450837 ` +
            cbor_encode(
              encodeFunctionData({
                abi: voteTrackerConfig.abi,
                functionName: 'castVote',
                args: [BigInt(vote)],
              }),
            )
          }
        />
        <p>
          Once the proposer creates the proposal using the command above, N of M
          signers must also approve the vote proposal.
        </p>
        <p>4) Approve the vote proposal</p>
        <FormWithSpace fullWidth>
          <TextField
            id='outlined-controlled'
            label='Transaction ID'
            value={txId}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              setTxId(event.target.value);
            }}
          />
          <TextField
            id='outlined-controlled'
            label='Proposer Address'
            value={proposerAddress}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              setProposerAddress(event.target.value);
            }}
          />
        </FormWithSpace>
        <CodeSnippet
          code={
            `lotus msig approve ${msigAddress} ${txId} ${proposerAddress} ${voteFilAddress} 0 3844450837 ` +
            cbor_encode(
              encodeFunctionData({
                abi: voteTrackerConfig.abi,
                functionName: 'castVote',
                args: [BigInt(vote)],
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
