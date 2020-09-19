<template>
  <div>
    <div v-for="(groupedTimeEntries, day) in timeEntriesGrouped" :key="day">
      <h2 class="px-2 py-2 text-xs font-bold text-gray-700">{{ day }}</h2>
      <section
        v-for="(timeEntries, description) in groupedTimeEntries"
        :key="`${day}_${description}_${timeEntries.length}`"
        class="overflow-hidden rounded-md"
      >
        <grouped-time-entry-entry
          v-if="timeEntries.length > 1"
          :time-entries="timeEntries"
        />
        <time-entry-entry v-else :time-entry="timeEntries[0]" />
      </section>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, watch } from "vue";
import TimeEntryEntry from "@/components/TimeEntryEntry.vue";
import GroupedTimeEntryEntry from "@/components/GroupedTimeEntryEntry.vue";
import useSortedTimeEntries from "@/composables/useSortedTimeEntries";
import { groupBy } from "@/utils/groupBy";
import { parseISO } from "date-fns";

export default defineComponent({
  name: "TimeEntryList",
  components: {
    TimeEntryEntry,
    GroupedTimeEntryEntry,
  },
  setup() {
    const timeEntries = useSortedTimeEntries();

    /**
     * Returns the time entries grouped by day (in locale date string) and description.
     * The returned object is of the format { [day: string]: { [description_project_id: string]: TimeEntry[] } }
     */
    const timeEntriesGrouped = computed(() => {
      // Group time entries by day when the timer started
      const groupedByDay = groupBy(timeEntries.value, (timeEntry) =>
        // Append Z to interpret as UTC
        parseISO(timeEntry.started_at.date + "Z").toLocaleDateString()
      );

      // Group time entries in each day by description and project_id of the time entry
      return Object.fromEntries(
        Object.entries(groupedByDay).map(([key, value]) => [
          key,
          groupBy(
            value,
            (timeEntry) => `${timeEntry.description}_${timeEntry.project_id}`
          ),
        ])
      );
    });

    return {
      timeEntriesGrouped,
    };
  },
});
</script>
