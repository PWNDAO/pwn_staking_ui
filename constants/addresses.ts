import type { Address } from "viem";

// TODO remove the undefined after the DAO is deployed to mainnet
type ContractAddressRegistry = Record<1 | 11155111, Address | undefined>

export const PWN_TOKEN: ContractAddressRegistry = {
    1: undefined,
    11155111: '0x0FE826395b1971d80A94543613E56a8b2fDF3d11'
}

export const STAKED_PWN_NFT: ContractAddressRegistry = {
    1: undefined,
    11155111: '0x8767F9349786141457be98E1deAdD6C4975F50DF'
}

export const VE_PWN_TOKEN: ContractAddressRegistry = {
    1: undefined,
    11155111: '0xBF7105C7f1cB7CB556Ad2754636f8C8D9707029e'
}

export const EPOCH_CLOCK: ContractAddressRegistry = {
    1: undefined,
    11155111: '0x19e3293196aee99BB3080f28B9D3b4ea7F232b8d'
}