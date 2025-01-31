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
      </div>
      <VueSlider
          style="width: 90%; margin: 0 auto;"
          v-model="additionalLockUpEpochs"
          :data="calculatedEpochs"
          :tooltip="'always'"
          :process-style="{
        backgroundColor: 'var(--primary-color)',
        }" @click.stop>
        <template #tooltip="{ value }">
          <div
              :class="['increase-stake-modal__tooltip-text', {
            'increase-stake-modal__tooltip-text--last-value': isLastValue(value),
          }]">
            {{ value*DAYS_IN_EPOCH }} days
          </div>
        </template>
        <template #dot>
          <div class="increase-stake-modal__dot"/>
        </template>
      </VueSlider>
      <span class="increase-stake-modal__disclaimer"> Note: Stake can be only increased by epochs.(28 days)<br> The new unlock date has to be between 1 and 5 years, or 10 years.</span>
      <div class="increase-stake-modal__comparison">
        <div class="increase-stake-modal__section">
          <div class="increase-stake-modal__section-title">Current Stake</div>
          <div class="increase-stake-modal__stats">
            <div class="increase-stake-modal__stat">
              <div class="increase-stake-modal__label-stats">Unlocks in</div>
              <div class="increase-stake-modal__value">
                {{ formatSeconds(currentLockUpEpochs * SECONDS_IN_EPOCH + secondsTillNextEpoch!) }}
              </div>
            </div>
            <div class="increase-stake-modal__stat">
              <div class="increase-stake-modal__label-stats">Unlock date</div>
              <div class="increase-stake-modal__value">
                {{ displayShortDate(new Date(Date.now() + (currentLockUpEpochs * SECONDS_IN_EPOCH + secondsTillNextEpoch!) * 1000)) }}
              </div>
            </div>

            <div class="increase-stake-modal__stat">
              <div class="increase-stake-modal__label-stats">Multiplier</div>
              <div class="increase-stake-modal__value">
                {{ getMultiplierForLockUpEpochs(currentLockUpEpochs) }}x
              </div>
            </div>

            <div class="increase-stake-modal__stat">
              <div class="increase-stake-modal__label-stats">Voting Power</div>
              <div class="increase-stake-modal__value">
                {{ getFormattedVotingPower(formattedStakeAmount!, getMultiplierForLockUpEpochs(currentLockUpEpochs)) }}
              </div>
            </div>
          </div>
        </div>

        <div class="increase-stake-modal__divider"></div>

        <div class="increase-stake-modal__section">
          <div class="increase-stake-modal__section-title">New Stake</div>
          <div class="increase-stake-modal__stats">
            <div class="increase-stake-modal__stat">
              <div class="increase-stake-modal__label-stats">Unlocks in</div>
              <div class="increase-stake-modal__value">
                {{ formatSeconds(finalLockUpEpochs * SECONDS_IN_EPOCH + secondsTillNextEpoch!) }}
              </div>
            </div>

            <div class="increase-stake-modal__stat">
              <div class="increase-stake-modal__label-stats">Unlock date</div>
              <div class="increase-stake-modal__value">
                {{ displayShortDate(new Date(Date.now() + (finalLockUpEpochs * SECONDS_IN_EPOCH + secondsTillNextEpoch!) * 1000)) }}
              </div>
            </div>

            <div class="increase-stake-modal__stat">
              <div class="increase-stake-modal__label-stats">Multiplier</div>
              <div class="increase-stake-modal__value">
                {{ getMultiplierForLockUpEpochs(finalLockUpEpochs) }}x
              </div>
            </div>

            <div class="increase-stake-modal__stat">
              <div class="increase-stake-modal__label-stats">Voting Power</div>
              <div class="increase-stake-modal__value">
                {{ getFormattedVotingPower(formattedStakeAmount!, getMultiplierForLockUpEpochs(finalLockUpEpochs)) }}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="increase-stake-modal__submit">
        <BaseTooltip
            style="width: 100%"
            :has-tooltip="isButtonDisabled && !isPending"
            :tooltip-text="tooltipText">
          <template #trigger>
            <button
                class="increase-stake-modal__submit-button"
                :disabled="isButtonDisabled"
                @click="increaseStakeAction">
              {{ isPending ? 'Increasing...' : 'Confirm Increase'}}
            </button>
          </template>
        </BaseTooltip>
      </div>
    </template>
  </BaseModal>

</template>

<script setup lang="ts">
import {useAccount, useWriteContract} from "@wagmi/vue";
import {VE_PWN_TOKEN_ABI} from "~/constants/abis";
import {VE_PWN_TOKEN} from "~/constants/addresses";
import {getChainIdTypesafe, useChainIdTypesafe} from "~/constants/chain";
import useIncreaseStakeModal from "~/utils/useIncreaseStakeModal";
import VueSlider from 'vue-3-slider-component'
import {getFormattedVotingPower, getMultiplierForLockUpEpochs} from "~/utils/parsing";
import {displayShortDate, formatSeconds} from "~/utils/date";
import {DAYS_IN_EPOCH, SECONDS_IN_EPOCH} from "~/constants/contracts";
import {sendTransaction} from "~/utils/useTransactions";
import {useMutation, useQueryClient} from "@tanstack/vue-query";

const {isOpen, stakeId, currentLockUpEpochs, formattedStakeAmount, calculateAvailableEpochs} = useIncreaseStakeModal()
const heading = computed( () => `Increase Duration of Stake #${Number(stakeId.value)}`)
const { address } = useAccount()
const additionalLockUpEpochs = ref(0)
const chainId = useChainIdTypesafe()
const initialEpochTimestampQuery = useInitialEpochTimestamp(chainId)
const initialEpochTimestamp = computed(() => initialEpochTimestampQuery.data.value)
const queryClient = useQueryClient()



const secondsTillNextEpoch = computed(() => {
  if (initialEpochTimestamp.value === undefined) {
    return undefined
  }

  return getSecondsTillNextEpoch(Number(initialEpochTimestamp.value))
})


const finalLockUpEpochs = computed(() => currentLockUpEpochs.value + additionalLockUpEpochs.value)

const calculatedEpochs = computed(() => {
  return calculateAvailableEpochs()
})

watch(isOpen, (newVal) => {
  if (newVal) {
    additionalLockUpEpochs.value = calculatedEpochs.value[0] || 0
  }
})

const isButtonDisabled = computed(() => !stakeId.value || !address.value || isPending.value || !additionalLockUpEpochs.value)
const tooltipText = computed(() => isButtonDisabled.value ? 'Please select duration.' : '')
const invalidateUserStakesQuery = () => {
  queryClient.invalidateQueries({queryKey: ['userStakesWithVotingPower']})
  queryClient.invalidateQueries({queryKey: ['stakedPwnBalance']})
}

const { mutateAsync, isPending } = useMutation({
  mutationFn: async() => {
    if (!stakeId.value || !address.value || !additionalLockUpEpochs.value) return console.error('Missing required values')
    return await sendTransaction({
      abi: VE_PWN_TOKEN_ABI,
      address: VE_PWN_TOKEN[getChainIdTypesafe()],
      functionName: 'increaseStake',
      chainId: getChainIdTypesafe(),
      args: [stakeId.value, address.value, 0n, BigInt(additionalLockUpEpochs.value)]
    })
  },
  onSuccess() {
    isOpen.value = false
    invalidateUserStakesQuery()
  },
})
// TODO LATER: also allow for increasing amount, now only works to increase time
const increaseStakeAction = async () => {
  await mutateAsync()
}

const isLastValue = (value: number) => {
  return value === calculatedEpochs.value[calculatedEpochs.value.length - 1]
}
</script>

<style scoped>
.increase-stake-modal{
  &__disclaimer {
    font-family: var(--font-family-supreme);
    font-size: 0.75rem;
    color: var(--text-color);
  }
  &__tooltip-text {
    font-family: var(--font-family-screener);
    font-size: 0.75rem;
    text-transform: uppercase;
    color: var(--text-color);
    white-space: nowrap;
    &--last-value{
      color: var(--negative)
    }
  }
  &__dot {
    width: 2rem;
    height: 1.5rem;
    position: absolute;
    top: -0.5rem;

    border: 1px solid var(--grey);
    background: var(--black-input);
  }
  &__label{
    color: #AAA9B2;
    /* Screener/H10 */
    font-family: var(--font-family-screener);
    font-size: 0.875rem;
    font-style: normal;
    font-weight: 400;
    line-height: 1rem; /* 114.286% */
  }
  &__comparison {
    margin-top: 1.5rem;
    display: flex;

  }

  &__section {
    padding: 1rem;
  }

  &__section-title {
    margin-bottom: 1rem;
    font-family: var(--font-family-screener);
    font-size: 0.875rem;
    font-weight: 500;
    color: var(--text-color);
    text-align: center;
  }

  &__stats {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  &__stat {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 14rem;
  }

  &__label-stats {
    font-family: var(--font-family-screener);
    font-size: 0.75rem;
    color: #AAA9B2;
  }

  &__value {
    font-family: var(--font-family-supreme);
    font-size: 0.75rem;
    color: var(--text-color);
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
    color: var(--primary-color);
    text-align: center;
    font-family: var(--font-family-screener);
    font-size: 0.875rem;
    border: none;
    background: var(--primary-color-3);

    &:hover {
      background: var(--primary-color-2);
      cursor: pointer;
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
