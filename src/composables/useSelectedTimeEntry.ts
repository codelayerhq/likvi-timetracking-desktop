import { useStore } from "vuex";
import { computed, ComputedRef } from "vue";
import { TimeEntry } from "@/api/types";
import { ActionTypes } from "@/store/actions";
import { RootState } from "@/store";

interface ReturnObject {
  selectedTimeEntry: ComputedRef<TimeEntry | null>;
  hasSelectedTimeEntry: ComputedRef<boolean>;
  setSelectedTimeEntry(timeEntry: TimeEntry | null): void;
}

export default function useSelectedTimeEntry(): ReturnObject {
  const store = useStore<RootState>();
  const selectedTimeEntry = computed(() => store.state.selectedTimeEntry);
  const hasSelectedTimeEntry = computed(() => selectedTimeEntry.value !== null);

  function setSelectedTimeEntry(timeEntry: TimeEntry | null) {
    store.dispatch(ActionTypes.SET_SELECTED_TIME_ENTRY, timeEntry);
  }

  return {
    selectedTimeEntry,
    hasSelectedTimeEntry,
    setSelectedTimeEntry,
  };
}
