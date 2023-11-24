import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { DialogActions, FormControl, TextField, Tooltip } from '@mui/material';
import { encodeFunctionData, Address, getAddress } from 'viem';
import axios from 'axios';

import CodeSnippet from 'common/CodeSnippet';
import ErrorMessage from 'common/ErrorMessage';
import { voteFactoryConfig } from 'constants/voteFactoryConfig';
import { ZERO_ADDRESS } from 'utilities/helpers';

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const FormWithSpace = styled(FormControl)`
  gap: 12px;
`;

function ManualMinerRegisterForm({ closeModal }: { closeModal: () => void }) {
  const [errorMessage, setErrorMessage] = useState<string>();
  const [factoryFilAddress, setFactoryFilAddress] = useState<string>('');
  const [voterInput, setVoterInput] = useState<string>(ZERO_ADDRESS);
  const [voterAddress, setVoterAddress] = useState<Address>(ZERO_ADDRESS);
  const [minerId, setMinerId] = useState<bigint>(BigInt(0));
  const [minerIdInput, setMinerIdInput] = useState<string>('0');
  const [inputError, setInputError] = useState<boolean>(false);

  const CODE =
    ` evm invoke ` +
    factoryFilAddress +
    ` ` +
    encodeFunctionData({
      abi: voteFactoryConfig.abi,
      functionName: 'addMiner',
      args: [voterAddress, minerId],
    }).slice(2);

  useEffect(() => {
    async function getAddress() {
      try {
        const address = await axios.get(
          `https://filfox.info/api/v1/address/${voteFactoryConfig.address}`,
        );
        setFactoryFilAddress(address.data.address);
      } catch (error: any) {
        setErrorMessage(error.message);
      }
    }

    getAddress();
  }, []);

  return (
    <>
      <Form>
        <p>
          You can manually add miners to a registered voter by running a command
          on your miner. Register as a voter using this site, and then insert
          your ETH wallet address into this form.
        </p>
        <FormWithSpace fullWidth>
          <Tooltip
            title='Wallet Address you registered to vote with.'
            placement='top'
          >
            <TextField
              id='outlined-controlled'
              label='Voter Address'
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
          </Tooltip>
          <Tooltip
            title='Your Miner ID without the ‘f’ character. For example, if your miner id is f12345, you would input 1234.'
            placement='top'
          >
            <TextField
              id='outlined-controlled'
              label='Miner ID'
              value={minerIdInput}
              error={inputError}
              helperText={inputError ? 'Invalid Miner ID' : ''}
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
          </Tooltip>
        </FormWithSpace>
        <CodeSnippet code={CODE} showOptions={true} />
        <DialogActions>
          <button onClick={closeModal}>Okay</button>
        </DialogActions>
      </Form>
      {errorMessage && <ErrorMessage message={errorMessage} />}
    </>
  );
}

export default ManualMinerRegisterForm;
