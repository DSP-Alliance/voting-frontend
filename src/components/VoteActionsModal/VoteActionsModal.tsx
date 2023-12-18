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
  hasVoted,
  setHasVoted,
}: {
  open: boolean;
  onClose: () => void;
  address: Address;
  hasRegistered: boolean;
  hasVoted: boolean;
  setHasVoted: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const { lastFipAddress } = useFipDataContext();
  const { address: walletAddress, isConnected } = useAccount();

  async function getHasVoted() {
    try {
      const userHasVoted = await publicClient.readContract({
        address: lastFipAddress as Address,
        abi: voteTrackerConfig.abi,
        functionName: 'hasVoted',
        args: [walletAddress || `0x`],
      });
      setHasVoted(userHasVoted);
    } catch {
      setHasVoted(false);
    }
  }

  useEffect(() => {
    if (isConnected) {
      getHasVoted();
    }
  }, [lastFipAddress, address, walletAddress, isConnected]);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth='lg'
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
