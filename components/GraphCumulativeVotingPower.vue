<template>
    <BaseSkeletor v-if="isFetchingUserCumulativeVotingPower" height="2"/>
    <div v-else-if="parsedDataForGraph" class="graph-cumulative-voting-power">
        <div class="graph-cumulative-voting-power__heading">
            <span>Cumulative Voting Power</span>
            <span v-if="timeTillNextEpoch !== undefined">Time Till Next Epoch: {{ timeTillNextEpoch }}</span>
        </div>

        <div class="graph-cumulative-voting-power__graph-wrapper">
          <!-- @vue-expect-error some weird error mismatch -->
          <Line v-if="parsedDataForGraph" :data="parsedDataForGraph" :options="chartOptions" />
        </div>
    </div>

</template>

<script setup lang="ts">
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
  Filler,
  TimeScale,
  type ChartOptions,
  type Point
} from 'chart.js'
import { formatUnits } from 'viem';
import { MAX_EPOCHS_IN_FUTURE } from '~/constants/contracts';
import { useChainIdTypesafe } from '~/constants/chain';
import 'chartjs-adapter-date-fns';

const highlightCurrentEpochPlugin = {
    id: 'highlightCurrentEpoch',
    // @ts-expect-error no need to type chart arg here
    afterDraw: (chart) => {
        const ctx = chart.ctx as CanvasRenderingContext2D;
        const xAxis = chart.scales.x;
        const yAxis = chart.scales.y;

        // Find the data point for current epoch
        const dataset = chart.data.datasets[0];
        const highlightIndex = dataset.data.findIndex((graphValue: {x: number, y: number, epoch: string}) => 
            graphValue.epoch === String(epoch.value)
        );
        
        if (highlightIndex === -1) return; // Exit if no matching point found
        
        const dataPoint = dataset.data[highlightIndex];
        const xPos = xAxis.getPixelForValue(dataPoint.x); // Use dataPoint.x directly since it's now a date
        const yPos = yAxis.getPixelForValue(dataPoint.y);

        // Draw vertical dashed line
        ctx.beginPath();
        ctx.setLineDash([5, 5]);
        ctx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue('--primary-color')
        ctx.lineWidth = 1;

        // Draw vertical line from x-axis to point
        ctx.moveTo(xPos, yAxis.bottom);
        ctx.lineTo(xPos, yPos);

        ctx.stroke();

        // Highlight the point
        ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--primary-color')
        ctx.fillRect(xPos - 5, yPos - 5, 10, 10)

        ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--background-color')
        ctx.fillRect(xPos - 4, yPos - 4, 8, 8)
    }
}

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  TimeScale,
  highlightCurrentEpochPlugin,
)

ChartJS.defaults.color = getComputedStyle(document.documentElement).getPropertyValue('--text-color');

const { address } = useAccount()
const chainId = useChainIdTypesafe()

const { epoch } = useManuallySetEpoch(chainId)

const NUMBER_OF_PAST_EPOCHS_TO_DISPLAY = 2

const epochsForGraph = computed<bigint[] | undefined>(() => {
    if (epoch.value === undefined) {
        return undefined
    }

    let startEpoch = Math.max(1, epoch.value - NUMBER_OF_PAST_EPOCHS_TO_DISPLAY)
    const result: bigint[] = []
    for (let i = 0; i < MAX_EPOCHS_IN_FUTURE + NUMBER_OF_PAST_EPOCHS_TO_DISPLAY; i++) {
        result.push(BigInt(startEpoch + i))
    }
    return result
})

const userCumulativeVotingPowerQuery = useUserCumulativeVotingPowerSummary(address, epochsForGraph, chainId)
const userCumulativeVotingPower = computed(() => userCumulativeVotingPowerQuery.data.value)
const isFetchingUserCumulativeVotingPower = computed(() => userCumulativeVotingPowerQuery.isLoading.value)

const parsedDataForGraph = computed(() => {
    if (!userCumulativeVotingPower.value?.length || !initialEpochTimestamp.value) {
        return undefined
    }

    return {
        datasets: [
            {
                data: userCumulativeVotingPower.value.map(votingPowerInEpoch => ({ 
                    x: getStartDateOfEpoch(Number(initialEpochTimestamp.value), Number(votingPowerInEpoch.epoch)),
                    y: Number(formatUnits(votingPowerInEpoch.power, 18)),
                    epoch: votingPowerInEpoch.epoch.toString()
                })),
                pointRadius: 0,
                pointHoverRadius: 5,
            }
        ]
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
        }
    },
    x: {
        type: 'time',
        time: {
            unit: 'day',
            displayFormats: {
                day: 'MMM d, yyyy'
            }
        },
        grid: {
            tickColor: '#313131'
        },
        ticks: {
            autoSkip: true,
            callback: function(value, index, ticks) {
                const dataset = this.chart.data.datasets[0];
                if (!dataset?.data) return null;

                const formatDate = (date: number | Date) => {
                    return new Date(date).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                    });
                };

                // Always show first tick
                if (index === 0) {
                    return formatDate(Number(value));
                }

                const data = dataset.data as Point[];
                const currentIndex = data.findIndex(
                    (d: any) => Math.abs(new Date(d.x).getTime() - new Date(value).getTime()) < 36400000 // Increased tolerance to 10 hours
                );

                if (currentIndex === -1 || currentIndex === 0) return null;

                const currentY = Number(data[currentIndex]?.y);
                const prevY = Number(data[currentIndex - 1]?.y);

                const hasChanged = currentY !== prevY
                return hasChanged ? formatDate(Number(value)) : null;
            },
            maxRotation: 45,
            minRotation: 45
        }
    }
  },
  plugins: {
    tooltip: {
        callbacks: {
            label(tooltipItems) {
                return ` ${tooltipItems.formattedValue} Voting Power`
            },
            title(tooltipItems) {
                const dataPoint = tooltipItems[0].raw as { epoch: string };
                const epochStringified = nth(dataPoint.epoch)
                return `${epochStringified} Epoch - ${tooltipItems[0].label}`
            },
        }
    },
    // @ts-expect-error custom plugin name, works alright
    highlightCurrentEpoch: highlightCurrentEpochPlugin,
  }
}

const initialEpochTimestampQuery = useInitialEpochTimestamp(chainId)
const initialEpochTimestamp = computed(() => initialEpochTimestampQuery.data.value)
const timeTillNextEpoch = computed(() => {
    if (initialEpochTimestamp.value === undefined) {
        return undefined
    }

    return getTimeTillNextEpochStringified(Number(initialEpochTimestamp.value))
})
</script>

<style scoped>
.graph-cumulative-voting-power {
    padding: 1rem;
    background-color: var(--background-color);
    border: 1px solid var(--border-color);
    overflow: auto;

    max-height: 500px;

    &__heading {
        display: flex;
        justify-content: space-between;
        color: var(--subtitle-color);
        margin-bottom: 1rem;
        font-size: 0.875rem;

        @media (max-width: 800px) {
            width: 700px;
        }
    }

    &__graph-wrapper {
        height: 300px;

        @media (max-width: 800px) {
            width: 700px;
        }
    }
}
</style>
