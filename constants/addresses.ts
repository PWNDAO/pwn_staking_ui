import type { Address } from "viem";

// TODO remove the undefined after the DAO is deployed to mainnet
type ContractAddressRegistry = Record<1 | 11155111, Address | undefined>

export const PWN_TOKEN: ContractAddressRegistry = {
    1: undefined,
    11155111: '0xDBdb041842407c109F65b23eA86D99c1E0D94522'
}

export const STAKED_PWN_NFT: ContractAddressRegistry = {
    1: undefined,
    11155111: '0x2277c872A63FA7b2759173cdcfF693435532B4e4'
}

export const VE_PWN_TOKEN: ContractAddressRegistry = {
    1: undefined,
    11155111: '0xd65404695a101B4FD476f4F2222F68917f96b911'
}

export const EPOCH_CLOCK: ContractAddressRegistry = {
    1: undefined,
    11155111: '0x19e3293196aee99BB3080f28B9D3b4ea7F232b8d'
}