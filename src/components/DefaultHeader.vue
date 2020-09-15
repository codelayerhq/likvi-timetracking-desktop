<template>
  <header class="px-8 py-6 bg-gray-200">
    <div class="mb-8">
      <div class="text-sm font-bold leading-tight text-gray-800">
        <current-time />
      </div>
      <div class="text-sm leading-tight text-gray-700">
        <time-span :start-date="startDate" :end-date="endDate" />
      </div>
      <div class="text-sm leading-tight text-gray-700">
        Idle Seconds: {{ idleSeconds }}
      </div>
    </div>

    <div class="flex justify-between align-center">
      <base-icon-button @click="handlePreviousWeek">
        <svg
          width="32"
          height="32"
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M20.3312 8.46879C20.6312 8.76884 20.7997 9.17573 20.7997 9.59999C20.7997 10.0243 20.6312 10.4311 20.3312 10.7312L15.0624 16L20.3312 21.2688C20.6227 21.5706 20.7839 21.9747 20.7803 22.3942C20.7766 22.8138 20.6084 23.2151 20.3117 23.5117C20.0151 23.8084 19.6138 23.9766 19.1942 23.9803C18.7747 23.9839 18.3706 23.8226 18.0688 23.5312L11.6688 17.1312C11.3689 16.8311 11.2003 16.4243 11.2003 16C11.2003 15.5757 11.3689 15.1688 11.6688 14.8688L18.0688 8.46879C18.3689 8.16884 18.7757 8.00034 19.2 8.00034C19.6243 8.00034 20.0312 8.16884 20.3312 8.46879Z"
            class="fill-current"
          />
        </svg>
      </base-icon-button>
      <time-entries-chart
        :start-date="startDate"
        :end-date="endDate"
        :time-entries="[]"
      />
      <base-icon-button @click="handleNextWeek">
        <svg
          width="32"
          height="32"
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M11.6688 23.5312C11.3688 23.2311 11.2003 22.8243 11.2003 22.4C11.2003 21.9757 11.3688 21.5688 11.6688 21.2688L16.9376 16L11.6688 10.7312C11.3773 10.4294 11.2161 10.0253 11.2197 9.60575C11.2234 9.18624 11.3916 8.78494 11.6883 8.48828C11.9849 8.19163 12.3862 8.02336 12.8058 8.01971C13.2253 8.01607 13.6294 8.17734 13.9312 8.46879L20.3312 14.8688C20.6312 15.1688 20.7997 15.5757 20.7997 16C20.7997 16.4243 20.6312 16.8311 20.3312 17.1312L13.9312 23.5312C13.6312 23.8311 13.2243 23.9997 12.8 23.9997C12.3757 23.9997 11.9688 23.8311 11.6688 23.5312Z"
            class="fill-current"
          />
        </svg>
      </base-icon-button>
    </div>
  </header>
</template>

<script lang="ts">
import { defineComponent, computed } from "vue";
import TimeEntriesChart from "@/components/TimeEntriesChart.vue";
import CurrentTime from "./CurrentTime.vue";
import TimeSpan from "@/components/TimeSpan.vue";
import { useStore } from "vuex";
import { subWeeks, addWeeks } from "date-fns";
import { ActionTypes } from "@/store/actions";
import { RootState } from "@/store";

export default defineComponent({
  name: "DefaultHeader",
  components: {
    TimeEntriesChart,
    CurrentTime,
    TimeSpan,
  },
  setup() {
    const store = useStore<RootState>();

    const startDate = computed(() => store.state.startDate);
    const endDate = computed(() => store.state.endDate);
    const idleSeconds = computed(() => store.state.systemIdleTime);

    const handlePreviousWeek = () => {
      const newStartDate = subWeeks(startDate.value, 1);
      const newEndDate = subWeeks(endDate.value, 1);
      fetchData(newStartDate, newEndDate);
    };

    const handleNextWeek = () => {
      const newStartDate = addWeeks(startDate.value, 1);
      const newEndDate = addWeeks(endDate.value, 1);
      fetchData(newStartDate, newEndDate);
    };

    function fetchData(newStartDate: Date, newEndDate: Date) {
      store.dispatch(ActionTypes.SET_START_DATE, newStartDate);
      store.dispatch(ActionTypes.SET_END_DATE, newEndDate);
      store.dispatch(ActionTypes.FETCH_TIME_ENTRIES);
      store.dispatch(ActionTypes.FETCH_STATISTICS);
    }

    return {
      startDate,
      endDate,
      handlePreviousWeek,
      handleNextWeek,
      idleSeconds,
    };
  },
});
</script>
