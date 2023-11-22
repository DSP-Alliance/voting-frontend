import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import styled from 'styled-components';
import dayjs, { Dayjs } from 'dayjs';
import { DialogActions, TextField } from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { useContractWrite, useWaitForTransaction } from 'wagmi';
import ClipLoader from 'react-spinners/ClipLoader';

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
  const [allLsdTokens, setAllLsdTokens] = useState<Address[]>([]);
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
    },
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

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Form>
        <Controller
          name='fipNum'
          control={control}
          rules={{ required: 'Required' }}
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <TextField
              required
              type='number'
              helperText={error ? 'Enter the FIP number' : null}
              error={!!error}
              onChange={onChange}
              onBlur={() => trigger('fipNum')}
              value={value || ''}
              fullWidth
              label='FIP Number'
              variant='outlined'
            />
          )}
        />
        <DateTimePicker
          label='End Date for the vote'
          value={endDate}
          onChange={(newValue) => setEndDate(newValue)}
          minDateTime={today}
        />
        <Controller
          name='question'
          control={control}
          rules={{ required: 'Required' }}
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <TextField
              required
              type='text'
              helperText={error ? 'Enter the question to ask' : null}
              size='small'
              error={!!error}
              onChange={onChange}
              onBlur={() => trigger('question')}
              value={value || ''}
              fullWidth
              label='Question'
              variant='outlined'
            />
          )}
        />
        <Controller
          name='yesOptionOne'
          control={control}
          rules={{ required: 'Required' }}
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <TextField
              required
              type='text'
              helperText={error ? 'Enter the text for the yes option' : null}
              error={!!error}
              onChange={onChange}
              onBlur={() => trigger('yesOptionOne')}
              value={value || ''}
              fullWidth
              label='Yes Option 1'
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
              label='Yes Option 2 (optional)'
              variant='outlined'
            />
          )}
        />
        <LsdTokensContainer>
          {renderAllLsdTokens()}
          <Controller
            name={`lsdToken${allLsdTokens.length + 1}`}
            control={control}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <TextField
                required
                placeholder='0x0000...0000'
                helperText={error ? 'Enter a token value' : null}
                error={!!error}
                value={value || ''}
                onChange={onChange}
                onBlur={() => trigger(`lsdToken${allLsdTokens.length + 1}`)}
                fullWidth
                label='LSD Token'
                variant='outlined'
                margin='dense'
              />
            )}
            {...(!allLsdTokens.length
              ? { rules: { required: 'Required' } }
              : {})}
          />
          <AddTokenButton
            onClick={addLsdTokenField}
            disabled={!watch(`lsdToken${allLsdTokens.length + 1}`)}
          >
            Add LSD Token
          </AddTokenButton>
        </LsdTokensContainer>
        <DialogActions>
          <button onClick={closeModal}>Cancel</button>
          {(isLoadingWrite || isLoadingWait || isCheckingForDeployed) && (
            <LoaderWithMargin color='var(--primary)' size='20px' />
          )}
          {!isLoadingWrite && !isLoadingWait && !isCheckingForDeployed && (
            <button type='submit' onClick={onSubmit}>
              Start Vote
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
