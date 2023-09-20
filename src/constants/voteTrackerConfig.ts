export const voteTrackerConfig = {
  abi: [
    {
      inputs: [
        {
          internalType: 'uint32',
          name: 'length',
          type: 'uint32',
        },
        {
          internalType: 'bool',
          name: '_doubleYesOption',
          type: 'bool',
        },
        {
          internalType: 'address',
          name: '_glifFactory',
          type: 'address',
        },
        {
          internalType: 'address[]',
          name: '_lsdTokens',
          type: 'address[]',
        },
        {
          internalType: 'uint32',
          name: '_FIP',
          type: 'uint32',
        },
        {
          internalType: 'address',
          name: 'owner',
          type: 'address',
        },
      ],
      stateMutability: 'nonpayable',
      type: 'constructor',
    },
    {
      inputs: [],
      name: 'AlreadyRegistered',
      type: 'error',
    },
    {
      inputs: [],
      name: 'AlreadyVoted',
      type: 'error',
    },
    {
      inputs: [],
      name: 'NotRegistered',
      type: 'error',
    },
    {
      inputs: [],
      name: 'VoteConcluded',
      type: 'error',
    },
    {
      inputs: [],
      name: 'VoteNotConcluded',
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
          name: 'voter',
          type: 'address',
        },
        {
          indexed: false,
          internalType: 'uint256',
          name: 'weightRBP',
          type: 'uint256',
        },
        {
          indexed: false,
          internalType: 'uint256',
          name: 'weightToken',
          type: 'uint256',
        },
        {
          indexed: false,
          internalType: 'uint256',
          name: 'vote',
          type: 'uint256',
        },
      ],
      name: 'VoteCast',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: 'address',
          name: 'voter',
          type: 'address',
        },
        {
          indexed: false,
          internalType: 'uint64[]',
          name: 'minerIds',
          type: 'uint64[]',
        },
        {
          indexed: false,
          internalType: 'uint256',
          name: 'weightRBP',
          type: 'uint256',
        },
        {
          indexed: false,
          internalType: 'uint256',
          name: 'weightToken',
          type: 'uint256',
        },
      ],
      name: 'VoterRegistered',
      type: 'event',
    },
    {
      inputs: [],
      name: 'FIP',
      outputs: [
        {
          internalType: 'uint32',
          name: '',
          type: 'uint32',
        },
      ],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [
        {
          internalType: 'address',
          name: 'token',
          type: 'address',
        },
      ],
      name: 'addLSDToken',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [
        {
          internalType: 'uint256',
          name: 'vote',
          type: 'uint256',
        },
      ],
      name: 'castVote',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [],
      name: 'getVoteResultsMinerToken',
      outputs: [
        {
          internalType: 'uint256',
          name: '',
          type: 'uint256',
        },
        {
          internalType: 'uint256',
          name: '',
          type: 'uint256',
        },
        {
          internalType: 'uint256',
          name: '',
          type: 'uint256',
        },
        {
          internalType: 'uint256',
          name: '',
          type: 'uint256',
        },
      ],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [],
      name: 'getVoteResultsRBP',
      outputs: [
        {
          internalType: 'uint256',
          name: '',
          type: 'uint256',
        },
        {
          internalType: 'uint256',
          name: '',
          type: 'uint256',
        },
        {
          internalType: 'uint256',
          name: '',
          type: 'uint256',
        },
        {
          internalType: 'uint256',
          name: '',
          type: 'uint256',
        },
      ],
      stateMutability: 'view',
      type: 'function'
    },
    {
      inputs: [],
      name: 'getVoteResultsToken',
      outputs: [
        {
          internalType: 'uint256',
          name: '',
          type: 'uint256',
        },
        {
          internalType: 'uint256',
          name: '',
          type: 'uint256',
        },
        {
          internalType: 'uint256',
          name: '',
          type: 'uint256',
        },
        {
          internalType: 'uint256',
          name: '',
          type: 'uint256',
        },
      ],
      stateMutability: 'view',
      type: 'function'
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
          name: 'glifpool',
          type: 'address',
        },
        {
          internalType: 'uint64[]',
          name: 'minerIds',
          type: 'uint64[]',
        },
      ],
      name: 'registerVoter',
      outputs: [
        {
          internalType: 'uint256',
          name: 'powerRBP',
          type: 'uint256',
        },
        {
          internalType: 'uint256',
          name: 'powerToken',
          type: 'uint256',
        },
      ],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [
        {
          internalType: 'uint256',
          name: 'index',
          type: 'uint256',
        },
      ],
      name: 'removeLSDToken',
      outputs: [],
      stateMutability: 'nonpayable',
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
    {
      inputs: [
        {
          internalType: 'uint256',
          name: 'vote',
          type: 'uint256',
        },
        {
          internalType: 'address',
          name: 'glifPool',
          type: 'address',
        },
        {
          internalType: 'uint64[]',
          name: 'minerIds',
          type: 'uint64[]',
        },
      ],
      name: 'voteAndRegister',
      outputs: [
        {
          internalType: 'uint256',
          name: 'voteWeightRBP',
          type: 'uint256',
        },
        {
          internalType: 'uint256',
          name: 'voteWeightToken',
          type: 'uint256',
        },
      ],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [],
      name: 'voteLength',
      outputs: [
        {
          internalType: 'uint32',
          name: '',
          type: 'uint32',
        },
      ],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [],
      name: 'voteStart',
      outputs: [
        {
          internalType: 'uint32',
          name: '',
          type: 'uint32',
        },
      ],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [],
      name: 'winningVote',
      outputs: [
        {
          internalType: 'enum VoteTracker.Vote',
          name: '',
          type: 'uint8',
        },
      ],
      stateMutability: 'view',
      type: 'function',
    },
  ],
} as const;
