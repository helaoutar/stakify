https://stakify.vercel.app/

# Staking POC

The app is built using React / Tailwind / Formik / Web3.js / Web3modal

# Features

- See how much you staked
- See how much your earned
- Stake / Unstake / Claim rewards

# How it works

The app first checks if the user has Metamask in their browser, if they do then it uses it as a provider to communicate with the smart contract deployed at `0xfda1cf6261dcabaa29b3e464f78717ffb54b8a63` through Web3.js + the contract ABI.

- Staking uses: `contract.deposit` write method
- Unstaking uses: `contract.withdraw` write method
- Cleaming rewards uses: `contract.claim` write method
- How much tokens the user staked comes from `contract.depositedTokens` read method
- How much the user earned comes from `contract.totalEarnedTokens` read method


Most of the logic is inside `src/hooks/useStaking.ts`
