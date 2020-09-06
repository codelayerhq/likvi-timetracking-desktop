import { ref, Ref } from "vue";
import { suggestedTimeEntries as dummy } from "@/api/dummy-data";

interface ReturnObject {
  suggestedTimeEntries: Ref;
  fetchSuggestedTimeEntries: () => Promise<void>;
}

const suggestedTimeEntries = ref();

export default function useSuggestedTimeEntries(): ReturnObject {
  async function fetchSuggestedTimeEntries(): Promise<void> {
    suggestedTimeEntries.value = await dummy;

    return Promise.resolve();
  }
  return {
    suggestedTimeEntries,
    fetchSuggestedTimeEntries,
  };
}
