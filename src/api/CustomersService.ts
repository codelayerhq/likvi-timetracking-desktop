import ApiService from "./ApiService";
import { AxiosPromise } from "axios";
import { CollectionResponse, Customer, ItemResponse } from "./types";

const BASE_URL = "customers";

export default class ProjectsService extends ApiService {
  baseUrl = `teams/${this.currentTeamId}/${BASE_URL}`;

  /**
   * Get a list of all customers for the current company
   */
  list(): AxiosPromise<CollectionResponse<Customer>> {
    return this.call("get", this.baseUrl);
  }

  /**
   * Show the specified customers
   */
  get(...id: number[]): AxiosPromise<ItemResponse<Customer[]>> {
    return this.call("get", `${this.baseUrl}/${this.parseAndJoin(id)}`);
  }

  /**
   * Create a new customer
   */
  create(data: unknown): AxiosPromise<ItemResponse<Customer>> {
    return this.call("post", this.baseUrl, data);
  }

  /**
   * Update an existing customer
   */
  update(
    customerId: number,
    data: unknown
  ): AxiosPromise<ItemResponse<Customer>> {
    return this.call("patch", `${this.baseUrl}/${customerId}`, data);
  }

  /**
   * Delete the specified customers
   */
  destroy(...customerId: number[]): AxiosPromise<ItemResponse<Customer>> {
    return this.call(
      "delete",
      `${this.baseUrl}/${this.parseAndJoin(customerId)}`
    );
  }

  /**
   * Search for customers
   */
  search(query: string): AxiosPromise<CollectionResponse<Customer>> {
    this.params.q = query;

    return this.call("get", `${this.baseUrl}/search`);
  }

  /**
   * Suggest customers
   */
  suggest(): AxiosPromise<ItemResponse<Customer[]>> {
    return this.call("get", `${this.baseUrl}/suggest`);
  }
}
