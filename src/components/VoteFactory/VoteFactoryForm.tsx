import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import styled from 'styled-components';
import dayjs, { Dayjs } from 'dayjs';
import {
  DialogActions,
  TextField,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useContractWrite, useWaitForTransaction } from 'wagmi';
import ClipLoader from 'react-spinners/ClipLoader';
import { useTranslation } from 'react-i18next';

import { publicClient } from 'services/clients';
import { voteFactoryConfig } from 'constants/voteFactoryConfig';
import { useFipDataContext } from 'common/FipDataContext';
import ErrorMessage from 'common/ErrorMessage';
import type { Address } from 'components/Home';

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const LsdTokensContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const AddTokenButton = styled.button`
  width: 150px;
`;

const DeleteTokenButton = styled.button`
  background-color: transparent;
  cursor: pointer;
  color: var(--black);

  &:hover:enabled {
    background-color: transparent;
  }
`;

const LoaderWithMargin = styled(ClipLoader)`
  margin-left: 12px;
`;

const today = dayjs();

function VoteFactoryForm({ closeModal }: { closeModal: () => void }) {
  const { t } = useTranslation();
  const [allLsdTokens, setAllLsdTokens] = useState<Address[]>([
    '0x690908f7fa93afC040CFbD9fE1dDd2C2668Aa0e0', //GLIF
    '0xC5eA96Dd365983cfEc90E72b6A2daC9562f458Ba', //SFT Token
    '0x97AAe66a1D2a41eAC573397B7a5656a9cF3E5616', //rSPD Token
    '0x84B038DB0fCde4fae528108603C7376695dc217F', //HashKing
    '0x587A7eaE9b461ad724391Aa7195210e0547eD11d', //HashMix FIL
    '0xd0437765D1Dc0e2fA14E97d290F135eFdf1a8a9A', //Collectif DAO
    '0x60E1773636CF5E4A227d9AC24F20fEca034ee25A', //WFIL
  ]);
  const [errorMessage, setErrorMessage] = useState('');
  const [isCheckingForDeployed, setIsCheckingForDeployed] = useState(false);
  const [endDate, setEndDate] = React.useState<Dayjs | null>(null);

  const { getFipData, initialVotesLength } = useFipDataContext();

  const { control, getValues, setValue, trigger, watch } = useForm({
    mode: 'onTouched',
    defaultValues: {
      fipNum: '',
      length: '',
      yesOptionOne: '',
      yesOptionTwo: '',
      [`lsdToken${allLsdTokens.length + 1}`]:
        '0x3C3501E6c353DbaEDDFA90376975Ce7aCe4Ac7a8',
      question: '',
    } as Record<string, string>,
  });

  function getVoteLength() {
    if (!endDate) return 0;
    return endDate.diff(today, 'seconds');
  }

  const {
    data,
    error,
    isLoading: isLoadingWrite,
    write,
  } = useContractWrite({
    address: voteFactoryConfig.address,
    abi: voteFactoryConfig.abi,
    functionName: 'startVote',
    args: [
      getVoteLength(),
      parseInt(watch('fipNum')),
      [watch('yesOptionOne'), watch('yesOptionTwo')],
      watch(`lsdToken${allLsdTokens.length + 1}`)
        ? [
            ...allLsdTokens,
            watch(`lsdToken${allLsdTokens.length + 1}`) as Address,
          ]
        : allLsdTokens,
      watch('question'),
    ],
  });

  const { isLoading: isLoadingWait, isSuccess } = useWaitForTransaction({
    hash: data?.hash,
  });

  useEffect(() => {
    if (isSuccess) {
      setIsCheckingForDeployed(true);
      const interval = setInterval(async () => {
        try {
          const deployedCount: bigint = await publicClient.readContract({
            abi: voteFactoryConfig.abi,
            address: voteFactoryConfig.address,
            functionName: 'deployedVotesLength',
          });

          if (deployedCount && deployedCount > initialVotesLength) {
            getFipData();
            setIsCheckingForDeployed(false);
            closeModal();
          }
        } catch (error) {
          setErrorMessage(JSON.stringify(error));
        }
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isSuccess]); // eslint-disable-line react-hooks/exhaustive-deps

  function onSubmit(e: React.MouseEvent) {
    e.preventDefault();

    trigger();
    write?.();
  }

  function renderAllLsdTokens() {
    return allLsdTokens.map((token, i) => {
      return (
        <Controller
          key={i}
          name={`lsdToken${i}`}
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              value={token}
              fullWidth
              size='small'
              margin='dense'
              InputProps={{
                readOnly: true,
                endAdornment: (
                  <DeleteTokenButton
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setAllLsdTokens((prev) =>
                        prev.slice(0, i).concat(prev.slice(i + 1)),
                      );
                    }}
                  >
                    X
                  </DeleteTokenButton>
                ),
              }}
            />
          )}
        />
      );
    });
  }

  function addLsdTokenField(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();

    const currentLsdToken = getValues(`lsdToken${allLsdTokens.length + 1}`);

    setAllLsdTokens((prev) => [...prev, currentLsdToken as Address]);
    setValue(`lsdToken${allLsdTokens.length + 1}`, '');
  }
  const i18nKey = 'modals.voteFactory.form';

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Form>
        <Controller
          name='fipNum'
          control={control}
          rules={{ required: t('required') }}
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <TextField
              required
              type='number'
              helperText={error ? t(`${i18nKey}.fipNumber.invalid`) : null}
              error={!!error}
              onChange={onChange}
              onBlur={() => trigger('fipNum')}
              value={value || ''}
              fullWidth
              label={t(`${i18nKey}.fipNumber.label`)}
              variant='outlined'
            />
          )}
        />
        <DateTimePicker
          label={t(`${i18nKey}.endDate.label`)}
          value={endDate}
          onChange={(newValue) => setEndDate(newValue)}
          minDateTime={today}
        />
        <Controller
          name='question'
          control={control}
          rules={{ required: t('required') }}
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <TextField
              required
              type='text'
              helperText={error ? t(`${i18nKey}.question.invalid`) : null}
              size='small'
              error={!!error}
              onChange={onChange}
              onBlur={() => trigger('question')}
              value={value || ''}
              fullWidth
              label={t(`${i18nKey}.question.label`)}
              variant='outlined'
            />
          )}
        />
        <Controller
          name='yesOptionOne'
          control={control}
          rules={{ required: t('required') }}
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <TextField
              required
              type='text'
              helperText={error ? t(`${i18nKey}.yesOptionOne.invalid`) : null}
              error={!!error}
              onChange={onChange}
              onBlur={() => trigger('yesOptionOne')}
              value={value || ''}
              fullWidth
              label={t(`${i18nKey}.yesOptionOne.label`)}
              variant='outlined'
            />
          )}
        />
        <Controller
          name='yesOptionTwo'
          control={control}
          render={({ field: { onChange, value } }) => (
            <TextField
              type='text'
              onChange={onChange}
              onBlur={() => trigger('yesOptionTwo')}
              value={value || ''}
              fullWidth
              label={t(`${i18nKey}.yesOptionTwo.label`)}
              variant='outlined'
            />
          )}
        />
        <LsdTokensContainer>
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>LSD Tokens</Typography>
            </AccordionSummary>
            <AccordionDetails>
              {renderAllLsdTokens()}
              <Controller
                name={`lsdToken${allLsdTokens.length + 1}`}
                control={control}
                render={({
                  field: { onChange, value },
                  fieldState: { error },
                }) => (
                  <TextField
                    required
                    placeholder='0x0000...0000'
                    helperText={error ? t(`${i18nKey}.lsdToken.invalid`) : null}
                    error={!!error}
                    value={value || ''}
                    onChange={onChange}
                    onBlur={() => trigger(`lsdToken${allLsdTokens.length + 1}`)}
                    fullWidth
                    label={t(`${i18nKey}.lsdToken.label`)}
                    variant='outlined'
                    margin='dense'
                  />
                )}
                {...(!allLsdTokens.length
                  ? { rules: { required: t('required') } }
                  : {})}
              />
              <AddTokenButton
                onClick={addLsdTokenField}
                disabled={!watch(`lsdToken${allLsdTokens.length + 1}`)}
              >
                {t(`${i18nKey}.lsdToken.addButton`)}
              </AddTokenButton>
            </AccordionDetails>
          </Accordion>
        </LsdTokensContainer>
        <DialogActions>
          <button onClick={closeModal}>{t('cancel')}</button>
          {(isLoadingWrite || isLoadingWait || isCheckingForDeployed) && (
            <LoaderWithMargin color='var(--primary)' size='20px' />
          )}
          {!isLoadingWrite && !isLoadingWait && !isCheckingForDeployed && (
            <button type='submit' onClick={onSubmit}>
              {t('startVote')}
            </button>
          )}
        </DialogActions>
      </Form>
      {error && <ErrorMessage message={error.message} />}
      {errorMessage && <ErrorMessage message={errorMessage} />}
    </LocalizationProvider>
  );
}

export default VoteFactoryForm;
