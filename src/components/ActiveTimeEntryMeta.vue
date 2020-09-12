<template>
  <div>
    <span class="block text-sm text-gray-200 leading-tigh">
      {{ durationHumanReadable }}
    </span>
    <span class="block mb-1 text-sm font-semibold text-white">
      {{ description }}
    </span>
    <project-indicator :project="project" />
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, computed } from "vue";
import ProjectIndicator from "@/components/ProjectIndicator.vue";
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
    const project = computed(() => activeTimeEntry.value?.project?.data);

    const { durationHumanReadable, description } = useTimeEntryData(
      activeTimeEntry
    );

    return {
      project,
      durationHumanReadable,
      description,
    };
  },
});
</script>
