import React, { useEffect, useState } from 'react';

import { voteTrackerConfig } from 'constants/voteTrackerConfig';
import { publicClient } from 'services/clients';
import { useFipDataContext } from './FipDataContext';

type ContextType = {
  voteEndTime: number | undefined;
};

const VoteEndContext = React.createContext<ContextType>({
  voteEndTime: undefined,
});

function VoteEndContextProvider({ children }: { children: React.ReactNode }) {
  const [voteEndTime, setVoteEndTime] = useState<number | undefined>();

  const { lastFipAddress } = useFipDataContext();

  useEffect(() => {
    async function getVoteTimes() {
      if (lastFipAddress) {
        const voteStartTime = await publicClient.readContract({
          abi: voteTrackerConfig.abi,
          address: lastFipAddress,
          functionName: 'voteStart',
        });

        const voteLength = await publicClient.readContract({
          abi: voteTrackerConfig.abi,
          address: lastFipAddress,
          functionName: 'voteLength',
        });

        const endTime = (voteStartTime + voteLength) * 1000;
        setVoteEndTime(endTime);
      }
    }
    getVoteTimes();
  }, [lastFipAddress]);

  return (
    <VoteEndContext.Provider value={{ voteEndTime }}>
      {children}
    </VoteEndContext.Provider>
  );
}

function useVoteEndContext() {
  const context = React.useContext(VoteEndContext);
  if (context === undefined) {
    throw new Error(
      'useVoteEndContext must be used within a VoteEndContextProvider',
    );
  }
  return context;
}

export { VoteEndContextProvider, useVoteEndContext };
