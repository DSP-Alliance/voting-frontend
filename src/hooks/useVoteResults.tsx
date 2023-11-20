import { useEffect, useState } from 'react';
import type { Address } from 'components/Home';
import { publicClient } from 'services/clients';
import { voteTrackerConfig } from 'constants/voteTrackerConfig';
import { indexOfMax } from 'utilities/helpers';

export type VoteResultsData = {
  loading: boolean;
  rbpData: { [key: string]: string | number }[];
  tokenData: { [key: string]: string | number }[];
  minerTokenData: { [key: string]: string | number }[];
  totalRbp: number;
  totalTokens: bigint | undefined;
  totalMinerTokens: bigint | undefined;
  winningRbp: string;
  winningTokens: string;
  winningMinerTokens: string;
};

function useVoteResults({
  fipAddress,
  yesOptions,
}: {
  fipAddress: Address | undefined;
  yesOptions: string[];
}): VoteResultsData {
  const [loading, setLoading] = useState(false);
  const [rbpData, setRbpData] = useState<{ [key: string]: string | number }[]>(
    [],
  );
  const [tokenData, setTokenData] = useState<
    { [key: string]: string | number }[]
  >([]);
  const [minerTokenData, setMinerTokenData] = useState<
    { [key: string]: string | number }[]
  >([]);
  const [totalRbp, setTotalRbp] = useState<number>(0);
  const [totalTokens, setTotalTokens] = useState<bigint>();
  const [totalMinerTokens, setTotalMinerTokens] = useState<bigint>();
  const [winningRbp, setWinningRbp] = useState('');
  const [winningTokens, setWinningTokens] = useState('');
  const [winningMinerTokens, setWinningMinerTokens] = useState('');

  useEffect(() => {
    if (fipAddress && yesOptions.length > 0) {
      setLoading(true);
      Promise.all([
        publicClient.readContract({
          abi: voteTrackerConfig.abi,
          address: fipAddress,
          functionName: 'getVoteResultsRBP',
        }),
        publicClient.readContract({
          abi: voteTrackerConfig.abi,
          address: fipAddress,
          functionName: 'getVoteResultsMinerToken',
        }),
        publicClient.readContract({
          abi: voteTrackerConfig.abi,
          address: fipAddress,
          functionName: 'getVoteResultsToken',
        }),
      ])
        .then(([rbpVotes, minerTokenVotes, tokenVotes]) => {
          setTotalRbp(rbpVotes.reduce((a, b) => a + Number(b), 0));
          setTotalTokens(tokenVotes.reduce((a, b) => a + b, BigInt(0)));
          setTotalMinerTokens(
            minerTokenVotes.reduce((a, b) => a + b, BigInt(0)),
          );

          const yesOption1 = yesOptions[0];
          const yesOption2 = yesOptions[1];

          const VOTES = [
            yesOption1 && yesOption1.length > 0 ? yesOption1 : 'Yes',
            yesOption2 && yesOption2.length > 0 ? yesOption2 : 'Yes 2',
            'No',
            'Abstain',
          ];

          setWinningRbp(VOTES[indexOfMax([...rbpVotes])]);
          setWinningTokens(VOTES[indexOfMax([...tokenVotes])]);
          setWinningMinerTokens(VOTES[indexOfMax([...minerTokenVotes])]);

          setRbpData([
            {
              name: yesOption1,
              RBP: Number(rbpVotes[0]),
            },
            ...(yesOption2
              ? [
                  {
                    name: yesOption2,
                    RBP: Number(rbpVotes[1]),
                  },
                ]
              : []),
            {
              name: 'No',
              RBP: Number(rbpVotes[2]),
            },
            {
              name: 'Abstain',
              RBP: Number(rbpVotes[3]),
            },
          ]);

          setTokenData([
            {
              name: yesOption1,
              Tokens: Number(tokenVotes[0]),
            },
            ...(yesOption2
              ? [
                  {
                    name: yesOption2,
                    Tokens: Number(tokenVotes[1]),
                  },
                ]
              : []),
            {
              name: 'No',
              Tokens: Number(tokenVotes[2]),
            },
            {
              name: 'Abstain',
              Tokens: Number(tokenVotes[3]),
            },
          ]);

          setMinerTokenData([
            {
              name: yesOption1,
              'Miner Tokens': Number(minerTokenVotes[0]),
            },
            ...(yesOption2
              ? [
                  {
                    name: yesOption2,
                    'Miner Tokens': Number(minerTokenVotes[1]),
                  },
                ]
              : []),
            {
              name: 'No',
              'Miner Tokens': Number(minerTokenVotes[2]),
            },
            {
              name: 'Abstain',
              'Miner Tokens': Number(minerTokenVotes[3]),
            },
          ]);
        })
        .finally(() => setLoading(false));
    }
  }, [fipAddress, yesOptions]); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    loading,
    rbpData,
    tokenData,
    minerTokenData,
    totalRbp,
    totalTokens,
    totalMinerTokens,
    winningRbp,
    winningTokens,
    winningMinerTokens,
  };
}

export default useVoteResults;
