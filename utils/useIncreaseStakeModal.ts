import { computed, ref } from 'vue'

const isOpen = ref(false)
const stakeId = ref<bigint>()
const stakeLockUpEpochs = ref<bigint>(0n)
export default function useIncreaseStakeModal() {
    const openModal = (stakeIdVal: bigint) => {
        isOpen.value = true
        stakeId.value = stakeIdVal
    }
    const isStakeLockUpEpochs = (stakeLockUpEpochsVal: bigint) => {
        console.log(stakeLockUpEpochs.value, stakeLockUpEpochsVal)
        return stakeLockUpEpochs.value === stakeLockUpEpochsVal
    }
    const setStakeLockUpEpochs = (stakeLockUpEpochsVal: bigint) => {
        if (isStakeLockUpEpochs(stakeLockUpEpochsVal)) {
            stakeLockUpEpochs.value = 0n
            return
        }
        stakeLockUpEpochs.value = stakeLockUpEpochsVal
    }

    return {
        isOpen,
        openModal,
        stakeId,
        stakeLockUpEpochs,
        isStakeLockUpEpochs,
        setStakeLockUpEpochs,
    }
}
