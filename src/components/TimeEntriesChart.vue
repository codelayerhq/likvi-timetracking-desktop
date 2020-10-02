<template>
  <div class="h-32">
    <canvas id="myChart" style="width: 300px"></canvas>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, PropType, watch } from "vue";
import Chart, { ChartConfiguration } from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { secondsToHours } from "@/utils/format";
import { useStore } from "vuex";
import { RootState } from "@/store";
import { useI18n } from "vue-i18n";

/*
 * From https://github.com/jedtrow/Chart.js-Rounded-Bar-Charts
 */
// @ts-ignore
Chart.elements.Rectangle.prototype.draw = function () {
  /* eslint-disable */
  let ctx = this._chart.ctx;
  let vm = this._view;
  let left, right, top, bottom, signX, signY, borderSkipped, radius;
  let borderWidth = vm.borderWidth;
  // Set Radius Here
  // If radius is large enough to cause drawing errors a max radius is imposed
  let cornerRadius = 10;

  if (!vm.horizontal) {
    // bar
    left = vm.x - vm.width / 2;
    right = vm.x + vm.width / 2;
    top = vm.y;
    bottom = vm.base;
    signX = 1;
    signY = bottom > top ? 1 : -1;
    borderSkipped = vm.borderSkipped || "bottom";
  } else {
    // horizontal bar
    left = vm.base;
    right = vm.x;
    top = vm.y - vm.height / 2;
    bottom = vm.y + vm.height / 2;
    signX = right > left ? 1 : -1;
    signY = 1;
    borderSkipped = vm.borderSkipped || "left";
  }

  // Canvas doesn't allow us to stroke inside the width so we can
  // adjust the sizes to fit if we're setting a stroke on the line
  if (borderWidth) {
    // borderWidth shold be less than bar width and bar height.
    let barSize = Math.min(Math.abs(left - right), Math.abs(top - bottom));
    borderWidth = borderWidth > barSize ? barSize : borderWidth;
    let halfStroke = borderWidth / 2;
    // Adjust borderWidth when bar top position is near vm.base(zero).
    let borderLeft = left + (borderSkipped !== "left" ? halfStroke * signX : 0);
    let borderRight =
      right + (borderSkipped !== "right" ? -halfStroke * signX : 0);
    let borderTop = top + (borderSkipped !== "top" ? halfStroke * signY : 0);
    let borderBottom =
      bottom + (borderSkipped !== "bottom" ? -halfStroke * signY : 0);
    // not become a vertical line?
    if (borderLeft !== borderRight) {
      top = borderTop;
      bottom = borderBottom;
    }
    // not become a horizontal line?
    if (borderTop !== borderBottom) {
      left = borderLeft;
      right = borderRight;
    }
  }

  ctx.beginPath();
  ctx.fillStyle = vm.backgroundColor;
  ctx.strokeStyle = vm.borderColor;
  ctx.lineWidth = borderWidth;

  // Corner points, from bottom-left to bottom-right clockwise
  // | 1 2 |
  // | 0 3 |
  let corners = [
    [left, bottom],
    [left, top],
    [right, top],
    [right, bottom],
  ];
  if (
    this._chart.config.data.datasets[this._datasetIndex].data[this._index] < 0
  ) {
    corners = [
      [left, top],
      [left, bottom],
      [right, top],
      [right, bottom],
    ];
  }

  // Find first (starting) corner with fallback to 'bottom'
  let borders = ["bottom", "left", "top", "right"];
  let startCorner = borders.indexOf(borderSkipped, 0);
  if (startCorner === -1) {
    startCorner = 0;
  }

  function cornerAt(index: number) {
    return corners[(startCorner + index) % 4];
  }

  // Draw rectangle from 'startCorner'
  let corner = cornerAt(0);
  ctx.moveTo(corner[0], corner[1]);

  for (let i = 1; i < 4; i++) {
    corner = cornerAt(i);
    let nextCornerId = i + 1;
    if (nextCornerId == 4) {
      nextCornerId = 0;
    }

    let nextCorner = cornerAt(nextCornerId);

    let width = corners[2][0] - corners[1][0];
    let height = corners[0][1] - corners[1][1];
    let x = corners[1][0];
    let y = corners[1][1];

    let radius = cornerRadius;

    // Fix radius being too large
    if (radius > height / 2) {
      radius = height / 2;
    }
    if (radius > width / 2) {
      radius = width / 2;
    }

    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
  }

  ctx.fill();
  if (borderWidth) {
    ctx.stroke();
  }
};

export default defineComponent({
  name: "TimeEntriesChart",
  props: {
    startDate: {
      type: Date as PropType<Date>,
      required: true,
    },
    endDate: {
      type: Date as PropType<Date>,
      required: true,
    },
    timeEntries: {
      type: Array,
      required: true,
    },
  },
  setup() {
    const store = useStore<RootState>();
    const timeEntriesStatistic = computed(
      () => store.getters.timeEntriesStatistic
    );
    let chart = null as Chart | null;

    const { tm } = useI18n();

    watch(
      timeEntriesStatistic,
      function (timeEntriesStatistic) {
        if (
          timeEntriesStatistic?.value?.length &&
          chart !== null &&
          chart.data.datasets
        ) {
          chart.data.datasets[0].data = timeEntriesStatistic.value.map(
            (entry: any) => entry.value
          );
          chart.update();
        }
      },
      {
        immediate: true,
      }
    );

    function initalizeChart() {
      const element = document.getElementById("myChart") as HTMLCanvasElement;
      const ctx = element.getContext("2d");

      // Todo: vuei18n tm function does not respect fallback locale,
      // so we manually fall back to english labels.
      const labels: string[] = Array.isArray(tm("chart.labels"))
        ? (tm("chart.labels") as string[])
        : ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

      if (ctx) {
        const config: ChartConfiguration = {
          type: "bar",
          plugins: [ChartDataLabels],
          options: {
            responsive: true,
            maintainAspectRatio: false,
            tooltips: {
              enabled: false,
            },
            legend: {
              display: false,
            },
            layout: {
              padding: {
                top: 20,
              },
            },
            scales: {
              yAxes: [
                {
                  display: false,
                  ticks: {
                    beginAtZero: true,
                  },
                },
              ],
              xAxes: [
                {
                  gridLines: {
                    drawBorder: false,
                    display: false,
                  },
                  ticks: {
                    fontColor: "#6B7280",
                  },
                },
              ],
            },
            onClick: handleChartClick,
          },
          data: {
            labels: labels,
            datasets: [
              {
                data: [],
                backgroundColor: "#9FA6B2",
                barThickness: 15,
                minBarLength: 5,
                datalabels: {
                  align: "end",
                  anchor: "end",
                  font: {
                    weight: "bold",
                  },
                  formatter: (value, context) => secondsToHours(value, false),
                },
              },
            ],
          },
        };

        chart = new Chart(ctx, config);
      }
    }

    function handleChartClick(event: MouseEvent, activeElements: {}[]) {
      const mousePoint = Chart.helpers.getRelativePosition(event, chart);

      //@ts-ignore
      const barIndex = chart.scales["x-axis-0"].getValueForPixel(mousePoint.x);
    }

    onMounted(initalizeChart);
  },
});
</script>
