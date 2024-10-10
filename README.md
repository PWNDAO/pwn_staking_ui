Preview available on: https://pwn-staking-ui.on-fleek.app/ . Together with that we also have IPFS deployment.

## Used addresses:
- $PWN ERC20: https://github.com/PWNDAO/pwn_staking_ui/blob/master/constants/addresses.ts#L8
- $stPWN NFT: https://github.com/PWNDAO/pwn_staking_ui/blob/master/constants/addresses.ts#L13
- $vePWN ERC20: https://github.com/PWNDAO/pwn_staking_ui/blob/master/constants/addresses.ts#L18

## Steps to mint $PWN
1) In `pwn_secrets` repo there is seed for wallet that owns the staking (name is "Shared dev EOA"), import it into the wallet
2) Go to latest $PWN token contract on https://sepolia.etherscan.io
3) Connect the wallet imported in step 1)
4) Go to `Contract` tab -> `Write contract`
5) Find `mint` function and input amount you want to mint (ideally not more than 10000 $PWN), you need to multiply the amount you want to mint by 10^18, so e.g. minting 100 $PWN would mean inputting amount of (100 * 10^18 === 100000000000000000000)
6) Find `transfer` function and input your address to where you want the tokens to transfer to + amount (the same thing with multiplying the amount by 10^18 as above applies also here)
7) You should now see a $PWN token in your wallet:)

## Steps to stake
Prerequisite: have some $PWN tokens in your wallet, guide for this is above

1) Go to latest $PWN token contract on https://sepolia.etherscan.io -> `Contract` -> `Write contract` and find `approve` function and call it with spender address of $vePWN and amount you want to stake (also you should multiply the amount by 10^18 as we do in $PWN minting guide)
2) Go to latest $vePWN token contract on https://sepolia.etherscan.io -> `Contract` -> `Write as Proxy` and find `createStake` function and call it with amount you want to stake (also you should multiply the amount by 10^18 as we do in $PWN minting guide) and lock up epochs (there is 13 epochs in a year)
3) By now you should be staking!:) Mind though that you will get the voting power when a new epoch starts, so not right away. However you should have your staking positions right away, so it only applies to the voting power.
4) You can repeat these steps if you want to test multiple staked positions behaving, etc.

## Epoch changing
In testing version of the UI it's also possible to manually set the epoch, so you can see & test what e.g. voting power you will have in a certain epoch, etc.
