import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import styled from 'styled-components';
import { DialogActions, TextField } from '@mui/material';
import { useContractWrite, useWaitForTransaction } from 'wagmi';

import { voteFactoryConfig } from 'constants/voteFactoryConfig';
import type { Address } from './Home';

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
  color: #000;

  &:hover:enabled {
    background-color: transparent;
  }
`;

const ErrorMessage = styled.div`
  color: var(--error);
  word-wrap: break-word;
`;

function VoteFactory({ closeModal }: { closeModal: () => void }) {
  const [allLsdTokens, setAllLsdTokens] = useState<Address[]>([]);
  const [disableButton, setDisableButton] = useState(false);

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

  const { data, error, isError, write } = useContractWrite({
    address: voteFactoryConfig.address,
    abi: voteFactoryConfig.abi,
    functionName: 'startVote',
    args: [
      parseInt(watch('length')) * 60,
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

  const { isLoading, isSuccess } = useWaitForTransaction({
    hash: data?.hash,
  });

  useEffect(() => {
    if (isSuccess) closeModal();
  }, [isSuccess]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (isError) setDisableButton(false);
  }, [isError]);

  function onSubmit(e: React.MouseEvent) {
    setDisableButton(true);
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
    <>
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
              size='small'
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
        <Controller
          name='length'
          control={control}
          rules={{ required: 'Required' }}
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <TextField
              required
              type='number'
              helperText={error ? 'Enter an amount' : null}
              size='small'
              error={!!error}
              onChange={onChange}
              value={value || ''}
              onBlur={() => trigger('length')}
              fullWidth
              label='Length of vote time (in minutes)'
              variant='outlined'
            />
          )}
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
              size='small'
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
              size='small'
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
                size='small'
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
          <button
            type='submit'
            disabled={isLoading || disableButton}
            onClick={onSubmit}
          >
            Start Vote
          </button>
        </DialogActions>
      </Form>
      {isError && <ErrorMessage>Error: {error?.message}</ErrorMessage>}
    </>
  );
}

export default VoteFactory;
