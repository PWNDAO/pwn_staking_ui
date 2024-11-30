
// when adding/editing ABIs, add here only
//  functions/events that you are working with

export const VE_PWN_TOKEN_ABI = [
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "staker",
        "type": "address"
      },
      {
        "internalType": "uint16",
        "name": "epoch",
        "type": "uint16"
      }
    ],
    "name": "beneficiaryOfStakesAt",
    "outputs": [
      {
        "internalType": "uint256[]",
        "name": "",
        "type": "uint256[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256[]",
        "name": "stakeIds",
        "type": "uint256[]"
      }
    ],
    "name": "getStakes",
    "outputs": [
      {
        "components": [
          {
            "internalType": "uint256",
            "name": "stakeId",
            "type": "uint256"
          },
          {
            "internalType": "address",
            "name": "owner",
            "type": "address"
          },
          {
            "internalType": "uint16",
            "name": "initialEpoch",
            "type": "uint16"
          },
          {
            "internalType": "uint8",
            "name": "lockUpEpochs",
            "type": "uint8"
          },
          {
            "internalType": "uint8",
            "name": "remainingEpochs",
            "type": "uint8"
          },
          {
            "internalType": "uint8",
            "name": "currentMultiplier",
            "type": "uint8"
          },
          {
            "internalType": "uint104",
            "name": "amount",
            "type": "uint104"
          }
        ],
        "internalType": "struct VoteEscrowedPWNStake.StakeData[]",
        "name": "stakeData",
        "type": "tuple[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "staker",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "epoch",
        "type": "uint256"
      }
    ],
    "name": "stakerPowerAt",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
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
        "name": "staker",
        "type": "address"
      },
      {
        "internalType": "uint256[]",
        "name": "epochs",
        "type": "uint256[]"
      }
    ],
    "name": "stakerPowers",
    "outputs": [
      {
        "internalType": "uint256[]",
        "name": "",
        "type": "uint256[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
] as const

export const EPOCH_CLOCK_ABI = [
  {
    "inputs": [],
    "name": "INITIAL_EPOCH_TIMESTAMP",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "currentEpoch",
    "outputs": [
      {
        "internalType": "uint16",
        "name": "",
        "type": "uint16"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
] as const
