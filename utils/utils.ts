import type {Address} from "abitype";
import {isAddress, isAddressEqual} from "viem";
import { readContract } from '@wagmi/vue/actions';
import { erc20Abi } from 'viem';
import { wagmiAdapter } from '~/wagmi';

export const compareAddresses = (a: Address | undefined, b: Address | undefined): boolean => {
    if (a === undefined && b === undefined) {
        return true
    } else if (!a || !b) {
        return false
    } else {
        if (isAddress(a) && isAddress(b)) {
            return isAddressEqual(a, b)
        }
    }
    return false
}
export const isScientificNotation = (num: number): boolean => {
    return num.toString().includes('e')
}
/**
 * Parse the decimal repeated value
 * @param value — The value to parse 0.000000000005
 * @returns The parsed value
 */
export const parseRepeatedDecimal = (value: string): {
    repeatedZeroes: number
    restDecimals: string
} | null => {
    const [, decimalPart] = value.split('.')

    const decimalPartLength = decimalPart.length
    const firstNonZeroIndex = decimalPart.split('').findIndex(v => Number(v) > 0)

    if (decimalPartLength < 4 || firstNonZeroIndex === -1 || firstNonZeroIndex <= 3) {
        return null
    }

    return {
        repeatedZeroes: firstNonZeroIndex - 1,
        restDecimals: decimalPart.slice(firstNonZeroIndex, decimalPartLength),
    }
}


export const formatDecimalPoint = (amount: number | string, numbersBehindDecimalPoint = 4, showZeroes = true): string => {
    let stringAmount = ''
    if (typeof amount === 'number' && isScientificNotation(amount)) {
        stringAmount = amount.toFixed(20)
    } else {
        stringAmount = typeof amount === 'number' ? amount.toString() : amount.replace(/,/g, '')
    }

    const [integerPart, decimalPart = ''] = stringAmount.split('.')

    // Find the first non-zero digit in the decimal part
    const firstNonZeroIndex = decimalPart.split('').findIndex(char => char !== '0')

    // Determine the number of decimal places to keep
    const decimalPlacesToKeep = numbersBehindDecimalPoint === 0 ? 0 : Math.max(numbersBehindDecimalPoint, firstNonZeroIndex + 1)

    const repeatedZeroes = parseRepeatedDecimal(`${integerPart}.${decimalPart || 0}`)
    // Pad or truncate the decimal part
    let formattedDecimal = decimalPart.padEnd(decimalPlacesToKeep, '0')

    if (!repeatedZeroes?.repeatedZeroes) {
        formattedDecimal = decimalPart.slice(0, decimalPlacesToKeep)
    } else if (repeatedZeroes?.repeatedZeroes && repeatedZeroes.repeatedZeroes > 0) {
        formattedDecimal = decimalPart.slice(0, repeatedZeroes.repeatedZeroes + numbersBehindDecimalPoint)
    }

    // Remove trailing zeros
    let cleanedDecimal = formattedDecimal.replace(/0+$/, '')

    if (cleanedDecimal.length > numbersBehindDecimalPoint && firstNonZeroIndex !== -1 && firstNonZeroIndex < numbersBehindDecimalPoint) {
        cleanedDecimal = cleanedDecimal.slice(0, numbersBehindDecimalPoint)
    }

    const formattedIntegerPart = parseFloat(integerPart).toLocaleString('en-US')

    // Combine integer and decimal parts
    let result = formattedIntegerPart

    if (cleanedDecimal || showZeroes) {
        result += '.' + (showZeroes ? cleanedDecimal.padEnd(2, '0') : cleanedDecimal)
    }

    // Add .00 if there is no decimal point and showZeroes is true
    if (!result.includes('.') && showZeroes) {
        result += '.00'
    }

    return result
}

export const getAllowance = async (
  ownerAddress: Address | undefined,
  tokenAddress: Address,
  spenderAddress: Address,
): Promise<bigint> => {
  if (!ownerAddress) return 0n;
  return await readContract(wagmiAdapter.wagmiConfig, {
    abi: erc20Abi,
    address: tokenAddress,
    functionName: 'allowance',
    args: [ownerAddress, spenderAddress]
  });
}
