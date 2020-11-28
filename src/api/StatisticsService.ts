import ApiService from "./ApiService";
import { AxiosPromise } from "axios";
import { ItemResponse, Statistic } from "./types";

const BASE_URL = "statistics";

export default class StatisticsService extends ApiService {
  baseUrl = `teams/${this.currentTeamId}/${BASE_URL}`;

  /**
   * Get a list of all statistics for the current company
   *
   */
  list(data: unknown): AxiosPromise<ItemResponse<Statistic[]>> {
    return this.call("post", this.baseUrl, data);
  }
}
