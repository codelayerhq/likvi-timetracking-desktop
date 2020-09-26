import axios from "./axiosInstance";
import { AxiosPromise } from "axios";
import { ItemResponse, LoginResponse } from "./types";

export interface LogInDetails {
  email: string;
  password: string;
}

export function login({
  email,
  password,
}: LogInDetails): AxiosPromise<ItemResponse<LoginResponse>> {
  return axios.post("/authenticate", { email, password });
}

export function validate(): AxiosPromise<"pong"> {
  return axios.get("/ping");
}
