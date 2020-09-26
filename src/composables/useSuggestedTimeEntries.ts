import { ref, Ref } from "vue";
import TimeEntriesService from "@/api/TimeEntriesService";

interface ReturnObject {
  suggestedTimeEntries: Ref;
  fetchSuggestedTimeEntries: () => Promise<void>;
}

const suggestedTimeEntries = ref();

export default function useSuggestedTimeEntries(): ReturnObject {
  async function fetchSuggestedTimeEntries(): Promise<void> {
    const {
      data: { data: timeEntries },
    } = await new TimeEntriesService().suggest("");

    suggestedTimeEntries.value = timeEntries;

    return Promise.resolve();
  }
  return {
    suggestedTimeEntries,
    fetchSuggestedTimeEntries,
  };
}
