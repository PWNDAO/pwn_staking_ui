import type {Address} from "abitype";
import {isAddress, isAddressEqual} from "viem";

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
