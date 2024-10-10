<template>
    <BaseSkeletor v-if="isFetchingUserCumulativeVotingPower || isFetchingUserStakesWithVotingPower" height="340"/>
    <div v-else-if="parsedDataForGraph" class="graph-cumulative-voting-power">
        <div class="graph-cumulative-voting-power__heading">
            <span>Cumulative Voting Power</span>
            <span v-if="timeTillNextEpoch !== undefined">Time Till Next Epoch: {{ timeTillNextEpoch }}</span>
        </div>

        <Line :data="parsedDataForGraph" :options="chartOptions" />
    </div>
    
</template>

<script setup lang="ts">
import { useUserStakesWithVotingPower } from '~/utils/hooks';
import { useAccount } from '@wagmi/vue';
import { Line } from 'vue-chartjs'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  type ChartOptions
} from 'chart.js'
import { formatUnits } from 'viem';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  //Legend
)

ChartJS.defaults.color = getComputedStyle(document.documentElement).getPropertyValue('--text-color');

const { address } = useAccount()

const { epoch } = useManuallySetEpoch()
const epochForGraph = computed(() => {
    if (epoch.value === undefined) {
        return undefined
    }

    // TODO add currentEpoch - 2
    return Math.max(1, epoch.value)
})

/*
const currentEpochQuery = useCurrentEpoch()
const currentEpoch = computed(() => {
    if (currentEpochQuery.data.value === undefined) {
        return undefined
    }

    return currentEpochQuery.data.value
})

const epochForGraph = computed(() => {
    if (currentEpoch.value === undefined) {
        return undefined
    }

    // TODO add currentEpoch - 2
    return Math.max(1, currentEpoch.value)
})
*/

const userStakesWithVotingPowerQuery = useUserStakesWithVotingPower(address, epochForGraph)
const userStakesWithVotingPower = computed(() => userStakesWithVotingPowerQuery.data.value)
const isFetchingUserStakesWithVotingPower = computed(() => userStakesWithVotingPowerQuery.isLoading.value)

const userCumulativeVotingPowerQuery = useUserCumulativeVotingPowerSummary(userStakesWithVotingPower)
const userCumulativeVotingPower = computed(() => userCumulativeVotingPowerQuery.data.value)
const isFetchingUserCumulativeVotingPower = computed(() => userCumulativeVotingPowerQuery.isLoading.value)

const parsedUserCumulativeVotingPower = computed(() => {
    if (!userCumulativeVotingPower.value?.length) {
        return undefined
    }

    return formatCumulativeVotingPowerSummary(userCumulativeVotingPower.value)
})

const parsedDataForGraph = computed(() => {
    if (parsedUserCumulativeVotingPower.value === undefined) {
        return undefined
    }

    return {
        datasets: [{
            data: Object.entries(parsedUserCumulativeVotingPower.value).map(([epoch, power]) => ({ x: epoch, y: formatUnits(power, 18)})),
            tooltip: {
                callbacks: {
                    afterTitle(asd) {
                        return 'epoch'
                    },
                    afterBody(asd) {
                        return 'Voting Power'
                    },
                }
            },
            pointRadius: 0,
            pointHoverRadius: 5,
        }]
    }
})

const chartOptions: ChartOptions<'line'> = {
  responsive: true,
  maintainAspectRatio: false,
  pointStyle: false,
  fill: true,
  backgroundColor: getComputedStyle(document.documentElement).getPropertyValue('--primary-color-darker'),
  borderColor: getComputedStyle(document.documentElement).getPropertyValue('--primary-color'),
  borderWidth: 1,
  stepped: true,
  interaction: {
    mode: 'index',
    intersect: false,
  },
  scales: {
    y: {
        position: 'right',
        ticks: {
            padding: 36
        },
        grid: {
            tickColor: '#313131',
            // tickBorderDash: ctx => [1]
        }
    },
    x: {
        grid: {
            tickColor: '#313131'
        }
    }
  },
  plugins: {
    tooltip: {
        callbacks: {
            label(tooltipItems) {
                return `${tooltipItems.formattedValue} Voting Power`
            },
            title(tooltipItems) {
                return `${nth(tooltipItems[0].label)} Epoch`
            },
        }
    }
  }
}

const initialEpochTimestampQuery = useInitialEpochTimestamp()
// TODO is this calculation correct?
const timeTillNextEpoch = computed(() => {
    if (initialEpochTimestampQuery.data.value === undefined) {
        return undefined
    }

    const secondsTillNextEpoch = getTimeTillNextEpoch(Number(initialEpochTimestampQuery.data.value))
    return formatSeconds(secondsTillNextEpoch)
})
</script>

<style scoped>
.graph-cumulative-voting-power {
    padding: 1rem;
    background-color: var(--background-color);

    max-height: 340px;

    &__heading {
        display: flex;
        justify-content: space-between;
        color: var(--subtitle-color);
        margin-bottom: 1rem;
        font-size: 0.875rem;
    }
}
</style>
