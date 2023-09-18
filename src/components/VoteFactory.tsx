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
import { BaseError, ContractFunctionRevertedError } from 'viem';
// import {
//   usePrepareContractWrite,
//   useContractWrite,
//   useWaitForTransaction,
// } from 'wagmi';

import { voteFactoryConfig } from 'constants/voteFactoryConfig';
import { publicClient, walletClient } from 'services/clients';
// import useDebounce from 'utilities/useDebounce';
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
  const [errorMessage, setErrorMessage] = useState('');

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    control,
  } = useForm();

  // const [fipNum, setFipNum] = useState('');
  // const [length, setLength] = useState('');
  // const [doubleYesOption, setDoubleYesOption] = useState(false);
  // const [lsdTokens, setLsdTokens] = useState<string[]>([]);

  // const debouncedFipNum = useDebounce(watch('fipNum'), 500);
  // const debouncedLength = useDebounce(watch('length'), 500);
  // const debouncedDoubleYesOption = useDebounce(watch('doubleYesOption'), 500);
  // const debouncedLsdTokens = useDebounce(watch('lsdTokens'), 500);

  async function startVote() {
    const res = await walletClient.writeContract({
      abi: voteFactoryConfig.abi,
      address: voteFactoryConfig.address,
      functionName: 'startVote',
      account: address,
      args: [
        watch('fipNum'),
        watch('length'),
        watch('doubleYesOption'),
        watch('lsdTokens'),
      ],
    });
  }

  // const {
  //   config,
  //   error: prepareError,
  //   isError: isPrepareError,
  // } = usePrepareContractWrite({
  //   address: voteFactoryConfig.address, // or should this be the owner address?
  //   abi: voteFactoryConfig.abi,
  //   functionName: 'startVote',
  //   args: [
  //     parseInt(debouncedFipNum),
  //     parseInt(debouncedLength),
  //     debouncedDoubleYesOption,
  //     [debouncedLsdTokens],
  //   ],
  //   // enabled: Boolean(length) && Boolean(fipNum) && lsdTokens.length > 0,
  // });

  // const { data, error, isError, write } = useContractWrite(config);

  // const { isLoading, isSuccess } = useWaitForTransaction({
  //   hash: data?.hash,
  // });

  async function onSubmit() {
    setErrorMessage('');
    try {
      const { request } = await publicClient.simulateContract({
        address: voteFactoryConfig.address,
        abi: voteFactoryConfig.abi,
        functionName: 'mint',
        account: address,
        args: [
          watch('fipNum'),
          watch('length'),
          watch('doubleYesOption') * 60, // convert to seconds
          watch('lsdTokens'),
        ],
      });

      await walletClient.writeContract(request);

      closeModal();
    } catch (err) {
      if (err instanceof BaseError) {
        const revertError = err.walk(
          (err) => err instanceof ContractFunctionRevertedError,
        );
        if (revertError instanceof ContractFunctionRevertedError) {
          const errorName = revertError.data?.errorName ?? '';
          setErrorMessage(errorName);
        }
      }
    }
  }

  return (
    <>
      <Form onSubmit={handleSubmit(onSubmit)}>
        {/* TODO change this to a dropdown of all available FIPs */}
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
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <RadioGroup row value={value || false} onChange={onChange}>
                <FormControlLabel
                  value={true}
                  label={'Yes'}
                  control={<Radio />}
                />
                <FormControlLabel
                  value={false}
                  label={'No'}
                  control={<Radio />}
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
              type='number'
              helperText={error ? 'Enter an token value' : null}
              size='small'
              error={!!error}
              onChange={onChange}
              value={value || ''}
              fullWidth
              label='LSD Token'
              variant='outlined'
            />
          )}
        />
      </Form>
      {errorMessage && <ErrorMessage>Error: {errorMessage}</ErrorMessage>}
      <DialogActions>
        <button onClick={closeModal}>Cancel</button>
        <button type='submit' disabled={Boolean(errors)}>
          Start Vote
        </button>
      </DialogActions>
    </>
  );
}

export default VoteFactory;
