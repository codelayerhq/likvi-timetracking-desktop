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
import { dummyTimeEntry } from "@/api/dummy-data";

export default defineComponent({
  name: "TimeEntryList",
  components: {
    TimeEntryEntry,
  },
  setup() {
    return {
      timeEntries: [
        dummyTimeEntry,
        dummyTimeEntry,
        dummyTimeEntry,
        dummyTimeEntry,
        dummyTimeEntry,
        dummyTimeEntry,
        dummyTimeEntry,
        dummyTimeEntry,
      ],
    };
  },
});
</script>
