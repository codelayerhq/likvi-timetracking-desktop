<template>
  <div>
    <time-entry-entry
      v-for="(timeEntry, index) in timeEntries"
      :key="index"
      :time-entry="timeEntry"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import TimeEntryEntry from "@/components/TimeEntryEntry.vue";
import useSortedTimeEntries from "@/composables/useSortedTimeEntries";

export default defineComponent({
  name: "TimeEntryList",
  components: {
    TimeEntryEntry,
  },
  setup() {
    const timeEntries = useSortedTimeEntries();

    return {
      timeEntries,
    };
  },
});
</script>
