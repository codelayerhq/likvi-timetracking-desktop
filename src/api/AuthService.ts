import axios from "./axios";
import { AxiosPromise } from "axios";

export interface LogInDetails {
  email: string;
  password: string;
}

export function login({ email, password }: LogInDetails): AxiosPromise {
  return axios.post("/authenticate", { email, password });
}

export function validate(): AxiosPromise {
  return axios.get("/ping");
}
