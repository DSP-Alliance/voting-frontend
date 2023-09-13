# Web3 Technical Requirements

For the user to interact with the filecoin blockchain they must have some type of browser wallet. There are some predefined connectors used in the wagmi package that will prompt up 4 different types of browser wallets. This is what is needed for the user to make transactions to send the filecoin chain.

The frontend also needs to read some data from the chain as well. The are two types of clients for this. Defined in `src/services/clients.ts` there is a `publicClient` and a `walletClient`. The public client is for making read only calls to the chain. The wallet client is for prompting the user to sign and send a transaction to the chain.

## Wallet Connection

In most typical web3 websites there will be a button in the top right labeled "Connect Wallet". The user clicks this and a modal pops up prompt which wallet provider the user is using. The current ones are metamask and coinbase wallet.

The `useConnect` hook in `src/components/ConnectWallet.tsx:14` supplies us with a connect function. When this function is called the wallet will prompt the user to connect an address to the website.

This address, after connection will, will be supplied by the `useAccount` hook. This is the connected user's address.

## Contract Functionality

The backend contract works in two seperate parts. There is a vote factory contract and another contract for vote tracking. The factory can spawn any number of vote tracking contracts. The addresses of these vote tracking contracts can be looked up from the factory contract.

Filecoin smart contracts have an interface called an ABI (Application binary interface) which is used to define what methods are available to be called on the contract. The ABI for the factory is defined at `src/assets/voteFactory.ts` and the ABI for the vote tracking contract is defined at `src/assets/voteTracker.ts`.

## Vote Factory

This factory contract is only usable by 1 address. This address known as the `owner` can be looked up from the factory contract.

Exposed only to the owner of the factory contract is a method called `startVote`. This function takes 4 arguments, the length of the vote in seconds (u32), the Filecoin Improvement Proposal (FIP) number (u64), a choice of if the vote will have two yes vote options (bool), and a list of tokens (address[]). An address is 20 bytes of hex. This method should only appear if the user connected to the website is the owner.

A function read call can be made like:

```typescript
import { publicClient, walletClient } from './assets/clients';
import { factory } from './assets/factory';

let owner = await publicClient.readContract({
  abi: factory.abi,
  address: factory.address,
  functionName: 'owner',
});
```

A send transaction can be made like:
`function startVote(uint64 fip, uint32 length, bool twoYesOptions, address[] lsdTokens)`

```typescript
const res = await walletClient.writeContract({
  abi: abi,
  address: factory.address,
  functionName: 'startVote',
  account: address,
  args: [fip, length, twoYesOptions, lsdTokens],
});
```

## Vote Tracker

The vote tracker allows any user to vote on the FIP on the contract.

### User sending transactions

The vote parameter encoding is determined by a modulo of the number. Ideally this is to somewhat protect the privacy of the user by making the inputting vote parameter seemingly random.

A pseudocode example of vote decoding

```C
bool doubleYesVote;
switch (vote % 3) {
    // yes Vote
    case(0) => {
        // If we have two yes options then (vote % 6) can only equal 0 or 3
        if doubleYesVote && vote % 6 >= 3 {
            // If it is 3 then it is for option 2
            yesVoteOption2 += weight;
        } else {
            // If it is 0 or there is no second yes option
            yesVoteOption1 += weight;
        }
    }
    // no Vote
    case(1) => noVote += weight;
    // abstain Vote
    case(2) => abstainVote += weight;
}
```

`function voteAndRegister(uint256 vote, address glifPool, uint64[] calldata minerIds)`

```typescript
const res = await walletClient.writeContract({
  abi: abi,
  address: factory.address,
  functionName: 'voteAndRegister',
  account: address,
  args: [vote, glifPool, minerIds],
});
```

This function will return a uint256 that represents the weight of their vote.

### Read only Info

getVoteResults

This function will return the vote results after the voting period is over. If the vote is not over then this call will revert. If two yes vote options was not selected on initialization then `yesVoteOption2` will return 0

```typescript
let yesVotes,
  yesVotesOption2,
  noVotes,
  abstainVotes = await publicClient.readContract({
    abi: factory.abi,
    address: factory.address,
    functionName: 'getVoteResults',
  });
```

voteStart

This function will return the unix time that the vote began

```typescript
let voteStart = await publicClient.readContract({
  abi: factory.abi,
  address: factory.address,
  functionName: 'voteStart',
});
```

voteLength

This function will return the time in seconds of the length of the vote

```typescript
let voteLength = await publicClient.readContract({
  abi: factory.abi,
  address: factory.address,
  functionName: 'voteLength',
});
```

### Only Owner Functions

These functions are only callable by the owner and they mutate the state of the voting contract

A prompt for these functions should only show up if the user is the owner of the contract

`function addLSDToken(address token)`

```typescript
const res = await walletClient.writeContract({
  abi: abi,
  address: factory.address,
  functionName: 'addLSDToken',
  account: address,
  args: [token],
});
```

`function removeLSDToken(uint index)`

```typescript
const res = await walletClient.writeContract({
  abi: abi,
  address: factory.address,
  functionName: 'removeLSDToken',
  account: address,
  args: [index],
});
```
