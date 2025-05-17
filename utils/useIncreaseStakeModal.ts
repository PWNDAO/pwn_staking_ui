import { ref } from "vue";

const LOWER_STAKE_LOCK_UP_EPOCHS = 13;
const UPPER_STAKE_LOCK_UP_EPOCHS = 65;
const MAX_STAKE_LOCK_UP_EPOCHS = 130;
const isOpen = ref(false);
const stakeId = ref<bigint>();
const currentLockUpEpochs = ref<number>(0);
const formattedStakeAmount = ref<string>();
export default function useIncreaseStakeModal() {
  const openModal = (
    stakeIdVal: bigint,
    lockUpEpochs: number,
    stakeAmount: string,
  ) => {
    isOpen.value = true;
    stakeId.value = stakeIdVal;
    currentLockUpEpochs.value = Math.floor(lockUpEpochs);
    formattedStakeAmount.value = stakeAmount;
  };

  const calculateAvailableEpochs = (): number[] => {
    // Duration is maxxed out
    if (currentLockUpEpochs.value >= MAX_STAKE_LOCK_UP_EPOCHS) {
      return [];
    }

    // We return only the possibility to extend to exactly 10years
    if (currentLockUpEpochs.value >= UPPER_STAKE_LOCK_UP_EPOCHS) {
      return [MAX_STAKE_LOCK_UP_EPOCHS - currentLockUpEpochs.value];
    }

    let min = 0;
    if (currentLockUpEpochs.value < LOWER_STAKE_LOCK_UP_EPOCHS) {
      min = LOWER_STAKE_LOCK_UP_EPOCHS - currentLockUpEpochs.value;
    }
    const max = UPPER_STAKE_LOCK_UP_EPOCHS - currentLockUpEpochs.value;

    const result = [];
    for (let i = min; i <= max; i++) {
      result.push(i);
    }

    // the remaining possibility to max out the duration
    result.push(MAX_STAKE_LOCK_UP_EPOCHS - currentLockUpEpochs.value);

    return result;
  };

  return {
    isOpen,
    openModal,
    stakeId,
    currentLockUpEpochs,
    formattedStakeAmount,
    calculateAvailableEpochs,
  };
}
