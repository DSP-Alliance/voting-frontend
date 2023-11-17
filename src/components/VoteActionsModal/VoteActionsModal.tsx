import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useAccount } from 'wagmi';
import { publicClient } from 'services/clients';
import type { Address } from 'components/Home';
import VoteActions from 'components/VoteActions';
import { useFipDataContext } from 'common/FipDataContext';
import { voteTrackerConfig } from 'constants/voteTrackerConfig';
import { voteFactoryConfig } from 'constants/voteFactoryConfig';

const StyledDialog = styled(Dialog)`
  color: var(--font-color);
`;

function VoteActionsModal({
  open,
  onClose,
  address,
}: {
  open: boolean;
  onClose: () => void;
  address: Address;
}) {
  const [hasRegistered, setHasRegistered] = useState(false);
  const [hasVoted, setHasVoted] = useState(false);
  const { lastFipAddress } = useFipDataContext();
  const { isConnected } = useAccount();

  async function getHasRegistered() {
    if (lastFipAddress) {
      try {
        const userHasRegistered = await publicClient.readContract({
          address: voteFactoryConfig.address,
          abi: voteFactoryConfig.abi,
          functionName: 'registered',
          args: [address || `0x`],
        });

        setHasRegistered(userHasRegistered);
      } catch {
        setHasRegistered(false);
      }
    }
  }

  async function getHasVoted() {
    if (
      lastFipAddress &&
      lastFipAddress !== localStorage.getItem('lastFipVoted')
    ) {
      try {
        const userHasVoted = await publicClient.readContract({
          address: lastFipAddress,
          abi: voteTrackerConfig.abi,
          functionName: 'hasVoted',
          args: [address || `0x`],
        });

        setHasVoted(userHasVoted);
      } catch {
        setHasVoted(false);
      }
    } else if (
      lastFipAddress &&
      lastFipAddress === localStorage.getItem('lastFipVoted')
    ) {
      setHasVoted(true);
    }
  }

  useEffect(() => {
    if (isConnected) {
      getHasRegistered();
      getHasVoted();
    }
  }, [lastFipAddress, address, isConnected]);

  return (
    <StyledDialog
      open={open}
      onClose={onClose}
      PaperProps={{
        style: {
          color: 'var(--font-color)',
        },
      }}
    >
      <DialogContent>
        <VoteActions
          hasRegistered={hasRegistered}
          hasVoted={hasVoted}
          setHasVoted={setHasVoted}
        />
      </DialogContent>
    </StyledDialog>
  );
}

export default VoteActionsModal;
