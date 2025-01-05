<template>
  <BaseModal
      v-model:is-open="isOpen"
      :heading="heading"
      :heading-align="'left'">
    <template #body>
      <div class="increase-stake-modal__body">
        <span class="increase-stake-modal__label">
          Increase Duration
        </span>
        <div class="increase-stake-modal__duration-buttons">
          <div class="increase-stake-modal__duration-button-container"
              v-for="button in durationButtons"
          @click="setStakeLockUpEpochs(button.epochs)">
            <div  :class="['increase-stake-modal__duration-button', { 'increase-stake-modal__duration-button--selected': isStakeLockUpEpochs(button.epochs)}]">
              {{button.label}}
            </div>
            <span class="increase-stake-modal__multiplier">
              (x{{getMultiplierForLockUpEpochs(Number(button.epochs))}})
            </span>
          </div>
        </div>
      </div>
      <div class="increase-stake-modal__submit">
        <BaseTooltip
            style="width: 100%"
            v-if="isButtonDisabled"
            :tooltip-text="tooltipText">
          <template #trigger>
            <button
                class="increase-stake-modal__submit-button"
                :disabled="isButtonDisabled"
                @click="increaseStakeAction">
              Confirm Increase
            </button>
          </template>
        </BaseTooltip>
        <button
            v-else
            class="increase-stake-modal__submit-button"
            :disabled="isButtonDisabled"
            @click="increaseStakeAction">
          Confirm Increase
        </button>
      </div>
    </template>
  </BaseModal>

</template>

<script setup lang="ts">
import {useAccount, useWriteContract} from "@wagmi/vue";
import {VE_PWN_TOKEN_ABI} from "~/constants/abis";
import {VE_PWN_TOKEN} from "~/constants/addresses";
import {getChainIdTypesafe} from "~/constants/chain";
import useIncreaseStakeModal from "~/utils/useIncreaseStakeModal";
import {EPOCHS_IN_YEAR} from "~/constants/contracts";
import {getMultiplierForLockUpEpochs} from "~/utils/parsing";

const { writeContractAsync: _writeContractIncreaseStake, isPending } = useWriteContract()
const {isOpen, stakeId, isStakeLockUpEpochs, setStakeLockUpEpochs, stakeLockUpEpochs} = useIncreaseStakeModal()
const heading = computed( () => `Increase Stake #${Number(stakeId.value)}`)
const { address } = useAccount()

const isButtonDisabled = computed(() => !stakeId.value || !address.value || !stakeLockUpEpochs.value || isPending.value)
const tooltipText = computed(() => isButtonDisabled.value ? 'Please select duration.' : '')
const durationButtons = [
  {
    label: '2 Years',
    epochs: BigInt(EPOCHS_IN_YEAR * 2)
  },
  {
    label: '3 Years',
    epochs: BigInt(EPOCHS_IN_YEAR * 3)
  },
  {
    label: '4 Years',
    epochs: BigInt(EPOCHS_IN_YEAR * 4)
  },
  {
    label: '5 Years',
    epochs: BigInt(EPOCHS_IN_YEAR * 5)
  },
  {
    label: '10 Years',
    epochs: BigInt(EPOCHS_IN_YEAR * 10)
  },
]

// TODO: Who can increase the stake? Only the owner of the stake? Isn't beneficiary the person with the voting power therefore not necessarily the owner?
// TODO LATER: also allow for increasing amount, now only works to increase time
const increaseStakeAction = async () => {
  if (!stakeId.value || !address.value || !stakeLockUpEpochs.value) return console.error('Missing required values')
  return await _writeContractIncreaseStake({
    abi: VE_PWN_TOKEN_ABI,
    address: VE_PWN_TOKEN[getChainIdTypesafe()],
    functionName: 'increaseStake',
    chainId: getChainIdTypesafe(),
    args: [stakeId.value, address.value, 0n, stakeLockUpEpochs.value]
  })
}
</script>

<style scoped>
.increase-stake-modal{
  &__label{
    color: #AAA9B2;
    /* Screener/H10 */
    font-family: var(--font-family-screener);
    font-size: 0.875rem;
    font-style: normal;
    font-weight: 400;
    line-height: 1rem; /* 114.286% */
  }
  &__duration-buttons{
    display: flex;
    gap: 1rem;
    margin-top: 0.5rem;
  }
  &__duration-button{
    display: flex;
    padding: 1rem;
    justify-content: center;
    align-items: center;
    gap: 0.5rem;
    align-self: stretch;
    background: #1C1C1C;
    color: var(--text, #F3F1FF);

    text-align: center;
    font-family: var(--font-family-screener);
    font-size: 0.875rem;
    font-style: normal;
    font-weight: 400;
    line-height: 1rem; /* 114.286% */
    border: 1px solid transparent;
    &--selected{
      background: #2D2D2D;
      border: 1px solid var(--Primary, #00FFE0);
    }
    &:hover{
      cursor: pointer;
    }
  }
  &__multiplier{
    color: #AAA9B2;
    text-align: center;
    font-family: var(--font-family-screener);
    font-size: 0.75rem;
    font-style: normal;
    font-weight: 400;
    line-height: 0.875rem; /* 116.667% */
  }
  &__duration-button-container{
    display: flex;
    flex-flow: column;
    gap: 0.5rem;
  }
  &__submit{
    display: flex;
    justify-content: center;
    margin-top: 1rem;
    width: 100%;
  }
  &__submit-button{
    width: 100%;
    display: flex;
    padding: 1rem;
    justify-content: center;
    align-items: center;
    gap: 0.5rem;
    color: var(--text, #F3F1FF);
    text-align: center;
    font-family: var(--font-family-screener);
    font-size: 0.875rem;
    background: #1C1C1C;
    border: none;
    &:hover {
      cursor: pointer;
      background: #2D2D2D;
      &:disabled{
        cursor: not-allowed;
      }
    }

    &:disabled {
      opacity: 0.5;
    }
  }
}
</style>
