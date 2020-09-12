import { useStore } from "vuex";
import { RootState } from "@/store";
import { computed, ComputedRef } from "vue";
import { parse, compareDesc } from "date-fns";
import { TimeEntry } from "@/api/types";

export default function useSortedTimeEntries(): ComputedRef<TimeEntry[]> {
  const store = useStore<RootState>();
  const timeEntries = computed(() => store.state.timeEntries);
  const sortedTimeEntries = computed(() =>
    timeEntries.value.sort((a, b) => {
      const aStart = parse(
        a.started_at.date,
        "yyyy-MM-dd HH:mm:ss",
        new Date()
      );
      const bStart = parse(
        b.started_at.date,
        "yyyy-MM-dd HH:mm:ss",
        new Date()
      );

      return compareDesc(aStart, bStart);
    })
  );

  return sortedTimeEntries;
}
