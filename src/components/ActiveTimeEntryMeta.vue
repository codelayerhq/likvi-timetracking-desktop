<template>
  <div>
    <span class="block text-sm text-gray-200 leading-tigh">
      {{ durationHumanReadable }}
    </span>
    <span class="block mb-1 text-sm font-semibold text-white">
      {{ description }}
    </span>
    <project-indicator :project="dummyProject" />
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, computed } from "vue";
import ProjectIndicator from "@/components/ProjectIndicator.vue";
import { dummyProject } from "@/api/dummy-data";
import { TimeEntry } from "@/api/types";
import useTimeEntryData from "@/composables/useTimeEntryData";

export default defineComponent({
  name: "ActiveTimeEntryMeta",
  components: {
    ProjectIndicator,
  },
  props: {
    activeTimeEntry: {
      type: Object as PropType<TimeEntry>,
      required: true,
    },
  },
  setup(props) {
    const activeTimeEntry = computed(() => props.activeTimeEntry);

    const { durationHumanReadable, description } = useTimeEntryData(
      activeTimeEntry
    );

    return {
      dummyProject,
      durationHumanReadable,
      description,
    };
  },
});
</script>
