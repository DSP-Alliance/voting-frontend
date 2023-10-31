export const voteFactoryConfig = {
  address: '0x3197765b1a694040c713Cf0b9fFD5FBeb82B0366',
  abi: [
    {
      "inputs": [],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "inputs": [
        {
          "internalType": "int256",
          "name": "errorCode",
          "type": "int256"
        }
      ],
      "name": "ActorError",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "ActorNotFound",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "AlreadyRegistered",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "FailToCallActor",
      "type": "error"
    },
    {
      "inputs": [
        {
          "internalType": "CommonTypes.FilActorId",
          "name": "actorId",
          "type": "uint64"
        }
      ],
      "name": "InvalidActorID",
      "type": "error"
    },
    {
      "inputs": [
        {
          "internalType": "uint64",
          "name": "",
          "type": "uint64"
        }
      ],
      "name": "InvalidCodec",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "InvalidGlifPool",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "InvalidResponseLength",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "MinerAlreadyRegistered",
      "type": "error"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "sender",
          "type": "address"
        }
      ],
      "name": "NotAStarter",
      "type": "error"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "balance",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "value",
          "type": "uint256"
        }
      ],
      "name": "NotEnoughBalance",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "NotOwner",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "NotRegistered",
      "type": "error"
    },
    {
      "inputs": [
        {
          "internalType": "uint32",
          "name": "fipNum",
          "type": "uint32"
        }
      ],
      "name": "VoteAlreadyExists",
      "type": "error"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "user",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "newOwner",
          "type": "address"
        }
      ],
      "name": "OwnershipTransferred",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "address",
          "name": "vote",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint32",
          "name": "fipNum",
          "type": "uint32"
        },
        {
          "indexed": false,
          "internalType": "uint32",
          "name": "length",
          "type": "uint32"
        }
      ],
      "name": "VoteStarted",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "address",
          "name": "voter",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "address",
          "name": "glif",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint64[]",
          "name": "minerIds",
          "type": "uint64[]"
        }
      ],
      "name": "VoterRegistered",
      "type": "event"
    },
    {
      "inputs": [
        {
          "internalType": "uint32",
          "name": "",
          "type": "uint32"
        }
      ],
      "name": "FIPnumToAddress",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "voter",
          "type": "address"
        },
        {
          "internalType": "uint64",
          "name": "minerId",
          "type": "uint64"
        }
      ],
      "name": "addMiner",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "starter",
          "type": "address"
        }
      ],
      "name": "addStarter",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "deployedVotes",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "deployedVotesLength",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "len",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "owner",
          "type": "address"
        }
      ],
      "name": "getOwnedMinerLength",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "length",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "name": "ownedGlifPool",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "ownedMiners",
      "outputs": [
        {
          "internalType": "uint64",
          "name": "",
          "type": "uint64"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "owner",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "glifpool",
          "type": "address"
        },
        {
          "internalType": "uint64[]",
          "name": "minerIds",
          "type": "uint64[]"
        }
      ],
      "name": "register",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "name": "registered",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint64",
          "name": "",
          "type": "uint64"
        }
      ],
      "name": "registeredMiner",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "starter",
          "type": "address"
        }
      ],
      "name": "removeStarter",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint32",
          "name": "length",
          "type": "uint32"
        },
        {
          "internalType": "uint32",
          "name": "fipNum",
          "type": "uint32"
        },
        {
          "internalType": "string[2]",
          "name": "yesOptions",
          "type": "string[2]"
        },
        {
          "internalType": "address[]",
          "name": "lsdTokens",
          "type": "address[]"
        },
        {
          "internalType": "string",
          "name": "question",
          "type": "string"
        }
      ],
      "name": "startVote",
      "outputs": [
        {
          "internalType": "address",
          "name": "vote",
          "type": "address"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "name": "starters",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "addr",
          "type": "address"
        }
      ],
      "name": "toFilAddr",
      "outputs": [
        {
          "components": [
            {
              "internalType": "bytes",
              "name": "data",
              "type": "bytes"
            }
          ],
          "internalType": "struct CommonTypes.FilAddress",
          "name": "filAddr",
          "type": "tuple"
        }
      ],
      "stateMutability": "pure",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "newOwner",
          "type": "address"
        }
      ],
      "name": "transferOwnership",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint64",
          "name": "minerId",
          "type": "uint64"
        },
        {
          "internalType": "address",
          "name": "voter",
          "type": "address"
        }
      ],
      "name": "voterRBP",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "power",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    }
  ],
} as const;
