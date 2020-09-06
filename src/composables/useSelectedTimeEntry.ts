import { useStore } from "vuex";
import { computed, ComputedRef } from "vue";
import { TimeEntry } from "@/api/types";

interface ReturnObject {
  selectedTimeEntry: ComputedRef<TimeEntry>;
  hasSelectedTimeEntry: ComputedRef<boolean>;
  setSelectedTimeEntry(timeEntry: TimeEntry | null): void;
}

export default function useSelectedTimeEntry(): ReturnObject {
  const store = useStore();
  const selectedTimeEntry = computed(() => store.state.selectedTimeEntry);
  const hasSelectedTimeEntry = computed(() => selectedTimeEntry.value !== null);

  function setSelectedTimeEntry(timeEntry: TimeEntry | null) {
    store.dispatch("setSelectedTimeEntry", timeEntry);
  }

  return {
    selectedTimeEntry,
    hasSelectedTimeEntry,
    setSelectedTimeEntry,
  };
}
