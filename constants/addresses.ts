import type { Address } from "viem";
import type { SupportedChain } from "./chain";

type ContractAddressRegistry = Record<SupportedChain, Address>

export const PWN_TOKEN = {
    1: '0x420690e3C226398De46b2c467AD4547870391Ba3',
    11155111: '0x0FE826395b1971d80A94543613E56a8b2fDF3d11'
} as const satisfies ContractAddressRegistry

export const STAKED_PWN_NFT = {
    1: '0x1Eba7F1E2DdDC008D3CD6E88b5F3C8A52BDC1C14',
    11155111: '0x8767F9349786141457be98E1deAdD6C4975F50DF'
} as const satisfies ContractAddressRegistry

export const VE_PWN_TOKEN = {
    1: '0x683b463672e3F11eE36dc64Ae8970241F5fb6726',
    11155111: '0xBF7105C7f1cB7CB556Ad2754636f8C8D9707029e'
} as const satisfies ContractAddressRegistry

export const EPOCH_CLOCK = {
    1: '0x65EA4fdc09900f1f1E1aa911a90f4eFEF1BACfCb',
    11155111: '0x19e3293196aee99BB3080f28B9D3b4ea7F232b8d'
} as const satisfies ContractAddressRegistry

export const PWN_VESTING_MANAGER = {
    1: '0x6E33824F1d51EE3918c805dCC16BF7C30FF79c06',
} as const
