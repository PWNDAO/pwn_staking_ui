import { useAppKit } from "@reown/appkit/vue";

export const openAppKitModal = () => {
    // issue described here https://github.com/reown-com/appkit/issues/1840
    const modal = useAppKit()
    try{
      modal.open();
    } catch(_e){
      modal.open();
    }
  }