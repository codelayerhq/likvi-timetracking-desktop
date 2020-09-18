import { TimeEntry } from "@/api/types";
import { toDateTimeStrUTC } from "./dateTimeStrUTC";

export function timeEntryToPayload(timeEntry: TimeEntry): unknown {
  return {
    customer_id: timeEntry.customer_id,
    project_id: timeEntry.project_id,
    description: timeEntry.description,
    billable: timeEntry.billable,
    started_at: toDateTimeStrUTC(new Date()),
    stopped_at: null,
  };
}
