// https://github.com/PWNDAO/pwn_dao/blob/main/src/token/vePWN/VoteEscrowedPWNStorage.sol#L36
export interface StakeDetail {
    id: bigint
    initialEpoch: number
    lockUpEpochs: number
    amount: bigint
}

export interface PowerInEpoch {
    epoch: bigint
    power: bigint
}
