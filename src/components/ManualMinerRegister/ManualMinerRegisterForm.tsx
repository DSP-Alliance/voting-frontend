import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { DialogActions, FormControl, TextField, Tooltip } from '@mui/material';
import { encodeFunctionData, Address, getAddress } from 'viem';
import axios from 'axios';
import { useTranslation } from 'react-i18next';

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
  const { t } = useTranslation();
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

  const i18nKey = 'modals.manualMinerRegister.form';

  return (
    <>
      <Form>
        <p>{t(`${i18nKey}.header`)}</p>
        <FormWithSpace fullWidth>
          <Tooltip title={t(`${i18nKey}.voteAddress.tooltip`)} placement='top'>
            <TextField
              id='outlined-controlled'
              label={t(`${i18nKey}.voteAddress.label`)}
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
          <Tooltip title={t(`${i18nKey}.minerID.tooltip`)} placement='top'>
            <TextField
              id='outlined-controlled'
              label={t(`${i18nKey}.minerID.label`)}
              value={minerIdInput}
              error={inputError}
              helperText={inputError ? t(`${i18nKey}.minerID.invalid`) : ''}
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
          <button onClick={closeModal}>{t(`${i18nKey}.closeButton`)}</button>
        </DialogActions>
      </Form>
      {errorMessage && <ErrorMessage message={errorMessage} />}
    </>
  );
}

export default ManualMinerRegisterForm;
