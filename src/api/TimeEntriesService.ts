import ApiService from "./ApiService";
import { AxiosPromise } from "axios";
import {
  CollectionResponse,
  ItemResponse,
  TimeEntry,
  TimeEntryPayload,
} from "./types";

const BASE_URL = "time-entries";

export default class TimeEntriesService extends ApiService {
  baseUrl = `teams/${this.currentTeamId}/${BASE_URL}`;

  /**
   * Get a list of all time entries for the current company
   */
  list(): AxiosPromise<CollectionResponse<TimeEntry>> {
    return this.call("get", this.baseUrl);
  }

  /**
   * Show the specified time entries
   */
  get(...id: number[]): AxiosPromise<ItemResponse<TimeEntry>> {
    return this.call("get", `${this.baseUrl}/${this.parseAndJoin(id)}`);
  }

  /**
   * Create a new time entry
   */
  create(data: TimeEntryPayload): AxiosPromise<ItemResponse<TimeEntry>> {
    return this.call("post", this.baseUrl, data);
  }

  /**
   * Update an existing time entry
   */
  update(
    timeEntryId: number,
    data: TimeEntryPayload
  ): AxiosPromise<ItemResponse<TimeEntry>> {
    return this.call("patch", `${this.baseUrl}/${timeEntryId}`, data);
  }

  /**
   * Delete the specified time entries
   */
  destroy(...timeEntryId: number[]): AxiosPromise<ItemResponse<TimeEntry>> {
    return this.call(
      "delete",
      `${this.baseUrl}/${this.parseAndJoin(timeEntryId)}`
    );
  }

  /**
   * Search for time entries
   */
  search(query: string): AxiosPromise<CollectionResponse<TimeEntry>> {
    this.params.q = query;

    return this.call("get", `${this.baseUrl}/search`);
  }

  /**
   * Suggest time entries
   */
  suggest(): AxiosPromise<ItemResponse<TimeEntry[]>> {
    return this.call("get", `${this.baseUrl}/suggest`);
  }

  /**
   * Get the active time entry of the current user
   */
  active(): AxiosPromise<ItemResponse<TimeEntry>> {
    return this.call("get", `${this.baseUrl}/active`);
  }
}
