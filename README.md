Preview available on: https://staking.pwn.xyz . Together with that we also have IPFS deployment.

## Used addresses:
- $PWN ERC20: https://github.com/PWNDAO/pwn_staking_ui/blob/master/constants/addresses.ts#L8
- $stPWN NFT: https://github.com/PWNDAO/pwn_staking_ui/blob/master/constants/addresses.ts#L13
- $vePWN ERC20: https://github.com/PWNDAO/pwn_staking_ui/blob/master/constants/addresses.ts#L18

## Testing notes:

### Steeps to get $PWN tokens
Just write to @microHoffman. Or if you are brave enough, you can create a proposal via our DAO on Sepolia, but you will need to wait a certain time for that, so it might be easier and quicker to just write to @microHoffman:).

### Steps to stake
Prerequisite: have some $PWN tokens in your wallet, guide for this is above

1) Go to latest $PWN token contract on https://sepolia.etherscan.io -> `Contract` -> `Write contract` and find `approve` function and call it with spender address of $vePWN and amount you want to stake. Note that you should multiply the amount you want to approve by 10^18 - so for example to approve 100 $PWN you should put 100000000000000000000 amount in the input
2) After you have approved vePWN contract, go to latest $vePWN token contract on https://sepolia.etherscan.io -> `Contract` -> `Write as Proxy` and find `createStake` function and call it with number of epochs you want to lock up (there are 13 epochs in a year, you can stake minimally for 13 epochs, maximally for 130 epochs) and also input amount you want to stake - please note that also here you should multiply the amount by 10^18 as we did in step 1).
3) By now you should be staking!:) Mind though that you will get the voting power when a new epoch starts, so not right away. However you should have your staking positions right away, so it only applies to the voting power.
4) You can repeat these steps if you want to test multiple staked positions behaving, etc.

### Epoch changing
In testing version of the UI it's also possible to manually set the epoch, so you can see & test what e.g. voting power you will have in a certain epoch, etc. In production this should be hidden.
