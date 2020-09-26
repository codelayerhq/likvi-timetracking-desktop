<template>
  <div>
    <div
      class="flex items-center justify-between h-16 py-2 pl-4 pr-4 space-x-2 bg-gray-100 border-b border-gray-200 cursor-pointer hover:bg-white focus:bg-white focus:outline-none"
    >
      <div class="w-6">
        <button
          class="w-6 h-6 text-sm font-bold text-gray-600 border border-gray-500 rounded hover:border-gray-600 focus:outline-none focus:border-gray-700 focus:shadow-outline-gray-500"
          @click="handleShowDetailsClick"
        >
          {{ timeEntries.length }}
        </button>
      </div>

      <div class="w-full">
        <span class="block text-xs font-semibold text-gray-800">
          {{ description }}
        </span>
        <project-indicator :project="project" />
      </div>

      <span class="block text-sm text-gray-600">
        {{ summedDuration }}
      </span>

      <div>
        <base-icon-button
          class="p-2"
          tabindex="2"
          @click.stop="handleResumeTimeEntryClick"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            class="w-6 h-6"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
            />
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </base-icon-button>
      </div>
    </div>

    <time-entry-entry
      v-for="(timeEntry, index) in timeEntries"
      v-show="visible"
      :key="index"
      :time-entry="timeEntry"
      class="pl-12"
    />
  </div>
</template>

<script lang="ts">
import { TimeEntry } from "@/api/types";
import { computed, defineComponent, PropType, ref } from "vue";
import TimeEntryEntry from "@/components/TimeEntryEntry.vue";
import { secondsToHours } from "@/utils/format";
import { useStore } from "vuex";
import { RootState } from "@/store";
import { ActionTypes } from "@/store/actions";
import ProjectIndicator from "@/components/ProjectIndicator.vue";

export default defineComponent({
  name: "GroupedTimeEntryEntry",
  components: {
    TimeEntryEntry,
    ProjectIndicator,
  },
  props: {
    timeEntries: {
      type: Array as PropType<TimeEntry[]>,
      required: true,
    },
  },
  setup(props) {
    const store = useStore<RootState>();

    const referenceTimeEntry = computed(() => props.timeEntries[0] ?? null);

    const description = computed(
      () => referenceTimeEntry.value?.description ?? ""
    );

    const project = computed(() => referenceTimeEntry.value.project?.data);

    const summedDuration = computed(() =>
      secondsToHours(
        props.timeEntries.reduce(
          (accumulator, current) => accumulator + current.duration,
          0
        )
      )
    );

    const visible = ref(false);
    function handleShowDetailsClick() {
      visible.value = !visible.value;
    }

    function handleResumeTimeEntryClick() {
      if (referenceTimeEntry.value !== null) {
        store.dispatch(ActionTypes.RESUME_TIME_ENTRY, referenceTimeEntry.value);
      }
    }

    return {
      description,
      project,
      summedDuration,
      visible,
      handleShowDetailsClick,
      handleResumeTimeEntryClick,
    };
  },
});
</script>
