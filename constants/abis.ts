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
  {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "stakeId",
                "type": "uint256"
            },
            {
                "internalType": "address",
                "name": "stakeBeneficiary",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "additionalAmount",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "additionalEpochs",
                "type": "uint256"
            }
        ],
        "name": "increaseStake",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "newStakeId",
                "type": "uint256"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
    },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "lockUpEpochs",
        "type": "uint256"
      }
    ],
    "name": "createStake",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "nonpayable",
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

// https://github.com/PWNDAO/pwn_dao_vesting/blob/main/src/PWNVestingManager.sol
export const PWN_VESTING_MANAGER_ABI = [
  {
     "type":"function",
     "name":"claimVesting",
     "inputs":[
        {
           "name":"unlockEpoch",
           "type":"uint256",
           "internalType":"uint256"
        }
     ],
     "outputs":[

     ],
     "stateMutability":"nonpayable"
  },
  {
    "type":"event",
    "name":"VestingDeleted",
    "inputs":[
       {
          "name":"owner",
          "type":"address",
          "indexed":true,
          "internalType":"address"
       },
       {
          "name":"amount",
          "type":"uint256",
          "indexed":true,
          "internalType":"uint256"
       },
       {
          "name":"unlockEpoch",
          "type":"uint256",
          "indexed":true,
          "internalType":"uint256"
       }
    ],
    "anonymous":false
 },
  {
     "type":"function",
     "name":"upgradeToStake",
     "inputs":[
        {
           "name":"unlockEpoch",
           "type":"uint256",
           "internalType":"uint256"
        },
        {
           "name":"stakeLockUpEpochs",
           "type":"uint256",
           "internalType":"uint256"
        }
     ],
     "outputs":[
        {
           "name":"stakeId",
           "type":"uint256",
           "internalType":"uint256"
        }
     ],
     "stateMutability":"nonpayable"
  },
  {
     "type":"event",
     "name":"VestingCreated",
     "inputs":[
        {
           "name":"owner",
           "type":"address",
           "indexed":true,
           "internalType":"address"
        },
        {
           "name":"amount",
           "type":"uint256",
           "indexed":true,
           "internalType":"uint256"
        },
        {
           "name":"unlockEpoch",
           "type":"uint256",
           "indexed":true,
           "internalType":"uint256"
        },
        {
           "name":"initialEpoch",
           "type":"uint256",
           "indexed":false,
           "internalType":"uint256"
        }
     ],
     "anonymous":false
  },
] as const

// GnosisSafeL2 contract version 1.3.0, 0x3e5c63644e683549055b9be8653de26e0b4cd36e
export const safeWalletAbi = [
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                internalType: 'address',
                name: 'owner',
                type: 'address',
            },
        ],
        name: 'AddedOwner',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: 'bytes32',
                name: 'approvedHash',
                type: 'bytes32',
            },
            {
                indexed: true,
                internalType: 'address',
                name: 'owner',
                type: 'address',
            },
        ],
        name: 'ApproveHash',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                internalType: 'address',
                name: 'handler',
                type: 'address',
            },
        ],
        name: 'ChangedFallbackHandler',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                internalType: 'address',
                name: 'guard',
                type: 'address',
            },
        ],
        name: 'ChangedGuard',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                internalType: 'uint256',
                name: 'threshold',
                type: 'uint256',
            },
        ],
        name: 'ChangedThreshold',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                internalType: 'address',
                name: 'module',
                type: 'address',
            },
        ],
        name: 'DisabledModule',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                internalType: 'address',
                name: 'module',
                type: 'address',
            },
        ],
        name: 'EnabledModule',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                internalType: 'bytes32',
                name: 'txHash',
                type: 'bytes32',
            },
            {
                indexed: false,
                internalType: 'uint256',
                name: 'payment',
                type: 'uint256',
            },
        ],
        name: 'ExecutionFailure',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: 'address',
                name: 'module',
                type: 'address',
            },
        ],
        name: 'ExecutionFromModuleFailure',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: 'address',
                name: 'module',
                type: 'address',
            },
        ],
        name: 'ExecutionFromModuleSuccess',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                internalType: 'bytes32',
                name: 'txHash',
                type: 'bytes32',
            },
            {
                indexed: false,
                internalType: 'uint256',
                name: 'payment',
                type: 'uint256',
            },
        ],
        name: 'ExecutionSuccess',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                internalType: 'address',
                name: 'owner',
                type: 'address',
            },
        ],
        name: 'RemovedOwner',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                internalType: 'address',
                name: 'module',
                type: 'address',
            },
            {
                indexed: false,
                internalType: 'address',
                name: 'to',
                type: 'address',
            },
            {
                indexed: false,
                internalType: 'uint256',
                name: 'value',
                type: 'uint256',
            },
            {
                indexed: false,
                internalType: 'bytes',
                name: 'data',
                type: 'bytes',
            },
            {
                indexed: false,
                internalType: 'enum Enum.Operation',
                name: 'operation',
                type: 'uint8',
            },
        ],
        name: 'SafeModuleTransaction',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                internalType: 'address',
                name: 'to',
                type: 'address',
            },
            {
                indexed: false,
                internalType: 'uint256',
                name: 'value',
                type: 'uint256',
            },
            {
                indexed: false,
                internalType: 'bytes',
                name: 'data',
                type: 'bytes',
            },
            {
                indexed: false,
                internalType: 'enum Enum.Operation',
                name: 'operation',
                type: 'uint8',
            },
            {
                indexed: false,
                internalType: 'uint256',
                name: 'safeTxGas',
                type: 'uint256',
            },
            {
                indexed: false,
                internalType: 'uint256',
                name: 'baseGas',
                type: 'uint256',
            },
            {
                indexed: false,
                internalType: 'uint256',
                name: 'gasPrice',
                type: 'uint256',
            },
            {
                indexed: false,
                internalType: 'address',
                name: 'gasToken',
                type: 'address',
            },
            {
                indexed: false,
                internalType: 'address payable',
                name: 'refundReceiver',
                type: 'address',
            },
            {
                indexed: false,
                internalType: 'bytes',
                name: 'signatures',
                type: 'bytes',
            },
            {
                indexed: false,
                internalType: 'bytes',
                name: 'additionalInfo',
                type: 'bytes',
            },
        ],
        name: 'SafeMultiSigTransaction',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: 'address',
                name: 'sender',
                type: 'address',
            },
            {
                indexed: false,
                internalType: 'uint256',
                name: 'value',
                type: 'uint256',
            },
        ],
        name: 'SafeReceived',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: 'address',
                name: 'initiator',
                type: 'address',
            },
            {
                indexed: false,
                internalType: 'address[]',
                name: 'owners',
                type: 'address[]',
            },
            {
                indexed: false,
                internalType: 'uint256',
                name: 'threshold',
                type: 'uint256',
            },
            {
                indexed: false,
                internalType: 'address',
                name: 'initializer',
                type: 'address',
            },
            {
                indexed: false,
                internalType: 'address',
                name: 'fallbackHandler',
                type: 'address',
            },
        ],
        name: 'SafeSetup',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: 'bytes32',
                name: 'msgHash',
                type: 'bytes32',
            },
        ],
        name: 'SignMsg',
        type: 'event',
    },
    {
        stateMutability: 'nonpayable',
        type: 'fallback',
    },
    {
        inputs: [],
        name: 'VERSION',
        outputs: [
            {
                internalType: 'string',
                name: '',
                type: 'string',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'owner',
                type: 'address',
            },
            {
                internalType: 'uint256',
                name: '_threshold',
                type: 'uint256',
            },
        ],
        name: 'addOwnerWithThreshold',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'bytes32',
                name: 'hashToApprove',
                type: 'bytes32',
            },
        ],
        name: 'approveHash',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: '',
                type: 'address',
            },
            {
                internalType: 'bytes32',
                name: '',
                type: 'bytes32',
            },
        ],
        name: 'approvedHashes',
        outputs: [
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'uint256',
                name: '_threshold',
                type: 'uint256',
            },
        ],
        name: 'changeThreshold',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'bytes32',
                name: 'dataHash',
                type: 'bytes32',
            },
            {
                internalType: 'bytes',
                name: 'data',
                type: 'bytes',
            },
            {
                internalType: 'bytes',
                name: 'signatures',
                type: 'bytes',
            },
            {
                internalType: 'uint256',
                name: 'requiredSignatures',
                type: 'uint256',
            },
        ],
        name: 'checkNSignatures',
        outputs: [],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'bytes32',
                name: 'dataHash',
                type: 'bytes32',
            },
            {
                internalType: 'bytes',
                name: 'data',
                type: 'bytes',
            },
            {
                internalType: 'bytes',
                name: 'signatures',
                type: 'bytes',
            },
        ],
        name: 'checkSignatures',
        outputs: [],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'prevModule',
                type: 'address',
            },
            {
                internalType: 'address',
                name: 'module',
                type: 'address',
            },
        ],
        name: 'disableModule',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [],
        name: 'domainSeparator',
        outputs: [
            {
                internalType: 'bytes32',
                name: '',
                type: 'bytes32',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'module',
                type: 'address',
            },
        ],
        name: 'enableModule',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'to',
                type: 'address',
            },
            {
                internalType: 'uint256',
                name: 'value',
                type: 'uint256',
            },
            {
                internalType: 'bytes',
                name: 'data',
                type: 'bytes',
            },
            {
                internalType: 'enum Enum.Operation',
                name: 'operation',
                type: 'uint8',
            },
            {
                internalType: 'uint256',
                name: 'safeTxGas',
                type: 'uint256',
            },
            {
                internalType: 'uint256',
                name: 'baseGas',
                type: 'uint256',
            },
            {
                internalType: 'uint256',
                name: 'gasPrice',
                type: 'uint256',
            },
            {
                internalType: 'address',
                name: 'gasToken',
                type: 'address',
            },
            {
                internalType: 'address',
                name: 'refundReceiver',
                type: 'address',
            },
            {
                internalType: 'uint256',
                name: '_nonce',
                type: 'uint256',
            },
        ],
        name: 'encodeTransactionData',
        outputs: [
            {
                internalType: 'bytes',
                name: '',
                type: 'bytes',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'to',
                type: 'address',
            },
            {
                internalType: 'uint256',
                name: 'value',
                type: 'uint256',
            },
            {
                internalType: 'bytes',
                name: 'data',
                type: 'bytes',
            },
            {
                internalType: 'enum Enum.Operation',
                name: 'operation',
                type: 'uint8',
            },
            {
                internalType: 'uint256',
                name: 'safeTxGas',
                type: 'uint256',
            },
            {
                internalType: 'uint256',
                name: 'baseGas',
                type: 'uint256',
            },
            {
                internalType: 'uint256',
                name: 'gasPrice',
                type: 'uint256',
            },
            {
                internalType: 'address',
                name: 'gasToken',
                type: 'address',
            },
            {
                internalType: 'address payable',
                name: 'refundReceiver',
                type: 'address',
            },
            {
                internalType: 'bytes',
                name: 'signatures',
                type: 'bytes',
            },
        ],
        name: 'execTransaction',
        outputs: [
            {
                internalType: 'bool',
                name: '',
                type: 'bool',
            },
        ],
        stateMutability: 'payable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'to',
                type: 'address',
            },
            {
                internalType: 'uint256',
                name: 'value',
                type: 'uint256',
            },
            {
                internalType: 'bytes',
                name: 'data',
                type: 'bytes',
            },
            {
                internalType: 'enum Enum.Operation',
                name: 'operation',
                type: 'uint8',
            },
        ],
        name: 'execTransactionFromModule',
        outputs: [
            {
                internalType: 'bool',
                name: 'success',
                type: 'bool',
            },
        ],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'to',
                type: 'address',
            },
            {
                internalType: 'uint256',
                name: 'value',
                type: 'uint256',
            },
            {
                internalType: 'bytes',
                name: 'data',
                type: 'bytes',
            },
            {
                internalType: 'enum Enum.Operation',
                name: 'operation',
                type: 'uint8',
            },
        ],
        name: 'execTransactionFromModuleReturnData',
        outputs: [
            {
                internalType: 'bool',
                name: 'success',
                type: 'bool',
            },
            {
                internalType: 'bytes',
                name: 'returnData',
                type: 'bytes',
            },
        ],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [],
        name: 'getChainId',
        outputs: [
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'start',
                type: 'address',
            },
            {
                internalType: 'uint256',
                name: 'pageSize',
                type: 'uint256',
            },
        ],
        name: 'getModulesPaginated',
        outputs: [
            {
                internalType: 'address[]',
                name: 'array',
                type: 'address[]',
            },
            {
                internalType: 'address',
                name: 'next',
                type: 'address',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'getOwners',
        outputs: [
            {
                internalType: 'address[]',
                name: '',
                type: 'address[]',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'uint256',
                name: 'offset',
                type: 'uint256',
            },
            {
                internalType: 'uint256',
                name: 'length',
                type: 'uint256',
            },
        ],
        name: 'getStorageAt',
        outputs: [
            {
                internalType: 'bytes',
                name: '',
                type: 'bytes',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'getThreshold',
        outputs: [
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'to',
                type: 'address',
            },
            {
                internalType: 'uint256',
                name: 'value',
                type: 'uint256',
            },
            {
                internalType: 'bytes',
                name: 'data',
                type: 'bytes',
            },
            {
                internalType: 'enum Enum.Operation',
                name: 'operation',
                type: 'uint8',
            },
            {
                internalType: 'uint256',
                name: 'safeTxGas',
                type: 'uint256',
            },
            {
                internalType: 'uint256',
                name: 'baseGas',
                type: 'uint256',
            },
            {
                internalType: 'uint256',
                name: 'gasPrice',
                type: 'uint256',
            },
            {
                internalType: 'address',
                name: 'gasToken',
                type: 'address',
            },
            {
                internalType: 'address',
                name: 'refundReceiver',
                type: 'address',
            },
            {
                internalType: 'uint256',
                name: '_nonce',
                type: 'uint256',
            },
        ],
        name: 'getTransactionHash',
        outputs: [
            {
                internalType: 'bytes32',
                name: '',
                type: 'bytes32',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'module',
                type: 'address',
            },
        ],
        name: 'isModuleEnabled',
        outputs: [
            {
                internalType: 'bool',
                name: '',
                type: 'bool',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'owner',
                type: 'address',
            },
        ],
        name: 'isOwner',
        outputs: [
            {
                internalType: 'bool',
                name: '',
                type: 'bool',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'nonce',
        outputs: [
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'prevOwner',
                type: 'address',
            },
            {
                internalType: 'address',
                name: 'owner',
                type: 'address',
            },
            {
                internalType: 'uint256',
                name: '_threshold',
                type: 'uint256',
            },
        ],
        name: 'removeOwner',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'to',
                type: 'address',
            },
            {
                internalType: 'uint256',
                name: 'value',
                type: 'uint256',
            },
            {
                internalType: 'bytes',
                name: 'data',
                type: 'bytes',
            },
            {
                internalType: 'enum Enum.Operation',
                name: 'operation',
                type: 'uint8',
            },
        ],
        name: 'requiredTxGas',
        outputs: [
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256',
            },
        ],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'handler',
                type: 'address',
            },
        ],
        name: 'setFallbackHandler',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'guard',
                type: 'address',
            },
        ],
        name: 'setGuard',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address[]',
                name: '_owners',
                type: 'address[]',
            },
            {
                internalType: 'uint256',
                name: '_threshold',
                type: 'uint256',
            },
            {
                internalType: 'address',
                name: 'to',
                type: 'address',
            },
            {
                internalType: 'bytes',
                name: 'data',
                type: 'bytes',
            },
            {
                internalType: 'address',
                name: 'fallbackHandler',
                type: 'address',
            },
            {
                internalType: 'address',
                name: 'paymentToken',
                type: 'address',
            },
            {
                internalType: 'uint256',
                name: 'payment',
                type: 'uint256',
            },
            {
                internalType: 'address payable',
                name: 'paymentReceiver',
                type: 'address',
            },
        ],
        name: 'setup',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'bytes32',
                name: '',
                type: 'bytes32',
            },
        ],
        name: 'signedMessages',
        outputs: [
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'targetContract',
                type: 'address',
            },
            {
                internalType: 'bytes',
                name: 'calldataPayload',
                type: 'bytes',
            },
        ],
        name: 'simulateAndRevert',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'prevOwner',
                type: 'address',
            },
            {
                internalType: 'address',
                name: 'oldOwner',
                type: 'address',
            },
            {
                internalType: 'address',
                name: 'newOwner',
                type: 'address',
            },
        ],
        name: 'swapOwner',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        stateMutability: 'payable',
        type: 'receive',
    },
] as const
