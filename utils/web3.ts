import { useAppKit } from "@reown/appkit/vue";
import { isAddress, type Address } from "viem";

export const openAppKitModal = async () => {
    // issue described here https://github.com/reown-com/appkit/issues/1840
    const modal = useAppKit()
    try{
      await modal.open();
    } catch(_e){
      await modal.open();
    }
  }

  export const shortenAddress = (address: Address | null, startLettersCount = 5, endLettersCount = 39): string => {
    return address && isAddress(address) ? `${address.slice(0, startLettersCount)}…${address.slice(endLettersCount, 42)}` : ''
  }
0