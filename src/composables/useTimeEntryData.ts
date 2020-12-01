import { TimeEntry } from "@/api/types";
import useCurrentDate from "./useCurrentDate";
import { computed, ComputedRef, Ref } from "vue";
import { parseISO, differenceInSeconds } from "date-fns";
import { secondsToHours } from "@/utils/format";

interface ReturnObject {
  startedAtDate: ComputedRef<Date>;
  stoppedAtDate: ComputedRef<Date | null>;
  durationInSec: ComputedRef<number>;
  durationHumanReadable: ComputedRef<string>;
  description: ComputedRef<string>;
}

export default function useTimeEntryData(
  timeEntry: Ref<TimeEntry>
): ReturnObject {
  const now = useCurrentDate();

  const startedAtDate = computed(
    // Append "Z" to interpret as UTC date
    (): Date => parseISO(timeEntry.value.started_at.date + "Z")
  );
  const stoppedAtDate = computed(
    // Append "Z" to interpret as UTC date
    (): Date | null =>
      timeEntry.value.stopped_at
        ? parseISO(timeEntry.value.stopped_at.date + "Z")
        : null
  );
  const durationInSec = computed((): number => {
    const end = (stoppedAtDate.value !== null
      ? stoppedAtDate
      : now) as Ref<Date>;
    return differenceInSeconds(end.value, startedAtDate.value);
  });
  const durationHumanReadable = computed((): string =>
    secondsToHours(durationInSec.value)
  );
  const description = computed((): string => timeEntry.value.description);

  return {
    startedAtDate,
    stoppedAtDate,
    durationInSec,
    durationHumanReadable,
    description,
  };
}
