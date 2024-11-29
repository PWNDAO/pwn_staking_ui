import type { Address } from "viem";
import type { SupportedChain } from "./chain";

type ContractAddressRegistry = Record<SupportedChain, Address>

export const PWN_TOKEN = {
    1: '0x1D9e1fB11491CA43496c9F4612aAB6530956BC0c',
    11155111: '0x0FE826395b1971d80A94543613E56a8b2fDF3d11'
} as const satisfies ContractAddressRegistry

export const STAKED_PWN_NFT = {
    1: '0x9cA849625fC30Ed43d1f9ce9b7C0078f34Ac1Bc7',
    11155111: '0x8767F9349786141457be98E1deAdD6C4975F50DF'
} as const satisfies ContractAddressRegistry

export const VE_PWN_TOKEN = {
    1: '0xf4919077ff9e833B5560123428D8b9FEC01c13C1',
    11155111: '0xBF7105C7f1cB7CB556Ad2754636f8C8D9707029e'
} as const satisfies ContractAddressRegistry

export const EPOCH_CLOCK = {
    1: '0xb9962f81Ad51Df9fcfd14400fB0A10E665b7cF11',
    11155111: '0x19e3293196aee99BB3080f28B9D3b4ea7F232b8d'
} as const satisfies ContractAddressRegistry