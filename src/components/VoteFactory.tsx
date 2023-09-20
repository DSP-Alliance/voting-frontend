import React, { useEffect, useState } from 'react';
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
// import { BaseError, ContractFunctionRevertedError } from 'viem';
import {
  usePrepareContractWrite,
  useContractWrite,
  useWaitForTransaction,
} from 'wagmi';

import { voteFactoryConfig } from 'constants/voteFactoryConfig';
// import { publicClient, walletClient } from 'services/clients';
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

const ErrorMessage = styled.div`
  color: var(--portal2023-rederror);
`;

function VoteFactory({
  address,
  closeModal,
}: {
  address: Address;
  closeModal: () => void;
}) {
  // const [errorMessage, setErrorMessage] = useState('');

  const {
    formState: { errors },
    control,
    getValues,
    trigger,
    watch,
  } = useForm({ mode: 'onTouched' });

  const debouncedFipNum = useDebounce(watch('fipNum'), 500);
  const debouncedLength = useDebounce(watch('length'), 500);
  const debouncedLsdTokens = useDebounce(watch('lsdTokens'), 500);

  const {
    config,
    error: prepareError,
    isError: isPrepareError,
  } = usePrepareContractWrite({
    address: voteFactoryConfig.address,
    abi: voteFactoryConfig.abi,
    functionName: 'startVote',
    args: [
      parseInt(debouncedFipNum),
      parseInt(debouncedLength) * 60,
      watch('doubleYesOption'),
      [debouncedLsdTokens],
    ],
    enabled:
      Boolean(debouncedLength) &&
      Boolean(debouncedFipNum) &&
      debouncedLsdTokens?.length > 0,
  });

  const { data, error, isError, write } = useContractWrite(config);

  const { isLoading, isSuccess } = useWaitForTransaction({
    hash: data?.hash,
  });

  // function addLsdTokensField() {

  // }

  function onSubmit(e: React.MouseEvent) {
    e.preventDefault();
    console.log('hi lisa submitted ', getValues());

    // setErrorMessage('');
    // try {
    trigger();
    write?.();

    // const { request } = await publicClient.simulateContract({
    //   address: voteFactoryConfig.address,
    //   abi: voteFactoryConfig.abi,
    //   functionName: 'mint',
    //   account: address,
    //   args: [
    //     getValues('fipNum'),
    //     getValues('length'),
    //     getValues('doubleYesOption') * 60, // convert to seconds
    //     getValues('lsdTokens'),
    //   ],
    // });

    // await walletClient.writeContract(request);

    // closeModal();
    // } catch (err) {
    //   if (err instanceof BaseError) {
    //     const revertError = err.walk(
    //       (err) => err instanceof ContractFunctionRevertedError,
    //     );
    //     if (revertError instanceof ContractFunctionRevertedError) {
    //       const errorName = revertError.data?.errorName ?? '';
    //       setErrorMessage(errorName);
    //     }
    //   }
    // }
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
              <RadioGroup row value={value || false} onChange={onChange}>
                <FormControlLabel
                  value={true}
                  label={'Yes'}
                  control={<CustomRadioButton />}
                />
                <FormControlLabel
                  value={false}
                  label={'No'}
                  control={<CustomRadioButton />}
                />
              </RadioGroup>
            )}
          />
        </FormControl>
        <Controller
          name='lsdTokens'
          control={control}
          rules={{ required: 'Required' }}
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <CustomTextField
              required
              placeholder='0x0000...0000'
              helperText={error ? 'Enter a token value' : null}
              size='small'
              error={!!error}
              onChange={onChange}
              value={value || ''}
              onBlur={() => trigger('lsdTokens')}
              fullWidth
              label='LSD Token'
              variant='outlined'
            />
          )}
        />
        <>
          {/* <TextField
            name={`sample${sampleMessages.length + 1}`}
            label={`Message ${sampleMessages.length + 1}`}
            minHeight='5rem'
            value={currentSampleMessage}
            onChange={(e) => setCurrentSampleMessage(e.target.value)}
            textArea
            required={sampleMessages.length === 0}
            validate={[minLength20]}
            maxLength={1024}
          /> */}
          {/* <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();

              // change the formValue
              // change(
              //   `sample${sampleMessages.length + 1}`,
              //   currentSampleMessage,
              // );
              // set currentValue
              // setCurrentSampleMessage('');
            }}
            disabled={!currentSampleMessage || loading}
          >
            Add LSD Token {loading ? <SpinnerIcon /> : null}
          </button> */}
        </>
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
