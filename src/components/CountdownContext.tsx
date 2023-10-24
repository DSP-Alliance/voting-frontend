import { voteTrackerConfig } from 'constants/voteTrackerConfig';
import React, { useState } from 'react';

import { publicClient } from 'services/clients';
import type { Address } from './Home';

type ContextType = {
  countdownValue: number | undefined;
  getCountdownValue: (fipNumber: Address) => void;
};

const CountdownValueContext = React.createContext<ContextType>({
  countdownValue: 0,
  getCountdownValue: () => {},
});

function CountdownContextProvider({ children }: { children: React.ReactNode }) {
  const [countdownValue, setCountdownValue] = useState<number | undefined>();

  async function getCountdownValue(fipAddress: Address) {
    if (!countdownValue) {
      const voteStartTime = await publicClient.readContract({
        abi: voteTrackerConfig.abi,
        address: fipAddress,
        functionName: 'voteStart',
      });

      const voteLength = await publicClient.readContract({
        abi: voteTrackerConfig.abi,
        address: fipAddress,
        functionName: 'voteLength',
      });

      const voteEndTime = voteStartTime + voteLength;
      const currentTime = Math.floor(Date.now() / 1000);

      if (currentTime < voteEndTime) {
        setCountdownValue(voteEndTime - currentTime);
      } else {
        setCountdownValue(0);
      }
    }
  }

  return (
    <CountdownValueContext.Provider
      value={{
        countdownValue,
        getCountdownValue,
      }}
    >
      {children}
    </CountdownValueContext.Provider>
  );
}

function useCountdownValueContext() {
  const context = React.useContext(CountdownValueContext);
  if (context === undefined) {
    throw new Error(
      'useCountdownValueContext must be used within a CountdownContextProvider',
    );
  }
  return context;
}

export { CountdownContextProvider, useCountdownValueContext };
