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
import {
  usePrepareContractWrite,
  useContractWrite,
  useWaitForTransaction,
} from 'wagmi';

import { voteFactoryConfig } from 'constants/voteFactoryConfig';
import useDebounce from 'utilities/useDebounce';
import type { Address } from './Home';

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const CustomTextField = styled(TextField)`
  & label.Mui-focused {
    color: var(--portal2023-green);
  }
  & .MuiOutlinedInput-root {
    & fieldset {
      border-color: black;
    }
    &:hover fieldset {
      border-color: var(--portal2023-green);
    }
    &.Mui-focused fieldset {
      border-color: var(--portal2023-green);
    }
  }
`;

const CustomFormLabel = styled(FormLabel)`
  &[class*='MuiFormLabel-root'].Mui-focused {
    color: var(--portal2023-green);
  }
`;

const CustomRadioButton = styled(Radio)`
  &[class*='MuiRadio-root'].Mui-checked {
    color: var(--portal2023-green);
  }
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
  background-color: var(--portal2023-cream);
  border: none;
  cursor: pointer;
`;

const ErrorMessage = styled.div`
  color: var(--portal2023-rederror);
`;

function VoteFactory({ closeModal }: { closeModal: () => void }) {
  const [allLsdTokens, setAllLsdTokens] = useState<Address[]>([]);

  const { control, getValues, setValue, trigger, watch } = useForm({
    mode: 'onTouched',
  });

  const debouncedFipNum = useDebounce(getValues('fipNum'), 500);
  const debouncedLength = useDebounce(getValues('length'), 500);
  const debouncedLsdTokens = useDebounce(
    getValues(`lsdToken${allLsdTokens.length + 1}`),
    500,
  );

  const {
    config,
    error: prepareError,
    isError: isPrepareError,
  } = usePrepareContractWrite({
    address: voteFactoryConfig.address,
    abi: voteFactoryConfig.abi,
    functionName: 'startVote',
    args: [
      parseInt(debouncedLength) * 60,
      parseInt(debouncedFipNum),
      watch('doubleYesOption') === 'true' ? true : false,
      debouncedLsdTokens ? [...allLsdTokens, debouncedLsdTokens] : allLsdTokens,
    ],
    enabled:
      Boolean(debouncedLength) &&
      Boolean(debouncedFipNum) &&
      allLsdTokens.length > 0,
  });

  const { data, error, isError, write } = useContractWrite(config);

  const { isLoading, isSuccess } = useWaitForTransaction({
    hash: data?.hash,
  });

  function onSubmit(e: React.MouseEvent) {
    e.preventDefault();

    trigger();
    write?.();

    // isSuccess && closeModal();
  }

  function renderAllLsdTokens() {
    return allLsdTokens.map((token, i) => {
      return (
        <Controller
          key={i}
          name={`lsdToken${i}`}
          control={control}
          render={({ field }) => (
            <CustomTextField
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
            <CustomTextField
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
            <CustomTextField
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
          <CustomFormLabel>Double yes option?</CustomFormLabel>
          <Controller
            rules={{ required: 'Required' }}
            name='doubleYesOption'
            control={control}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <RadioGroup row value={value || 'false'} onChange={onChange}>
                <FormControlLabel
                  value={'true'}
                  label={'Yes'}
                  control={<CustomRadioButton />}
                />
                <FormControlLabel
                  value={'false'}
                  label={'No'}
                  control={<CustomRadioButton />}
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
              <CustomTextField
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
      {/* {errorMessage && <ErrorMessage>Error: {errorMessage}</ErrorMessage>} */}
      {(isPrepareError || isError) && (
        <ErrorMessage>Error: {(prepareError || error)?.message}</ErrorMessage>
      )}
    </>
  );
}

export default VoteFactory;
