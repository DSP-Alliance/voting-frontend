import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import styled from 'styled-components';
import {
  DialogActions,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  TextField,
} from '@mui/material';
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
  color: var(--rederror);
`;

function VoteFactory({ closeModal }: { closeModal: () => void }) {
  const [allLsdTokens, setAllLsdTokens] = useState<Address[]>([]);

  const { control, getValues, setValue, trigger, watch } = useForm({
    mode: 'onTouched',
    defaultValues: {
      fipNum: '',
      length: '',
      doubleYesOption: 'false',
      [`lsdToken${allLsdTokens.length + 1}`]:
        '0x3C3501E6c353DbaEDDFA90376975Ce7aCe4Ac7a8',
    },
  });

  const { data, error, isError, write } = useContractWrite({
    address: voteFactoryConfig.address,
    abi: voteFactoryConfig.abi,
    functionName: 'startVote',
    args: [
      parseInt(watch('length')) * 60,
      parseInt(watch('fipNum')),
      watch('doubleYesOption') === 'true' ? true : false,
      watch(`lsdToken${allLsdTokens.length + 1}`)
        ? [
            ...allLsdTokens,
            watch(`lsdToken${allLsdTokens.length + 1}`) as Address,
          ]
        : allLsdTokens,
    ],
  });

  const { isLoading, isSuccess } = useWaitForTransaction({
    hash: data?.hash,
  });

  function onSubmit(e: React.MouseEvent) {
    e.preventDefault();

    trigger();
    write?.();

    isSuccess && closeModal();
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
        <FormControl>
          <FormLabel>Double yes option?</FormLabel>
          <Controller
            rules={{ required: 'Required' }}
            name='doubleYesOption'
            control={control}
            render={({ field: { onChange, value } }) => (
              <RadioGroup row value={value || 'false'} onChange={onChange}>
                <FormControlLabel
                  value={'true'}
                  label={'Yes'}
                  control={<Radio />}
                />
                <FormControlLabel
                  value={'false'}
                  label={'No'}
                  control={<Radio />}
                />
              </RadioGroup>
            )}
          />
        </FormControl>
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
          <button type='submit' disabled={isLoading} onClick={onSubmit}>
            Start Vote
          </button>
        </DialogActions>
      </Form>
      {isError && <ErrorMessage>Error: {error?.message}</ErrorMessage>}
    </>
  );
}

export default VoteFactory;
