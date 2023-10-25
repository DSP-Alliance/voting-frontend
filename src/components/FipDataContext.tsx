import React, { useEffect, useState } from 'react';

import { voteFactoryConfig } from 'constants/voteFactoryConfig';
import { voteTrackerConfig } from 'constants/voteTrackerConfig';
import { publicClient } from 'services/clients';
import { Address } from './Home';

type ContextType = {
  getFipData: () => void;
  fipAddresses: Address[];
  fipList: number[];
  initialVotesLength: number;
  lastFipAddress: Address | undefined;
  lastFipNum: number | undefined;
  loadingFipData: boolean;
};

const FipDataContext = React.createContext<ContextType>({
  getFipData: () => {},
  fipAddresses: [],
  fipList: [],
  initialVotesLength: 0,
  lastFipAddress: undefined,
  lastFipNum: undefined,
  loadingFipData: true,
});

function FipDataContextProvider({ children }: { children: React.ReactNode }) {
  const [fipAddresses, setFipAddresses] = useState<Address[]>([]);
  const [fipList, setFipList] = useState<number[]>([]);
  const [initialVotesLength, setInitialVotesLength] = useState<number>(0);
  const [lastFipNum, setLastFipNum] = useState<number>();
  const [loadingFipData, setLoadingFipData] = useState(true);
  const lastFipAddress = fipAddresses[fipAddresses.length - 1];

  async function getFipData() {
    try {
      const deployedCount: bigint = await publicClient.readContract({
        abi: voteFactoryConfig.abi,
        address: voteFactoryConfig.address,
        functionName: 'deployedVotesLength',
      });

      const promises = [];
      for (let i = 0; i < deployedCount; i++) {
        promises.push(
          publicClient.readContract({
            abi: voteFactoryConfig.abi,
            address: voteFactoryConfig.address,
            functionName: 'deployedVotes',
            args: [BigInt(i)],
          }),
        );
      }
      const voteAddresses: Address[] = await Promise.all(promises);

      setFipAddresses(voteAddresses);
      setInitialVotesLength(voteAddresses.length);

      const fips = await Promise.all(
        voteAddresses.map((fipAddress) => {
          return publicClient.readContract({
            abi: voteTrackerConfig.abi,
            address: fipAddress,
            functionName: 'FIP',
          });
        }),
      );

      setFipList(fips);
      setLastFipNum(fips[fips.length - 1]);
      setLoadingFipData(false);
    } catch (error) {
      setFipAddresses([]);
      setLastFipNum(undefined);
      setLoadingFipData(false);
    }
  }

  useEffect(() => {
    getFipData();
  }, []);

  return (
    <FipDataContext.Provider
      value={{
        getFipData,
        fipAddresses,
        fipList,
        initialVotesLength,
        lastFipAddress,
        lastFipNum,
        loadingFipData,
      }}
    >
      {children}
    </FipDataContext.Provider>
  );
}

function useFipDataContext() {
  const context = React.useContext(FipDataContext);
  if (context === undefined) {
    throw new Error(
      'useFipDataContext must be used within a FipDataContextProvider',
    );
  }
  return context;
}

export { FipDataContextProvider, useFipDataContext };
