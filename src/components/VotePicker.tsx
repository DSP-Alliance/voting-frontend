import React, { useState } from 'react';
import { publicClient } from 'services/clients';
import { voteTrackerConfig } from 'constants/voteTrackerConfig';
import type { Address } from './Home';

function VotePicker({ address }: { address: Address | undefined }) {
  const [vote, setVote] = useState(0);
  const [glifPool, setGlifPool] = useState<Address>(`0x`);
  const [minerIds, setMinerIds] = useState([]);

  async function sendVote() {
    const encodedVote = encodeVote(vote);
    // test request will succeed before sending
    const { request } = await publicClient.simulateContract({
      account: address,
      address: '0xFBA3912Ca04dd458c843e2EE08967fC04f3579c2',
      abi: voteTrackerConfig.abi,
      functionName: 'voteAndRegister',
      args: [BigInt(encodedVote), glifPool, minerIds],
    });

    // await walletClient.writeContract(request);
  }

  function encodeVote(vote: number) {
    return vote;
    // switch (vote % 3) {
    //   // yes Vote
    //   case 0: { // If we have two yes options then (vote % 6) can only equal 0 or 3
    //     if (doubleYesVote && vote % 6 >= 3) {
    //       // If it is 3 then it is for option 2
    //       yesVoteOption2 += weight;
    //     } else {
    //       // If it is 0 or there is no second yes option
    //       yesVoteOption1 += weight;
    //     }
    //   }
    //   // no Vote
    //   case 1:
    //     noVote += weight;
    //   // abstain Vote
    //   case 2:
    //     abstainVote += weight;
    // }
  }

  return <p>hi</p>;
}

export default VotePicker;
