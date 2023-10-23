import React, {useEffect, useState} from 'react';
import styled from 'styled-components';
import { DialogActions, Select, InputLabel, FormControl, MenuItem, TextField } from '@mui/material';
import { encodeFunctionData } from 'viem';
import { voteTrackerConfig } from 'constants/voteTrackerConfig';
import { voteFactoryConfig } from 'constants/voteFactoryConfig';
import { ZERO_ADDRESS } from 'utilities/helpers';
import axios from 'axios';

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const Code = styled.p`
  white-space: pre-wrap;
  overflow-wrap: break-word;
  color: white;
  background-color: black;
`;

function MultisigRegisterForm({
  closeModal,
  currentVoteAddress,
}: {
  closeModal: () => void;
  currentVoteAddress: string;
}) {
  const [vote, setVote] = useState<number | string>(0);
  const [factoryFilAddress, setFactoryFilAddress] = useState<string>("");
  const [voteFilAddress, setVoteFilAddress] = useState<string>("");
  const [msigAddress, setMsigAddress] = useState<string>("");
  const [txId, setTxId] = useState<string>("");
  const [proposerAddress, setProposerAddress] = useState<string>("");

  useEffect(() => {
    axios.get(
      `https://filfox.info/api/v1/address/${voteFactoryConfig.address}`,
    ).then((response) => {
      setFactoryFilAddress(response.data.address)
    })

    axios.get(
      `https://filfox.info/api/v1/address/${currentVoteAddress}`,
    ).then((response) => {
      setVoteFilAddress(response.data.address)
    })
  });

  return (
    <>
      <Form>
        <p>In order to use a multisignature wallet as a voter, you must propose a new transaction in order to register as a voter.</p>
        <p>1) Create the registration proposal</p>
        <FormControl fullWidth>
          <TextField
            id="outlined-controlled"
            label="Multisig Address"
            value={msigAddress}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              setMsigAddress(event.target.value);
            }}
          />
        </FormControl>
        {/* Stylize this command */}
        <Code>
          {`lotus msig propose ${msigAddress} ${factoryFilAddress} 0 3844450837`} {encodeFunctionData({abi: voteFactoryConfig.abi, functionName: 'register', args: [ZERO_ADDRESS, []]}).slice(2)}
        </Code>
        <p>Depending on your multisig approval threshold, N of M signers must run the approval command.</p>
        <p>2) Approve the registration proposal with signers</p>
        <FormControl fullWidth>
          <TextField
            id="outlined-controlled"
            label="Transaction ID"
            value={txId}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              setTxId(event.target.value);
            }}
          />
          <TextField
            id="outlined-controlled"
            label="Proposer Address"
            value={proposerAddress}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              setProposerAddress(event.target.value);
            }}
          />
        </FormControl>
        {/* Stylize this command */}
        <Code>
          {`lotus msig approve ${msigAddress} ${txId} ${proposerAddress} ${factoryFilAddress} 0 3844450837 ${encodeFunctionData({abi: voteFactoryConfig.abi, functionName: 'register', args: [ZERO_ADDRESS, []]}).slice(2)}`}
        </Code>
        <p>After proposing and approving the registration transaction, propose and approve another transaction. Use this form to generate the call data to include in your proposal.</p>
        <p>3) Create the vote proposal</p>
        <FormControl fullWidth>
          <InputLabel id="demo-simple-select-label">Vote</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={vote}
            label="Vote"
            onChange={(e) => {setVote(e.target.value)}}
          >
            <MenuItem value={0}>Yes</MenuItem>
            <MenuItem value={3}>Yes 2</MenuItem>
            <MenuItem value={1}>No</MenuItem>
            <MenuItem value={2}>Abstain</MenuItem>
          </Select>
        </FormControl>
        {/* Stylize this command */}
        <Code>
          {`lotus msig propose ${msigAddress} ${voteFilAddress} 0 3844450837`} {encodeFunctionData({abi: voteTrackerConfig.abi, functionName: 'castVote', args: [BigInt(vote)]}).slice(2)}
        </Code>
        <p>Once the proposer creates the proposal using the command above, N of M signers must also approve the vote proposal.</p>
        <p>4) Approve the vote proposal</p>
        <FormControl fullWidth>
          <TextField
            id="outlined-controlled"
            label="Transaction ID"
            value={txId}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              setTxId(event.target.value);
            }}
          />
          <TextField
            id="outlined-controlled"
            label="Proposer Address"
            value={proposerAddress}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              setProposerAddress(event.target.value);
            }}
          />
        </FormControl>
        {/* Stylize this command */}
        <Code>
          {`lotus msig approve ${msigAddress} ${txId} ${proposerAddress} ${voteFilAddress} 0 3844450837 ${encodeFunctionData({abi: voteTrackerConfig.abi, functionName: 'castVote', args: [BigInt(vote)]}).slice(2)}`}
        </Code>
        <DialogActions>
          <button onClick={closeModal}>Okay</button>
        </DialogActions>
      </Form>
    </>
  );
}

export default MultisigRegisterForm;
