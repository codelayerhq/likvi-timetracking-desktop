import axios from "./axiosInstance";
import { Method, AxiosPromise } from "axios";

interface Params {
  include?: string;
  limit?: string;
  filter?: string;
  sort?: string;
  page?: string;
  q?: string;
  mode?: string;
}

export default class ApiService {
  baseUrl = "";
  params: Params = {};
  currentTeamId: number;

  constructor() {
    // Todo: Find better solution.
    // If useing the store and a computed getter for the team the test break,
    // because of a circular dependency that the ApiService import store and the store
    // imports the Services which extend the ApiService.
    this.currentTeamId = Number.parseInt(
      window.localStorage.getItem("auth.currentTeamId") ?? "-1"
    );
  }

  /**
   * Include other resources into the request
   */
  include(...resources: string[]): this {
    this.params.include = this.parseParameterArray(resources).join(",");

    return this;
  }

  /**
   * Add filters to the request
   */
  filter(...rules: string[] | string[][][]): this {
    this.params.filter = this.parseParameterArray(rules, true)
      .map((rule) => {
        if (Array.isArray(rule[2])) rule[2] = "{" + rule[2].join(";") + "}";

        return rule.join(":");
      })
      .join(",");

    return this;
  }

  /**
   * Sort the query results
   */
  sort(...rules: string[] | string[][]): this {
    this.params.sort = this.parseParameterArray(rules).join(":");

    return this;
  }

  /**
   * Return the given page
   */
  page(page: number | string): this {
    this.params.page = page.toString();

    return this;
  }

  /**
   * Limit the number of results
   */
  limit(count: number | string): this {
    this.params.limit = count.toString();

    return this;
  }

  /**
   * Make an http request using axios
   */
  call(
    method: Method,
    url: string,
    data: unknown = {},
    headers = {},
    options = {}
  ): AxiosPromise {
    return axios.request(
      Object.assign(
        {
          method,
          url,
          params: this.params,
          data,
          headers,
        },
        options
      )
    );
  }

  /**
   * Check if one parameter array or multiple parameters were passed
   */
  parseParameterArray(
    params: Array<unknown>,
    paramsAreArrays = false
  ): string[][] {
    if (paramsAreArrays === true) {
      return Array.isArray(params[0]) && Array.isArray(params[0][0])
        ? params[0]
        : params;
    }

    return Array.isArray(params[0]) ? params[0] : params;
  }

  /**
   * Parse the parameter array and join the elements using a comma
   */
  parseAndJoin(params: number[]): string {
    return this.parseParameterArray(params).join(",");
  }
}
