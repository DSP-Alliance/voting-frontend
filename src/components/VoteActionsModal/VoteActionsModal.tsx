import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent } from '@mui/material';
import { useAccount } from 'wagmi';
import { publicClient } from 'services/clients';
import type { Address } from 'components/Home';
import VoteActions from 'components/VoteActions';
import { useFipDataContext } from 'common/FipDataContext';
import { voteTrackerConfig } from 'constants/voteTrackerConfig';

function VoteActionsModal({
  open,
  onClose,
  address,
  hasRegistered,
}: {
  open: boolean;
  onClose: () => void;
  address: Address;
  hasRegistered: boolean;
}) {
  const [hasVoted, setHasVoted] = useState(false);
  const { lastFipAddress } = useFipDataContext();
  const { isConnected } = useAccount();

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
      getHasVoted();
    }
  }, [lastFipAddress, address, isConnected]);

  return (
    <Dialog
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
    </Dialog>
  );
}

export default VoteActionsModal;
