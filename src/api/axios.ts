import axios, { AxiosError } from "axios";
import createAuthRefreshInterceptor from "axios-auth-refresh";

const instance = axios.create({
  baseURL: process.env.VUE_APP_API_BASE_URL,
});

const refreshAuthLogic = async (failedRequest: AxiosError) => {
  const {
    data: {
      data: { token },
    },
  } = await instance.post("/refresh-token");

  window.localStorage.setItem("auth.token", JSON.stringify(token));

  if (failedRequest.response) {
    failedRequest.response.config.headers["Authorization"] = "Bearer " + token;
  }

  return;
};

createAuthRefreshInterceptor(instance, refreshAuthLogic, {
  pauseInstanceWhileRefreshing: true,
});

export default instance;
