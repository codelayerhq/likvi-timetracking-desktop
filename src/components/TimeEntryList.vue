<template>
  <div v-if="hasTimeEntries">
    <div v-for="(groupedTimeEntries, day) in timeEntriesGrouped" :key="day">
      <h2 class="px-2 py-2 text-xs font-semibold text-gray-700">{{ day }}</h2>
      <section
        v-for="(timeEntries, description) in groupedTimeEntries"
        :key="`${day}_${description}`"
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

  <div v-else class="flex flex-col items-center justify-center">
    <img src="@/assets/empty-state.png" width="220" class="block mb-8" />
    <h3 class="mb-1 font-semibold text-gray-700">
      {{ t("timeEntriesEmptyState.heading") }}
    </h3>
    <span class="text-sm text-gray-600">
      {{ t("timeEntriesEmptyState.text") }}
    </span>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from "vue";
import TimeEntryEntry from "@/components/TimeEntryEntry.vue";
import GroupedTimeEntryEntry from "@/components/GroupedTimeEntryEntry.vue";
import useSortedTimeEntries from "@/composables/useSortedTimeEntries";
import { groupBy } from "@/utils/groupBy";
import { parseISO } from "date-fns";
import { useI18n } from "vue-i18n";

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
        parseISO(timeEntry.started_at.date + "Z").toLocaleDateString(
          undefined,
          { weekday: "long", year: "numeric", month: "2-digit", day: "2-digit" }
        )
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

    const hasTimeEntries = computed(() => timeEntries.value.length > 0);

    return {
      ...useI18n(),
      hasTimeEntries,
      timeEntriesGrouped,
    };
  },
});
</script>
