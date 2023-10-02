export const voteFactoryConfig = {
  address: '0x677C8c333cc0989fdBfcAD51f0f0588d240635a8',
  abi: [
    {
      inputs: [],
      stateMutability: 'nonpayable',
      type: 'constructor',
    },
    {
      inputs: [
        {
          internalType: 'address',
          name: 'sender',
          type: 'address',
        },
      ],
      name: 'NotAStarter',
      type: 'error',
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
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: 'address',
          name: 'user',
          type: 'address',
        },
        {
          indexed: true,
          internalType: 'address',
          name: 'newOwner',
          type: 'address',
        },
      ],
      name: 'OwnershipTransferred',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: 'address',
          name: 'vote',
          type: 'address',
        },
        {
          indexed: false,
          internalType: 'uint32',
          name: 'fipNum',
          type: 'uint32',
        },
        {
          indexed: false,
          internalType: 'uint32',
          name: 'length',
          type: 'uint32',
        },
      ],
      name: 'VoteStarted',
      type: 'event',
    },
    {
      inputs: [
        {
          internalType: 'uint32',
          name: '',
          type: 'uint32',
        },
      ],
      name: 'FIPnumToAddress',
      outputs: [
        {
          internalType: 'address',
          name: '',
          type: 'address',
        },
      ],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [
        {
          internalType: 'address',
          name: 'starter',
          type: 'address',
        },
      ],
      name: 'addStarter',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [
        {
          internalType: 'uint256',
          name: '',
          type: 'uint256',
        },
      ],
      name: 'deployedVotes',
      outputs: [
        {
          internalType: 'address',
          name: '',
          type: 'address',
        },
      ],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [],
      name: 'deployedVotesLength',
      outputs: [
        {
          internalType: 'uint256',
          name: 'len',
          type: 'uint256',
        },
      ],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [],
      name: 'owner',
      outputs: [
        {
          internalType: 'address',
          name: '',
          type: 'address',
        },
      ],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [
        {
          internalType: 'address',
          name: 'starter',
          type: 'address',
        },
      ],
      name: 'removeStarter',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
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
          internalType: 'string[2]',
          name: 'yesOptions',
          type: 'string[2]',
        },
        {
          internalType: 'address[]',
          name: 'lsdTokens',
          type: 'address[]',
        },
        {
          internalType: 'string',
          name: 'question',
          type: 'string',
        },
      ],
      name: 'startVote',
      outputs: [
        {
          internalType: 'address',
          name: 'vote',
          type: 'address',
        },
      ],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [
        {
          internalType: 'address',
          name: '',
          type: 'address',
        },
      ],
      name: 'starters',
      outputs: [
        {
          internalType: 'bool',
          name: '',
          type: 'bool',
        },
      ],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [
        {
          internalType: 'address',
          name: 'newOwner',
          type: 'address',
        },
      ],
      name: 'transferOwnership',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
  ],
} as const;
