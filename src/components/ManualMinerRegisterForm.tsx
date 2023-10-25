import React, {useEffect, useState} from 'react';
import styled from 'styled-components';
import { DialogActions, Select, InputLabel, FormControl, MenuItem, TextField } from '@mui/material';
import { encodeFunctionData, Address, getAddress } from 'viem';
import { voteFactoryConfig } from 'constants/voteFactoryConfig';
import { ZERO_ADDRESS, cbor_encode } from 'utilities/helpers';
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

function ManualMinerRegisterForm({
  closeModal,
}: {
  closeModal: () => void;
}) {
  const [factoryFilAddress, setFactoryFilAddress] = useState<string>("");
  const [voterInput, setVoterInput] = useState<string>(ZERO_ADDRESS);
  const [voterAddress, setVoterAddress] = useState<Address>(ZERO_ADDRESS);
  const [minerId, setMinerId] = useState<bigint>(BigInt(0));
  const [minerIdInput, setMinerIdInput] = useState<string>("0");
  const [inputError, setInputError] = useState<boolean>(false);

  useEffect(() => {
    axios.get(
      `https://filfox.info/api/v1/address/${voteFactoryConfig.address}`,
    ).then((response) => {
      setFactoryFilAddress(response.data.address)
    })
  });

  return (
    <>
      <Form>
        <p>You can manually add miners to a registered voter by running a command on your miner. Register as a voter using this site, and then insert your ETH wallet address into this form.</p>
        <FormControl fullWidth>
          <TextField
            id="outlined-controlled"
            label="Voter Address"
            value={voterInput}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              try {
                setVoterAddress(getAddress(event.target.value));
                setVoterInput(event.target.value);
              } catch {
                setVoterInput(event.target.value);
              }
            }}
          />
          <TextField
            id="outlined-controlled"
            label="Miner ID"
            value={minerIdInput}
            error={inputError}
            helperText={inputError ? "Invalid Miner ID" : ""}
            inputProps={{ inputMode: 'text', pattern: '[0-9]*' }}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              try {
                setMinerId(BigInt(event.target.value));
                setMinerIdInput(event.target.value);
                setInputError(false);
              } catch {
                setMinerIdInput(event.target.value);
                setInputError(true);
              }
            }}
          />
        </FormControl>
        {/* Stylize this command */}
        <Code>
          {`lotus send --method 3844450837 --params-hex`} {cbor_encode(encodeFunctionData({abi: voteFactoryConfig.abi, functionName: 'addMiner', args: [voterAddress, minerId]}))} {factoryFilAddress} 0
        </Code>
        <DialogActions>
          <button onClick={closeModal}>Okay</button>
        </DialogActions>
      </Form>
    </>
  );
}

export default ManualMinerRegisterForm;
