<template>
  <div
    class="flex items-center justify-between h-16 py-2 pl-6 pr-4 space-x-2 bg-gray-100 border-b border-gray-200 cursor-pointer hover:bg-white focus:bg-white focus:outline-none"
    tabindex="2"
    @click="handleTimeEntryEntryClick"
  >
    <div class="w-full">
      <span class="block text-xs font-bold text-gray-900">
        {{ description }}
      </span>
      <project-indicator :project="project" />
    </div>

    <span class="block text-sm text-gray-600">
      {{ duration }}
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
</template>

<script lang="ts">
import { defineComponent, PropType, computed } from "vue";
import { TimeEntry } from "@/api/types";
import { secondsToHours } from "@/utils/format";
import ProjectIndicator from "@/components/ProjectIndicator.vue";
import useSelectedTimeEntry from "@/composables/useSelectedTimeEntry";
import { useStore } from "vuex";
import { RootState } from "@/store";
import { ActionTypes } from "@/store/actions";

export default defineComponent({
  name: "TimeEntryEntry",
  components: {
    ProjectIndicator,
  },
  props: {
    timeEntry: {
      type: Object as PropType<TimeEntry>,
      required: true,
    },
  },
  setup(props) {
    const store = useStore<RootState>();
    const duration = computed(() => secondsToHours(props.timeEntry.duration));
    const description = computed(() => props.timeEntry.description);
    const project = computed(() => props.timeEntry?.project?.data);
    const { setSelectedTimeEntry } = useSelectedTimeEntry();

    function handleTimeEntryEntryClick() {
      setSelectedTimeEntry(props.timeEntry);
    }

    function handleResumeTimeEntryClick() {
      store.dispatch(ActionTypes.RESUME_TIME_ENTRY, props.timeEntry);
    }

    return {
      duration,
      description,
      handleTimeEntryEntryClick,
      handleResumeTimeEntryClick,
      project,
    };
  },
});
</script>
