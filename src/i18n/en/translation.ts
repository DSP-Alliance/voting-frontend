export default {
  title: 'FIP Voting Dashboard',
  yes: 'Yes',
  yes2: 'Yes 2',
  no: 'No',
  abstain: 'Abstain',
  active: 'Active',
  passed: 'Passed',
  required: 'Required',
  cancel: 'Cancel',
  startVote: 'Start Vote',
  latestVote: 'Current Vote',
  voteHistory: 'Vote History',
  vote: 'Vote',
  voteWithMultisign: 'Vote With Multisign',
  noVoteData: 'No Vote Data',
  timeLeft: 'Time Left',
  ended: 'Ended',
  authors: 'Authors',
  discussions: 'Discussions',
  winning_upper: 'WINNING',
  total_upper: 'TOTAL',
  question: 'Question',

  buttons: {
    connect: 'Connect',
    disconnect: 'Disconnect',
    register: 'Register',
    startVote: 'Start Vote',
    vote: 'Vote',
    wallet: 'Wallet',
  },

  labels: {
    fil: 'FIL',
    rbp: 'RBP',
    votingPower: 'Voting Power registered to Wallet',
  },

  modals: {
    connectors: {
      title: 'Connect Wallet',
      header: 'Would you like to cast a vote on the current FIP?',
      optionsLabel: 'Choose a method to connect.',
    },
    manualMinerRegister: {
      title: 'Manual Miner Registration',
      form: {
        header:
          'You can manually add miners to a registered voter by running a command on your miner. Register as a voter using this site, and then insert your ETH wallet address into this form.',
        voterAddress: {
          label: 'Voter Address',
          tooltip: 'Wallet Address you registered to vote with',
        },
        minerID: {
          label:
            'Your Miner ID without the ‘f’ character. For example, if your miner id is f12345, you would input 1234.',
          tooltip: 'Miner ID',
          invalid: 'Invalid Miner ID',
        },
        closeButton: 'Okay',
      },
    },
    multisigRegister: {
      title: 'Register Multisig',
      form: {
        header:
          'In order to use a multisignature wallet as a voter, you must propose a new transaction in order to register as a voter.',
        subheader:
          'Depending on your multisig approval threshold, N of M signers must run the approval command.',
        step1: '1) Create the registration proposal',
        step2: '2) Approve the registration proposal with signers',
        multisigAddress: {
          label: 'Multisig Address',
          tooltip:
            'Input the multisig address you wish to register to vote with',
        },
        transactionID: {
          label: 'Transaction ID',
          tooltip:
            'This will be displayed in the lotus cli after the proposal command was used and the transaction has completed.',
        },
        proposerAddress: {
          label: 'Proposer Address',
          tooltip:
            'The address that sent the proposal on behalf of the multisig.',
        },
        closeButton: 'Okay',
      },
    },
    multisigVote: {
      form: {
        header:
          'After proposing and approving the registration transaction, propose and approve another transaction. Use this form to generate the call data to include in your proposal.',
        subheader:
          'Once the proposer creates the proposal using the command above, N of M signers must also approve the vote proposal.',
        step1: '1) Create the vote proposal',
        step2: '2) Approve the vote proposal',
        multisigAddress: {
          label: 'Multisig Address',
        },
        transactionID: {
          label: 'Transaction ID',
        },
        proposerAddress: {
          label: 'Proposer Address',
        },
        closeButton: 'Okay',
      },
    },
    register: {
      buttons: {
        multisig: 'Register Multisig',
        miner: 'Register Miner',
      },
      title: 'Register',
      start: {
        header: 'Please choose how you want to register',
      },
      finished: {
        header: 'Your wallet is registered. Choose an option below',
      },
    },
    voteFactory: {
      title: 'Create Vote',
      form: {
        fipNumber: {
          label: 'FIP Number',
          invalid: 'Enter the FIP number',
        },
        endDate: {
          label: 'End Date for the vote',
        },
        question: {
          label: 'Question',
          invalid: 'Enter the question to ask',
        },
        yesOptionOne: {
          invalid: 'Enter the text for the yes option',
          label: 'Yes Option 1',
        },
        yesOptionTwo: {
          label: 'Yes Option 2 (optional)',
        },
        lsdToken: {
          label: 'LSD Token',
          invalid: 'Enter a token value',
          addButton: 'Add LSD Token',
        },
      },
    },
    voteActions: {
      latestVoteResults: 'Currente Vote Results',
      winningVote: 'Winning Vote',
      chooseVote: 'Choose Vote',
      registerToVote: 'Register in order to vote',
    },
  },

  messages: {
    noVotingPower: 'No FIL or RBP registered to wallet at this time.',
  },
};
