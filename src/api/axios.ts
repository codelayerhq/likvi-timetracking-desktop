import axios, { AxiosError } from "axios";
import createAuthRefreshInterceptor from "axios-auth-refresh";

const instance = axios.create({
  baseURL: process.env.VUE_APP_API_BASE_URL,
});

const refreshAuthLogic = (failedRequest: AxiosError) =>
  instance.post("/refresh-token").then((tokenRefreshResponse) => {
    const {
      data: {
        data: { token },
      },
    } = tokenRefreshResponse;

    localStorage.setItem("auth.token", token);

    if (failedRequest.response) {
      failedRequest.response.config.headers["Authorization"] =
        "Bearer " + token;
    }

    return Promise.resolve();
  });

createAuthRefreshInterceptor(instance, refreshAuthLogic);

export default instance;
