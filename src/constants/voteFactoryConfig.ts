export const voteFactoryConfig = {
  address: '0xf109f754cdea239d2811d1f285471e0dc25d918e',
  abi: [
    {
      inputs: [
        {
          internalType: 'address',
          name: '_glifFactory',
          type: 'address',
        },
      ],
      stateMutability: 'nonpayable',
      type: 'constructor',
    },
    {
      inputs: [
        {
          internalType: 'uint32',
          name: 'fipNum',
          type: 'uint32',
        },
      ],
      name: 'VoteAlreadyExists',
      type: 'error',
    },
    {
      inputs: [
        {
          internalType: 'address',
          name: 'user',
          type: 'address',
          indexed: true,
        },
        {
          internalType: 'address',
          name: 'newOwner',
          type: 'address',
          indexed: true,
        },
      ],
      type: 'event',
      name: 'OwnershipTransferred',
      anonymous: false,
    },
    {
      inputs: [
        {
          internalType: 'address',
          name: 'vote',
          type: 'address',
          indexed: false,
        },
        {
          internalType: 'uint32',
          name: 'fipNum',
          type: 'uint32',
          indexed: false,
        },
        {
          internalType: 'uint32',
          name: 'length',
          type: 'uint32',
          indexed: false,
        },
      ],
      type: 'event',
      name: 'VoteStarted',
      anonymous: false,
    },
    {
      inputs: [
        {
          internalType: 'uint32',
          name: '',
          type: 'uint32',
        },
      ],
      stateMutability: 'view',
      type: 'function',
      name: 'FIPnumToAddress',
      outputs: [
        {
          internalType: 'address',
          name: '',
          type: 'address',
        },
      ],
    },
    {
      inputs: [
        {
          internalType: 'uint256',
          name: '',
          type: 'uint256',
        },
      ],
      stateMutability: 'view',
      type: 'function',
      name: 'deployedVotes',
      outputs: [
        {
          internalType: 'address',
          name: '',
          type: 'address',
        },
      ],
    },
    {
      inputs: [],
      stateMutability: 'view',
      type: 'function',
      name: 'owner',
      outputs: [
        {
          internalType: 'address',
          name: '',
          type: 'address',
        },
      ],
    },
    {
      inputs: [
        {
          internalType: 'uint32',
          name: '',
          type: 'uint32',
        },
      ],
      stateMutability: 'view',
      type: 'function',
      name: 'starters',
      outputs: [
        {
          internalType: 'address',
          name: '',
          type: 'address',
        },
      ],
    },
    {
      inputs: [
        {
          internalType: 'uint32',
          name: 'length',
          type: 'uint32',
        },
        {
          internalType: 'uint32',
          name: 'fipNum',
          type: 'uint32',
        },
        {
          internalType: 'bool',
          name: 'doubleYesOption',
          type: 'bool',
        },
        {
          internalType: 'address[]',
          name: 'lsdTokens',
          type: 'address[]',
        },
      ],
      stateMutability: 'nonpayable',
      type: 'function',
      name: 'startVote',
      outputs: [
        {
          internalType: 'address',
          name: 'vote',
          type: 'address',
        },
      ],
    },
    {
      inputs: [
        {
          internalType: 'address',
          name: 'newOwner',
          type: 'address',
        },
      ],
      stateMutability: 'nonpayable',
      type: 'function',
      name: 'transferOwnership',
      outputs: [],
    },
  ],
} as const;
