import axios from "./axios";

export interface LogInDetails {
  email: string;
  password: string;
}

export function login({ email, password }: LogInDetails) {
  return axios.post("/authenticate", { email, password });
}

export function validate() {
  return axios.get("/ping");
}
