export const voteFactoryConfig = {
  address: '0x1ebefb51b6f12715dc5258ba0b03d927f030be07',
  abi: [
    {
      inputs: [],
      stateMutability: 'nonpayable',
      type: 'constructor'
    },
    {
      inputs: [
        {
          internalType: 'address',
          name: 'sender',
          type: 'address'
        }
      ],
      name: 'NotAStarter',
      type: 'error'
    },
    {
      inputs: [
        {
          internalType: 'uint32',
          name: 'fipNum',
          type: 'uint32'
        }
      ],
      name: 'VoteAlreadyExists',
      type: 'error'
    },
    {
      anonymous: false,
      inputs: [
        {
          'indexed': true,
          internalType: 'address',
          name: 'user',
          type: 'address'
        },
        {
          'indexed': true,
          internalType: 'address',
          name: 'newOwner',
          type: 'address'
        }
      ],
      name: 'OwnershipTransferred',
      type: 'event'
    },
    {
      anonymous: false,
      inputs: [
        {
          'indexed': false,
          internalType: 'address',
          name: 'vote',
          type: 'address'
        },
        {
          'indexed': false,
          internalType: 'uint32',
          name: 'fipNum',
          type: 'uint32'
        },
        {
          'indexed': false,
          internalType: 'uint32',
          name: 'length',
          type: 'uint32'
        }
      ],
      name: 'VoteStarted',
      type: 'event'
    },
    {
      inputs: [
        {
          internalType: 'uint32',
          name: '',
          type: 'uint32'
        }
      ],
      name: 'FIPnumToAddress',
      outputs: [
        {
          internalType: 'address',
          name: '',
          type: 'address'
        }
      ],
      stateMutability: 'view',
      type: 'function'
    },
    {
      inputs: [
        {
          internalType: 'uint256',
          name: 'index',
          type: 'uint256'
        }
      ],
      name: '_removeStarterIndex',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function'
    },
    {
      inputs: [
        {
          internalType: 'address',
          name: 'starter',
          type: 'address'
        }
      ],
      name: 'addStarter',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function'
    },
    {
      inputs: [
        {
          internalType: 'uint256',
          name: '',
          type: 'uint256'
        }
      ],
      name: 'deployedVotes',
      outputs: [
        {
          internalType: 'address',
          name: '',
          type: 'address'
        }
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
          type: 'address'
        }
      ],
      stateMutability: 'view',
      type: 'function'
    },
    {
      inputs: [
        {
          internalType: 'address',
          name: 'starter',
          type: 'address'
        }
      ],
      name: 'removeStarter',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function'
    },
    {
      inputs: [
        {
          internalType: 'uint32',
          name: 'length',
          type: 'uint32'
        },
        {
          internalType: 'uint32',
          name: 'fipNum',
          type: 'uint32'
        },
        {
          internalType: 'bool',
          name: 'doubleYesOption',
          type: 'bool'
        },
        {
          internalType: 'address[]',
          name: 'lsdTokens',
          type: 'address[]'
        },
        {
          internalType: 'string',
          name: 'question',
          type: 'string'
        }
      ],
      name: 'startVote',
      outputs: [
        {
          internalType: 'address',
          name: 'vote',
          type: 'address'
        }
      ],
      stateMutability: 'nonpayable',
      type: 'function'
    },
    {
      inputs: [
        {
          internalType: 'uint256',
          name: '',
          type: 'uint256'
        }
      ],
      name: 'starters',
      outputs: [
        {
          internalType: 'address',
          name: '',
          type: 'address'
        }
      ],
      stateMutability: 'view',
      type: 'function'
    },
    {
      inputs: [
        {
          internalType: 'address',
          name: 'newOwner',
          type: 'address'
        }
      ],
      name: 'transferOwnership',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function'
    }
  ],
} as const;
