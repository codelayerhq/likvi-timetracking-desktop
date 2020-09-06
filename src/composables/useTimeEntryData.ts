import { TimeEntry } from "@/api/types";
import useCurrentDate from "./useCurrentDate";
import { computed, ComputedRef, Ref } from "vue";
import { parseISO, differenceInSeconds } from "date-fns";
import { secondsToHours } from "@/utils/format";

interface ReturnObject {
  startedAtDate: ComputedRef<Date>;
  stoppedAtDate: ComputedRef<Date>;
  durationInSec: ComputedRef<number>;
  durationHumanReadable: ComputedRef<string>;
  description: ComputedRef<string>;
}

export default function useTimeEntryData(
  timeEntry: Ref<TimeEntry>
): ReturnObject {
  const { date: now } = useCurrentDate();

  const startedAtDate = computed(
    (): Date => parseISO(timeEntry.value.started_at.date)
  );
  const stoppedAtDate = computed(
    (): Date => {
      return parseISO(timeEntry.value.started_at.date);
    }
  );
  const durationInSec = computed((): number => {
    const end = timeEntry.value.stopped_at === null ? now : stoppedAtDate;
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
