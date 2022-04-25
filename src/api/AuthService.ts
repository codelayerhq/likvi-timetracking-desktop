import axios from "./axiosInstance";
import { AxiosPromise } from "axios";
import { ItemResponse, LoginResponse, User } from "./types";
import { AxiosAuthRefreshRequestConfig } from "axios-auth-refresh";

export interface LogInDetails {
  email: string;
  password: string;
  otp?: string;
}

export function login({
  email,
  password,
  otp,
}: LogInDetails): AxiosPromise<ItemResponse<LoginResponse>> {
  // We need to skipAuthRefresh, otherwise the request gets stalled and a auth refresh starts.
  return axios.post("/authenticate", { email, password, otp }, {
    skipAuthRefresh: true,
  } as AxiosAuthRefreshRequestConfig);
}

export function getUser(): AxiosPromise<ItemResponse<User>> {
  return axios.get("/users/me", {
    params: {
      include: "teams",
    },
  });
}

export function validate(): AxiosPromise<"pong"> {
  return axios.get("/ping");
}
