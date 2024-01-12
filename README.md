# Voting Tool Usage

## Starting Vote

Users with wallet addresses authorized to initiate voting will see the "Start Vote" button upon logging in and connecting through MetaMask. Clicking this button will bring up the "Create Vote" popup.

### Create Vote Options

#### FIP Number
The individual starting the vote (hereinafter referred to as the "vote starter") will input the FIP number for which they want to initiate a vote. It is imperative that this FIP exists within the official Filecoin GitHub repository. The entrant needs to provide only the FIP number; for instance, if the intention is to start a vote for FIP 0001, they would simply input '1.' The system will automatically retrieve and display the FIP's number, title, authors, status, and discussion link on the site during the voting process.

#### Length of Vote Time (in minutes)
This field specifies the duration of the vote in minutes. Voting commences immediately upon submission of the "Start Vote" transaction. Originally designed for testing scenarios, we recommend establishing a standard voting timeframe to maintain consistency.

#### Question
Vote starters will articulate the question to be voted on in this section. All questions will present voting options, ensuring the inclusion of at least one "Yes" option, a secondary "Yes" option, "No," and "Abstain."

#### Yes Option 1
Details of the primary "Yes" option.

#### Yes Option 2
Details of the secondary "Yes" option.

#### LSD Tokens
By default, the site incorporates the stFIL token address. As the Filecoin ecosystem evolves to include more Liquid Staking Tokens, users have the facility to click "Add LSD Token" for incorporating additional tokens as required. These tokens will participate in votes, carrying equivalent weight to FIL.

Upon clicking "Start Vote," the vote starter will be prompted to sign a MetaMask transaction. The "Create Vote" popup will automatically close following the on-chain completion of the transaction.

## Voter Registration

Users are obligated to vote once post-registration, enabling them to participate in subsequent FIP votes without re-registering, unless they opt to include additional miners. In that scenario, registration of the new miner is requisite for inclusion.

### Token Holder
Token holders will select "Register to Vote," triggering a display of their token balance to verify accuracy and confirm that the correct wallet is in use. Post-vote, the system retrieves and tallies the token balance, preventing a scenario where users transfer tokens post-voting for re-participation.

### Self-Owned Miner
Prior to voting, users must select "Register Miner." The following information will be required:

- **Voter Address:** Provide the MetaMask address intended for voting.
- **Miner ID:** Input Miner ID. For those with multiple miners, this step is repeatable as necessary.
- **Registration Command:** Paste this command into your wallet’s CLI to sign a transaction, thereby authenticating ownership and associating your miner with the previously provided MetaMask address.

### Glif Agent
To synchronize your Glif Agent and any associated miners, import the wallet used for creating the Glif Agent into MetaMask. During the voting registration, check the box labeled “Add Agent Address?” and input your agent’s ETH Address in the subsequent field. Locate this ETH Address on [filfox.info](https://filfox.info), viewable under "ETH Address" post-searching your Agent address.

### Multisig
For voting registration with a Multisig wallet, click “Register Multisig.” A popup entitled "Register Multisig" will appear, necessitating the following:
#### Multisig Address & Command

Input your multisig address in the designated field. Upon doing so, a command tailored to your address will be generated, which you will need to paste into the Lotus wallet CLI. This process enables each multisig holder to register the wallet for participation in the voting process.

#### Vote Option and Command
During active voting, each multisig signer must specify their voting preference. After selecting from the dropdown menu, signers can copy the command into the Lotus CLI, thereby validating their selection.







