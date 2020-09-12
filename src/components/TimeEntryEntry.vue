<template>
  <div
    class="flex items-center justify-between h-16 px-8 py-2 bg-gray-100 border-b border-gray-200 cursor-pointer hover:bg-white focus:bg-white focus:outline-none"
    tabindex="2"
    @click="handleTimeEntryEntryClick"
  >
    <div>
      <span class="block text-xs font-bold text-gray-900">
        {{ description }}
      </span>
      <project-indicator :project="project" />
    </div>

    <span class="block text-sm text-gray-600">
      {{ duration }}
    </span>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, computed } from "vue";
import { TimeEntry } from "@/api/types";
import { secondsToHours } from "@/utils/format";
import ProjectIndicator from "@/components/ProjectIndicator.vue";
import useSelectedTimeEntry from "@/composables/useSelectedTimeEntry";

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
    const duration = computed(() => secondsToHours(props.timeEntry.duration));
    const description = computed(() => props.timeEntry.description);
    const project = computed(() => props.timeEntry?.project?.data);
    const { setSelectedTimeEntry } = useSelectedTimeEntry();

    function handleTimeEntryEntryClick() {
      setSelectedTimeEntry(props.timeEntry);
    }

    return {
      duration,
      description,
      handleTimeEntryEntryClick,
      project,
    };
  },
});
</script>
