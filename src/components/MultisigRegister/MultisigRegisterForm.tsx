import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { DialogActions, FormControl, TextField, Tooltip } from '@mui/material';
import { encodeFunctionData } from 'viem';
import axios from 'axios';
import { useTranslation } from 'react-i18next';

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

function MultisigRegisterForm({ closeModal }: { closeModal?: () => void }) {
  const { t } = useTranslation();
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

  const i18nKey = 'modals.multisigRegister.form';

  return (
    <>
      <Form>
        <p>{t(`${i18nKey}.header`)}</p>
        <p>{t(`${i18nKey}.step1`)}</p>
        <FormControl fullWidth>
          <Tooltip
            title={t(`${i18nKey}.multisigAddress.tooltip`)}
            placement='top'
          >
            <TextField
              id='outlined-controlled'
              label={t(`${i18nKey}.multisigAddress.label`)}
              value={msigAddress}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                setMsigAddress(event.target.value);
              }}
            />
          </Tooltip>
        </FormControl>
        <CodeSnippet
          code={
            `lotus msig propose ${msigAddress}${factoryFilAddress} 0 3844450837 ` +
            cbor_encode(
              encodeFunctionData({
                abi: voteFactoryConfig.abi,
                functionName: 'register',
                args: [ZERO_ADDRESS, []],
              }),
            )
          }
        />
        <p>{t(`${i18nKey}.subheader`)}</p>
        <p>{t(`${i18nKey}.step2`)}</p>
        <FormWithSpace fullWidth>
          <Tooltip
            title={t(`${i18nKey}.transactionID.tooltip`)}
            placement='top'
          >
            <TextField
              id='outlined-controlled'
              label={t(`${i18nKey}.transactionID.label`)}
              value={txId}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                setTxId(event.target.value);
              }}
            />
          </Tooltip>
          <Tooltip
            title={t(`${i18nKey}.proposerAddress.tooltip`)}
            placement='top'
          >
            <TextField
              id='outlined-controlled'
              label={t(`${i18nKey}.proposerAddress.label`)}
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
        {closeModal && (
          <DialogActions>
            <button onClick={closeModal}>{t(`${i18nKey}.closeButton`)}</button>
          </DialogActions>
        )}
      </Form>
      {errorMessage && <ErrorMessage message={errorMessage} />}
    </>
  );
}

export default MultisigRegisterForm;
