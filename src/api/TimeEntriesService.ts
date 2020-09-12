import ApiService from "./ApiService";
import { AxiosPromise } from "axios";

const BASE_URL = "/time-entries";

export default class TimeEntriesService extends ApiService {
  constructor() {
    super();

    this.baseUrl = `teams/${this.currentTeamId.value}/time-entries`;
  }

  /**
   * Get a list of all time entries for the current company
   */
  list(): AxiosPromise {
    return this.call("get", this.baseUrl);
  }

  /**
   * Show the specified time entries
   */
  get(...id: number[]): AxiosPromise {
    return this.call("get", `${this.baseUrl}/${this.parseAndJoin(id)}`);
  }

  /**
   * Create a new time entry
   */
  create(data: unknown): AxiosPromise {
    return this.call("post", this.baseUrl, data);
  }

  /**
   * Update an existing time entry
   */
  update(timeEntryId: number, data: unknown): AxiosPromise {
    return this.call("patch", `${this.baseUrl}/${timeEntryId}`, data);
  }

  /**
   * Delete the specified time entries
   */
  destroy(...timeEntryId: number[]): AxiosPromise {
    return this.call(
      "delete",
      `${this.baseUrl}/${this.parseAndJoin(timeEntryId)}`
    );
  }

  /**
   * Search for time entries
   */
  search(query: string): AxiosPromise {
    this.params.q = query;

    return this.call("get", `${this.baseUrl}/search`);
  }

  /**
   * Suggest time entries
   */
  suggest(query: string): AxiosPromise {
    this.params.q = query;

    return this.call("get", `${this.baseUrl}/suggest`);
  }

  /**
   * Get the active time entry of the current user
   */
  active(): AxiosPromise {
    return this.call("get", `${this.baseUrl}/active`);
  }
}
