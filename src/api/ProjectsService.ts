import ApiService from "./ApiService";
import { AxiosPromise } from "axios";
import {
  CollectionResponse,
  ItemResponse,
  Project,
  ProjectPayload,
} from "./types";

const BASE_URL = "projects";

export default class ProjectsService extends ApiService {
  baseUrl = `teams/${this.currentTeamId}/${BASE_URL}`;

  /**
   * Get a list of all projects for the current company
   */
  list(): AxiosPromise<CollectionResponse<Project>> {
    return this.call("get", this.baseUrl);
  }

  /**
   * Show the specified projects
   */
  get(...id: number[]): AxiosPromise<ItemResponse<Project>> {
    return this.call("get", `${this.baseUrl}/${this.parseAndJoin(id)}`);
  }

  /**
   * Create a new project
   */
  create(data: ProjectPayload): AxiosPromise<ItemResponse<Project>> {
    return this.call("post", this.baseUrl, data);
  }

  /**
   * Update an existing project
   */
  update(
    projectId: number,
    data: ProjectPayload
  ): AxiosPromise<ItemResponse<Project>> {
    return this.call("patch", `${this.baseUrl}/${projectId}`, data);
  }

  /**
   * Delete the specified projects
   */
  destroy(...projectId: number[]): AxiosPromise<ItemResponse<Project>> {
    return this.call(
      "delete",
      `${this.baseUrl}/${this.parseAndJoin(projectId)}`
    );
  }

  /**
   * Search for projects
   */
  search(query: string): AxiosPromise<CollectionResponse<Project>> {
    this.params.q = query;

    return this.call("get", `${this.baseUrl}/search`);
  }

  /**
   * Suggest projects
   */
  suggest(): AxiosPromise<ItemResponse<Project[]>> {
    return this.call("get", `${this.baseUrl}/suggest`);
  }

  /**
   * Get all open entries of the project
   */
  openEntries(projectId: number, mode: string): AxiosPromise {
    this.params.mode = mode;

    return this.call("get", `${this.baseUrl}/${projectId}/open-time-entries`);
  }
}
