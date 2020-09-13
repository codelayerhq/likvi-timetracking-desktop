import ApiService from "./ApiService";
import { AxiosPromise } from "axios";

const BASE_URL = "statistics";

export default class StatisticsService extends ApiService {
  constructor() {
    super();

    this.baseUrl = `teams/${this.currentTeamId.value}/${BASE_URL}`;
  }

  /**
   * Get a list of all statistics for the current company
   *
   */
  list(data: unknown): AxiosPromise {
    return this.call("post", this.baseUrl, data);
  }
}
