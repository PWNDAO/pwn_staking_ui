<template>
  <BaseSkeletor v-if="isFetchingUserCumulativeVotingPower" height="388" />
  <div v-else-if="parsedDataForGraph" class="graph-cumulative-voting-power">
    <div class="graph-cumulative-voting-power__heading">
      <div class="graph-cumulative-voting-power__title-section">
        <span>Voting Power Over Time</span>
        <div
          v-if="props.displayLegend"
          class="graph-cumulative-voting-power__legend"
        >
          <div class="graph-cumulative-voting-power__legend-item">
            <div class="graph-cumulative-voting-power__legend-line" />
            <span>Current voting power</span>
          </div>
          <div class="graph-cumulative-voting-power__legend-item">
            <div
              class="graph-cumulative-voting-power__legend-line graph-cumulative-voting-power__legend-line--dashed"
            />
            <span>New voting power</span>
          </div>
        </div>
      </div>
      <span v-if="timeTillNextEpoch !== undefined"
        >Time Till Next Epoch: {{ timeTillNextEpoch }}</span
      >
    </div>

    <div class="graph-cumulative-voting-power__graph-wrapper">
      <!-- @vue-expect-error some weird error mismatch -->
      <Line
        v-if="parsedDataForGraph"
        :data="parsedDataForGraph"
        :options="chartOptions"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAccount } from "@wagmi/vue";
import { Line } from "vue-chartjs";
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
  type Point,
} from "chart.js";
import { formatUnits } from "viem";
import {
  MAX_EPOCHS_IN_FUTURE,
  PWN_TOKEN_DECIMALS,
} from "~/constants/contracts";
import { useChainIdTypesafe } from "~/constants/chain";
import "chartjs-adapter-date-fns";
import {
  getMultiplierForLockUpEpochs,
  getStartDateOfEpoch,
} from "~/utils/parsing";
import {
  useManuallySetEpoch,
  useUserCumulativeVotingPowerSummary,
  useInitialEpochTimestamp,
} from "~/utils/hooks";
import nth from "~/utils/nth";
interface PotentialStake {
  amount: bigint;
  lockUpEpochs: number;
  initialEpoch?: number;
}

const props = withDefaults(
  defineProps<{
    potentialStake?: PotentialStake;
    displayLegend?: boolean;
  }>(),
  {
    displayLegend: true,
  },
);

const highlightCurrentEpochPlugin = {
  id: "highlightCurrentEpoch",
  // @ts-expect-error no need to type chart arg here
  afterDraw: (chart) => {
    const ctx = chart.ctx as CanvasRenderingContext2D;
    const xAxis = chart.scales.x;
    const yAxis = chart.scales.y;

    // Find the data point for current epoch
    const dataset = chart.data.datasets[0];
    const highlightIndex = dataset.data.findIndex(
      (graphValue: { x: number; y: number; epoch: string }) =>
        graphValue.epoch === String(epoch.value),
    );

    if (highlightIndex === -1) return; // Exit if no matching point found

    const dataPoint = dataset.data[highlightIndex];
    const xPos = xAxis.getPixelForValue(dataPoint.x); // Use dataPoint.x directly since it's now a date
    const yPos = yAxis.getPixelForValue(dataPoint.y);

    // Draw vertical dashed line
    ctx.beginPath();
    ctx.setLineDash([5, 5]);
    ctx.strokeStyle = getComputedStyle(
      document.documentElement,
    ).getPropertyValue("--primary-color");
    ctx.lineWidth = 1;

    // Draw vertical line from x-axis to point
    ctx.moveTo(xPos, yAxis.bottom);
    ctx.lineTo(xPos, yPos);

    ctx.stroke();

    // Highlight the point
    ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue(
      "--primary-color",
    );
    ctx.fillRect(xPos - 5, yPos - 5, 10, 10);

    ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue(
      "--background-color",
    );
    ctx.fillRect(xPos - 4, yPos - 4, 8, 8);
  },
};

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
);

ChartJS.defaults.color = getComputedStyle(
  document.documentElement,
).getPropertyValue("--text-color");

const { address } = useAccount();
const chainId = useChainIdTypesafe();

const { epoch } = useManuallySetEpoch(chainId);

const NUMBER_OF_PAST_EPOCHS_TO_DISPLAY = 2;

const epochsForGraph = computed<bigint[] | undefined>(() => {
  if (epoch.value === undefined) {
    return undefined;
  }

  const startEpoch = Math.max(
    1,
    epoch.value - NUMBER_OF_PAST_EPOCHS_TO_DISPLAY,
  );
  const result: bigint[] = [];
  for (
    let i = 0;
    i < MAX_EPOCHS_IN_FUTURE + NUMBER_OF_PAST_EPOCHS_TO_DISPLAY;
    i++
  ) {
    result.push(BigInt(startEpoch + i));
  }
  return result;
});

const userCumulativeVotingPowerQuery = useUserCumulativeVotingPowerSummary(
  address,
  epochsForGraph,
  chainId,
);
const userCumulativeVotingPower = computed(
  () => userCumulativeVotingPowerQuery.data.value,
);
const isFetchingUserCumulativeVotingPower = computed(
  () => userCumulativeVotingPowerQuery.isLoading.value,
);

const parsedDataForGraph = computed(() => {
  if (!initialEpochTimestamp.value) {
    return undefined;
  }

  const datasets = [];
  const dataPoints = userCumulativeVotingPower.value || [];

  // If no data points, create default data points for current epoch range
  if (dataPoints.length === 0 && epoch.value !== undefined) {
    const startEpoch = Math.max(
      1,
      epoch.value - NUMBER_OF_PAST_EPOCHS_TO_DISPLAY,
    );
    for (
      let i = 0;
      i < MAX_EPOCHS_IN_FUTURE + NUMBER_OF_PAST_EPOCHS_TO_DISPLAY;
      i++
    ) {
      dataPoints.push({
        epoch: BigInt(startEpoch + i),
        power: 0n,
      });
    }
  }

  // Current voting power dataset
  datasets.push({
    data: dataPoints.map((votingPowerInEpoch) => ({
      x: getStartDateOfEpoch(
        Number(initialEpochTimestamp.value),
        Number(votingPowerInEpoch.epoch),
      ),
      y: Number(formatUnits(votingPowerInEpoch.power, PWN_TOKEN_DECIMALS)),
      epoch: votingPowerInEpoch.epoch.toString(),
    })),
    pointRadius: 0,
    pointHoverRadius: 5,
    label: "Current Voting Power",
    borderColor: getComputedStyle(document.documentElement).getPropertyValue(
      "--primary-color",
    ),
    backgroundColor: getComputedStyle(
      document.documentElement,
    ).getPropertyValue("--primary-color-darker"),
    fill: true,
  });

  // Add potential voting power if provided
  if (props.potentialStake && props.potentialStake.initialEpoch !== undefined) {
    const potentialData = dataPoints.map((votingPowerInEpoch) => {
      const epochNumber = Number(votingPowerInEpoch.epoch);
      const existingPower = Number(
        formatUnits(votingPowerInEpoch.power, PWN_TOKEN_DECIMALS),
      );

      // Only add potential power for future epochs after stake starts
      if (epochNumber >= props.potentialStake!.initialEpoch!) {
        const remainingEpochs =
          props.potentialStake!.lockUpEpochs -
          (epochNumber - props.potentialStake!.initialEpoch!);
        if (remainingEpochs > 0) {
          const multiplier = getMultiplierForLockUpEpochs(remainingEpochs);
          const newPotentialPower =
            Number(
              formatUnits(props.potentialStake!.amount, PWN_TOKEN_DECIMALS),
            ) * multiplier;
          return {
            x: getStartDateOfEpoch(
              Number(initialEpochTimestamp.value),
              epochNumber,
            ),
            y: existingPower + newPotentialPower,
            epoch: String(epochNumber),
          };
        }
      }

      return {
        x: getStartDateOfEpoch(
          Number(initialEpochTimestamp.value),
          epochNumber,
        ),
        y: existingPower,
        epoch: String(epochNumber),
      };
    });

    datasets.push({
      data: potentialData,
      pointRadius: 0,
      pointHoverRadius: 5,
      label: "New Voting Power",
      borderColor: getComputedStyle(document.documentElement).getPropertyValue(
        "--primary-color",
      ),
      borderDash: [5, 5],
      fill: true,
    });
  }

  return { datasets };
});

const chartOptions: ChartOptions<"line"> = {
  responsive: true,
  maintainAspectRatio: false,
  pointStyle: false,
  fill: true,
  stepped: true,
  interaction: {
    mode: "index",
    intersect: false,
  },
  scales: {
    y: {
      position: "right",
      ticks: {
        padding: 36,
      },
      grid: {
        tickColor: "#313131",
      },
      min: 0,
      beginAtZero: true,
    },
    x: {
      type: "time",
      time: {
        unit: "day",
        displayFormats: {
          day: "MMM d, yyyy",
        },
      },
      grid: {
        tickColor: "#313131",
      },
      ticks: {
        autoSkip: true,
        callback: function (value, index) {
          const dataset = this.chart.data.datasets[0];
          if (!dataset?.data) return null;

          const formatDate = (date: number | Date) => {
            return new Date(date).toLocaleDateString(undefined, {
              year: "numeric",
              month: "short",
              day: "numeric",
            });
          };

          // Always show first tick
          if (index === 0) {
            return formatDate(Number(value));
          }

          const data = dataset.data as Point[];
          const currentIndex = data.findIndex(
            (d) =>
              Math.abs(new Date(d.x).getTime() - new Date(value).getTime()) <
              36400000, // Increased tolerance to 10 hours
          );

          if (currentIndex === -1 || currentIndex === 0) return null;

          const currentY = Number(data[currentIndex]?.y);
          const prevY = Number(data[currentIndex - 1]?.y);

          const hasChanged = currentY !== prevY;
          return hasChanged ? formatDate(Number(value)) : null;
        },
        maxRotation: 45,
        minRotation: 45,
      },
    },
  },
  plugins: {
    tooltip: {
      callbacks: {
        label(tooltipItems) {
          const label = tooltipItems.dataset.label || "";
          return ` ${tooltipItems.formattedValue} ${label}`;
        },
        title(tooltipItems) {
          const dataPoint = tooltipItems[0].raw as { epoch: string };
          const epochStringified = nth(dataPoint.epoch);
          return `${epochStringified} Epoch - ${tooltipItems[0].label}`;
        },
      },
    },
    // @ts-expect-error custom plugin name, works alright
    highlightCurrentEpoch: highlightCurrentEpochPlugin,
    legend: {
      display: true,
      position: "top" as const,
      align: "start" as const,
      labels: {
        color: getComputedStyle(document.documentElement).getPropertyValue(
          "--text-color",
        ),
        usePointStyle: false,
        padding: 20,
      },
    },
  },
};

const initialEpochTimestampQuery = useInitialEpochTimestamp(chainId);
const initialEpochTimestamp = computed(
  () => initialEpochTimestampQuery.data.value,
);
const timeTillNextEpoch = computed(() => {
  if (initialEpochTimestamp.value === undefined) {
    return undefined;
  }

  return getTimeTillNextEpochStringified(Number(initialEpochTimestamp.value));
});
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
    font-family: var(--font-family-screener);

    @media (max-width: 800px) {
      width: 700px;
    }
  }

  &__title-section {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  &__legend {
    display: flex;
    gap: 1rem;
    font-size: 0.75rem;
    color: var(--subtitle-color);
  }

  &__legend-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  &__legend-line {
    width: 20px;
    height: 0;
    border-top: 2px solid var(--primary-color);

    &--dashed {
      border-top: 2px dashed var(--primary-color);
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
