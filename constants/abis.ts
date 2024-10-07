export const PWN_TOKEN_ABI = [
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_owner",
          "type": "address"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "inputs": [],
      "type": "error",
      "name": "CallerHasNotVoted"
    },
    {
      "inputs": [],
      "type": "error",
      "name": "DecreaseAllowanceNotSupported"
    },
    {
      "inputs": [],
      "type": "error",
      "name": "IncreaseAllowanceNotSupported"
    },
    {
      "inputs": [],
      "type": "error",
      "name": "InvalidVotingReward"
    },
    {
      "inputs": [],
      "type": "error",
      "name": "MintableSupplyExceeded"
    },
    {
      "inputs": [],
      "type": "error",
      "name": "ProposalNotExecuted"
    },
    {
      "inputs": [],
      "type": "error",
      "name": "ProposalRewardAlreadyClaimed"
    },
    {
      "inputs": [],
      "type": "error",
      "name": "ProposalRewardNotAssigned"
    },
    {
      "inputs": [],
      "type": "error",
      "name": "TransfersAlreadyEnabled"
    },
    {
      "inputs": [],
      "type": "error",
      "name": "TransfersDisabled"
    },
    {
      "inputs": [],
      "type": "error",
      "name": "ZeroVotingContract"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "owner",
          "type": "address",
          "indexed": true
        },
        {
          "internalType": "address",
          "name": "spender",
          "type": "address",
          "indexed": true
        },
        {
          "internalType": "uint256",
          "name": "value",
          "type": "uint256",
          "indexed": false
        }
      ],
      "type": "event",
      "name": "Approval",
      "anonymous": false
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "previousOwner",
          "type": "address",
          "indexed": true
        },
        {
          "internalType": "address",
          "name": "newOwner",
          "type": "address",
          "indexed": true
        }
      ],
      "type": "event",
      "name": "OwnershipTransferStarted",
      "anonymous": false
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "previousOwner",
          "type": "address",
          "indexed": true
        },
        {
          "internalType": "address",
          "name": "newOwner",
          "type": "address",
          "indexed": true
        }
      ],
      "type": "event",
      "name": "OwnershipTransferred",
      "anonymous": false
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "votingContract",
          "type": "address",
          "indexed": true
        },
        {
          "internalType": "uint256",
          "name": "proposalId",
          "type": "uint256",
          "indexed": true
        },
        {
          "internalType": "uint256",
          "name": "reward",
          "type": "uint256",
          "indexed": false
        }
      ],
      "type": "event",
      "name": "ProposalRewardAssigned",
      "anonymous": false
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "votingContract",
          "type": "address",
          "indexed": true
        },
        {
          "internalType": "uint256",
          "name": "proposalId",
          "type": "uint256",
          "indexed": true
        },
        {
          "internalType": "address",
          "name": "voter",
          "type": "address",
          "indexed": true
        },
        {
          "internalType": "uint256",
          "name": "voterReward",
          "type": "uint256",
          "indexed": false
        }
      ],
      "type": "event",
      "name": "ProposalRewardClaimed",
      "anonymous": false
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "from",
          "type": "address",
          "indexed": true
        },
        {
          "internalType": "address",
          "name": "to",
          "type": "address",
          "indexed": true
        },
        {
          "internalType": "uint256",
          "name": "value",
          "type": "uint256",
          "indexed": false
        }
      ],
      "type": "event",
      "name": "Transfer",
      "anonymous": false
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "votingContract",
          "type": "address",
          "indexed": true
        },
        {
          "internalType": "uint256",
          "name": "votingReward",
          "type": "uint256",
          "indexed": false
        }
      ],
      "type": "event",
      "name": "VotingRewardSet",
      "anonymous": false
    },
    {
      "inputs": [],
      "stateMutability": "view",
      "type": "function",
      "name": "MAX_VOTING_REWARD",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ]
    },
    {
      "inputs": [],
      "stateMutability": "view",
      "type": "function",
      "name": "MINTABLE_TOTAL_SUPPLY",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ]
    },
    {
      "inputs": [],
      "stateMutability": "view",
      "type": "function",
      "name": "VOTING_REWARD_DENOMINATOR",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ]
    },
    {
      "inputs": [],
      "stateMutability": "nonpayable",
      "type": "function",
      "name": "acceptOwnership"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "owner",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "spender",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "name": "allowance",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ]
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "spender",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function",
      "name": "approve",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ]
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "proposalId",
          "type": "uint256"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function",
      "name": "assignProposalReward"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "account",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "name": "balanceOf",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ]
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function",
      "name": "burn"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "votingContract",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "proposalId",
          "type": "uint256"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function",
      "name": "claimProposalReward"
    },
    {
      "inputs": [],
      "stateMutability": "view",
      "type": "function",
      "name": "decimals",
      "outputs": [
        {
          "internalType": "uint8",
          "name": "",
          "type": "uint8"
        }
      ]
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
      "stateMutability": "pure",
      "type": "function",
      "name": "decreaseAllowance",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ]
    },
    {
      "inputs": [],
      "stateMutability": "nonpayable",
      "type": "function",
      "name": "enableTransfers"
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
      "stateMutability": "pure",
      "type": "function",
      "name": "increaseAllowance",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ]
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function",
      "name": "mint"
    },
    {
      "inputs": [],
      "stateMutability": "view",
      "type": "function",
      "name": "mintedSupply",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ]
    },
    {
      "inputs": [],
      "stateMutability": "view",
      "type": "function",
      "name": "name",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ]
    },
    {
      "inputs": [],
      "stateMutability": "view",
      "type": "function",
      "name": "owner",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ]
    },
    {
      "inputs": [],
      "stateMutability": "view",
      "type": "function",
      "name": "pendingOwner",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ]
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "votingContract",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "proposalId",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "name": "proposalRewards",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "reward",
          "type": "uint256"
        }
      ]
    },
    {
      "inputs": [],
      "stateMutability": "nonpayable",
      "type": "function",
      "name": "renounceOwnership"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "addr",
          "type": "address"
        },
        {
          "internalType": "bool",
          "name": "isAllowed",
          "type": "bool"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function",
      "name": "setTransferAllowlist"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "votingContract",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "votingReward",
          "type": "uint256"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function",
      "name": "setVotingReward"
    },
    {
      "inputs": [],
      "stateMutability": "view",
      "type": "function",
      "name": "symbol",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ]
    },
    {
      "inputs": [],
      "stateMutability": "view",
      "type": "function",
      "name": "totalSupply",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ]
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function",
      "name": "transfer",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ]
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "addr",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "name": "transferAllowlist",
      "outputs": [
        {
          "internalType": "bool",
          "name": "allowed",
          "type": "bool"
        }
      ]
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "from",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function",
      "name": "transferFrom",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ]
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "newOwner",
          "type": "address"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function",
      "name": "transferOwnership"
    },
    {
      "inputs": [],
      "stateMutability": "view",
      "type": "function",
      "name": "transfersEnabled",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ]
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "votingContract",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "name": "votingRewards",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "reward",
          "type": "uint256"
        }
      ]
    }
  ] as const

export const STAKED_PWN_NFT_ABI = [
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_owner",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "_epochClock",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "_supplyManager",
        "type": "address"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "inputs": [],
    "name": "CallerNotSupplyManager",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "TransfersAlreadyEnabled",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "TransfersDisabled",
    "type": "error"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "owner",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "approved",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      }
    ],
    "name": "Approval",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "owner",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "operator",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "bool",
        "name": "approved",
        "type": "bool"
      }
    ],
    "name": "ApprovalForAll",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "previousOwner",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "newOwner",
        "type": "address"
      }
    ],
    "name": "OwnershipTransferStarted",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "previousOwner",
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
        "indexed": true,
        "internalType": "address",
        "name": "from",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      }
    ],
    "name": "Transfer",
    "type": "event"
  },
  {
    "inputs": [],
    "name": "acceptOwnership",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      }
    ],
    "name": "approve",
    "outputs": [],
    "stateMutability": "nonpayable",
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
    "name": "balanceOf",
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
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      }
    ],
    "name": "burn",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "enableTransfers",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "epochClock",
    "outputs": [
      {
        "internalType": "contract PWNEpochClock",
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
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      }
    ],
    "name": "getApproved",
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
        "name": "owner",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "operator",
        "type": "address"
      }
    ],
    "name": "isApprovedForAll",
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
        "name": "to",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      }
    ],
    "name": "mint",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "name",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
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
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      }
    ],
    "name": "ownerOf",
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
    "name": "pendingOwner",
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
    "name": "renounceOwnership",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "from",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      }
    ],
    "name": "safeTransferFrom",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "from",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      },
      {
        "internalType": "bytes",
        "name": "data",
        "type": "bytes"
      }
    ],
    "name": "safeTransferFrom",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "operator",
        "type": "address"
      },
      {
        "internalType": "bool",
        "name": "approved",
        "type": "bool"
      }
    ],
    "name": "setApprovalForAll",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "supplyManager",
    "outputs": [
      {
        "internalType": "contract IStakedPWNSupplyManager",
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
        "internalType": "bytes4",
        "name": "interfaceId",
        "type": "bytes4"
      }
    ],
    "name": "supportsInterface",
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
    "inputs": [],
    "name": "symbol",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      }
    ],
    "name": "tokenURI",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "from",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      }
    ],
    "name": "transferFrom",
    "outputs": [],
    "stateMutability": "nonpayable",
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
    "inputs": [],
    "name": "transfersEnabled",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
] as const

export const VE_PWN_TOKEN_ABI = [
  {
    "inputs": [],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "inputs": [],
    "name": "ApproveDisabled",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "ClaimStakePowerFromSelf",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "DelegateBySigDisabled",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "DelegateDisabled",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "EpochStillRunning",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "InvalidAmount",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "InvalidLockUpPeriod",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "LockUpPeriodMismatch",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "NotStakeBeneficiary",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "NotStakeOwner",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "NothingToIncrease",
    "type": "error"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "lastCalculatedEpoch",
        "type": "uint256"
      }
    ],
    "name": "PowerAlreadyCalculated",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "TransferDisabled",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "TransferFromDisabled",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "WithrawalBeforeLockUpEnd",
    "type": "error"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "owner",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "spender",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "value",
        "type": "uint256"
      }
    ],
    "name": "Approval",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "delegator",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "fromDelegate",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "toDelegate",
        "type": "address"
      }
    ],
    "name": "DelegateChanged",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "delegate",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "previousBalance",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "newBalance",
        "type": "uint256"
      }
    ],
    "name": "DelegateVotesChanged",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint8",
        "name": "version",
        "type": "uint8"
      }
    ],
    "name": "Initialized",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "stakeId",
        "type": "uint256"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "staker",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "beneficiary",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "lockUpEpochs",
        "type": "uint256"
      }
    ],
    "name": "StakeCreated",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "stakeId",
        "type": "uint256"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "staker",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "additionalAmount",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "newAmount",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "additionalEpochs",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "newEpochs",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "newStakeId",
        "type": "uint256"
      }
    ],
    "name": "StakeIncreased",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "stakeId1",
        "type": "uint256"
      },
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "stakeId2",
        "type": "uint256"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "staker",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "lockUpEpochs",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "newStakeId",
        "type": "uint256"
      }
    ],
    "name": "StakeMerged",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "stakeId",
        "type": "uint256"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "originalBeneficiary",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "newBeneficiary",
        "type": "address"
      }
    ],
    "name": "StakePowerClaimed",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "stakeId",
        "type": "uint256"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "staker",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "amount1",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "amount2",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "newStakeId1",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "newStakeId2",
        "type": "uint256"
      }
    ],
    "name": "StakeSplit",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "stakeId",
        "type": "uint256"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "staker",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "StakeWithdrawn",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "epoch",
        "type": "uint256"
      }
    ],
    "name": "TotalPowerCalculated",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "from",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "value",
        "type": "uint256"
      }
    ],
    "name": "Transfer",
    "type": "event"
  },
  {
    "inputs": [],
    "name": "CLOCK_MODE",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "pure",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "EPOCHS_IN_YEAR",
    "outputs": [
      {
        "internalType": "uint8",
        "name": "",
        "type": "uint8"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "TOTAL_POWER_NAMESPACE",
    "outputs": [
      {
        "internalType": "bytes32",
        "name": "",
        "type": "bytes32"
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
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "name": "allowance",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "pure",
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
    "name": "approve",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "pure",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "account",
        "type": "address"
      }
    ],
    "name": "balanceOf",
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
        "name": "",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "beneficiaryOfStakes",
    "outputs": [
      {
        "internalType": "uint16",
        "name": "epoch",
        "type": "uint16"
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
    "inputs": [],
    "name": "calculateTotalPower",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "epoch",
        "type": "uint256"
      }
    ],
    "name": "calculateTotalPowerUpTo",
    "outputs": [],
    "stateMutability": "nonpayable",
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
        "name": "currentBeneficiary",
        "type": "address"
      }
    ],
    "name": "claimStakePower",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "clock",
    "outputs": [
      {
        "internalType": "uint48",
        "name": "",
        "type": "uint48"
      }
    ],
    "stateMutability": "view",
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
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "staker",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "beneficiary",
        "type": "address"
      },
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
    "name": "createStakeOnBehalfOf",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "stakeId",
        "type": "uint256"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "decimals",
    "outputs": [
      {
        "internalType": "uint8",
        "name": "",
        "type": "uint8"
      }
    ],
    "stateMutability": "pure",
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
    "name": "delegate",
    "outputs": [],
    "stateMutability": "pure",
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
      },
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      },
      {
        "internalType": "uint8",
        "name": "",
        "type": "uint8"
      },
      {
        "internalType": "bytes32",
        "name": "",
        "type": "bytes32"
      },
      {
        "internalType": "bytes32",
        "name": "",
        "type": "bytes32"
      }
    ],
    "name": "delegateBySig",
    "outputs": [],
    "stateMutability": "pure",
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
    "name": "delegates",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "pure",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "epochClock",
    "outputs": [
      {
        "internalType": "contract PWNEpochClock",
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
        "internalType": "uint256",
        "name": "epoch",
        "type": "uint256"
      }
    ],
    "name": "getPastTotalSupply",
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
        "name": "account",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "epoch",
        "type": "uint256"
      }
    ],
    "name": "getPastVotes",
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
        "name": "account",
        "type": "address"
      }
    ],
    "name": "getVotes",
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
        "internalType": "uint256",
        "name": "stakeId",
        "type": "uint256"
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
        "internalType": "address",
        "name": "_pwnToken",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "_stakedPWN",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "_epochClock",
        "type": "address"
      }
    ],
    "name": "initialize",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "lastCalculatedTotalPowerEpoch",
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
    "name": "lastStakeId",
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
        "internalType": "uint256",
        "name": "stakeId1",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "stakeId2",
        "type": "uint256"
      }
    ],
    "name": "mergeStakes",
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
    "inputs": [],
    "name": "name",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "pure",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "pwnToken",
    "outputs": [
      {
        "internalType": "contract PWN",
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
        "internalType": "uint256",
        "name": "stakeId",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "splitAmount",
        "type": "uint256"
      }
    ],
    "name": "splitStake",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "newStakeId1",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "newStakeId2",
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
        "name": "stakeId",
        "type": "uint256"
      }
    ],
    "name": "stakeMetadata",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "initialEpoch",
        "type": "uint256"
      },
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
    "name": "stakePowers",
    "outputs": [
      {
        "components": [
          {
            "internalType": "uint16",
            "name": "epoch",
            "type": "uint16"
          },
          {
            "internalType": "int104",
            "name": "power",
            "type": "int104"
          }
        ],
        "internalType": "struct VoteEscrowedPWNPower.EpochPower[]",
        "name": "powers",
        "type": "tuple[]"
      }
    ],
    "stateMutability": "pure",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "stakedPWN",
    "outputs": [
      {
        "internalType": "contract StakedPWN",
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
      }
    ],
    "name": "stakes",
    "outputs": [
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
        "internalType": "uint104",
        "name": "amount",
        "type": "uint104"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "symbol",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "pure",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "epoch",
        "type": "uint256"
      }
    ],
    "name": "totalPowerAt",
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
        "internalType": "uint256[]",
        "name": "epochs",
        "type": "uint256[]"
      }
    ],
    "name": "totalPowers",
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
    "inputs": [],
    "name": "totalSupply",
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
        "name": "",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "transfer",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "pure",
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
    "name": "transferFrom",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "pure",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "stakeId",
        "type": "uint256"
      }
    ],
    "name": "withdrawStake",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
] as const

export const EPOCH_CLOCK_ABI = [
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "initialEpochTimestamp",
        "type": "uint256"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "currentTimestamp",
        "type": "uint256"
      }
    ],
    "name": "InitialEpochTimestampInFuture",
    "type": "error"
  },
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
    "name": "SECONDS_IN_EPOCH",
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
