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
        {
          internalType: 'string',
          name: '_question',
          type: 'string',
        },
      ],
      stateMutability: 'nonpayable',
      type: 'constructor',
    },
    {
      inputs: [
        {
          internalType: 'int256',
          name: 'errorCode',
          type: 'int256',
        },
      ],
      name: 'ActorError',
      type: 'error',
    },
    {
      inputs: [],
      name: 'ActorNotFound',
      type: 'error',
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
      name: 'FailToCallActor',
      type: 'error',
    },
    {
      inputs: [
        {
          internalType: 'CommonTypes.FilActorId',
          name: 'actorId',
          type: 'uint64',
        },
      ],
      name: 'InvalidActorID',
      type: 'error',
    },
    {
      inputs: [
        {
          internalType: 'uint64',
          name: '',
          type: 'uint64',
        },
      ],
      name: 'InvalidCodec',
      type: 'error',
    },
    {
      inputs: [],
      name: 'InvalidGlifPool',
      type: 'error',
    },
    {
      inputs: [],
      name: 'InvalidMiner',
      type: 'error',
    },
    {
      inputs: [],
      name: 'InvalidResponseLength',
      type: 'error',
    },
    {
      inputs: [],
      name: 'MinerAlreadyRegistered',
      type: 'error',
    },
    {
      inputs: [
        {
          internalType: 'uint256',
          name: 'balance',
          type: 'uint256',
        },
        {
          internalType: 'uint256',
          name: 'value',
          type: 'uint256',
        },
      ],
      name: 'NotEnoughBalance',
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
      name: 'doubleYesOption',
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
      type: 'function',
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
      name: 'hasVoted',
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
          internalType: 'uint256',
          name: '',
          type: 'uint256',
        },
      ],
      name: 'lsdTokens',
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
      inputs: [],
      name: 'question',
      outputs: [
        {
          internalType: 'string',
          name: '',
          type: 'string',
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
          internalType: 'uint64',
          name: '',
          type: 'uint64',
        },
      ],
      name: 'registeredMiner',
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
      inputs: [
        {
          internalType: 'address',
          name: '',
          type: 'address',
        },
      ],
      name: 'voterWeightMinerToken',
      outputs: [
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
      inputs: [
        {
          internalType: 'address',
          name: '',
          type: 'address',
        },
      ],
      name: 'voterWeightRBP',
      outputs: [
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
      inputs: [
        {
          internalType: 'address',
          name: '',
          type: 'address',
        },
      ],
      name: 'voterWeightToken',
      outputs: [
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
