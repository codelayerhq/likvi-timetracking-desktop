import axios, { AxiosError, AxiosResponse } from "axios";
import createAuthRefreshInterceptor, {
  AxiosAuthRefreshRequestConfig,
} from "axios-auth-refresh";
import errorFromResponse from "@/utils/errorFromResponse";

const instance = axios.create({
  baseURL: process.env.VUE_APP_API_BASE_URL,
});

function getAccessToken() {
  const token = localStorage.getItem("auth.token");

  if (typeof token === "string") {
    return JSON.parse(token);
  }

  return null;
}

// Dynamically inject token to make sure stalled request use new token after auth refresh.
// ToDo: Accessing the local storage on each request may be slow, find alternative.
instance.interceptors.request.use((request) => {
  request.headers["Authorization"] = `Bearer ${getAccessToken()}`;
  return request;
});

instance.interceptors.response.use(
  (response: AxiosResponse) => response,
  errorFromResponse
);

const refreshAuthLogic = async (failedRequest: AxiosError) => {
  const {
    data: {
      data: { token },
    },
  } = await instance.post("/refresh-token", null, {
    skipAuthRefresh: true,
  } as AxiosAuthRefreshRequestConfig);

  window.localStorage.setItem("auth.token", JSON.stringify(token));

  if (failedRequest.response) {
    failedRequest.response.config.headers["Authorization"] = "Bearer " + token;
  }

  return;
};

createAuthRefreshInterceptor(instance, refreshAuthLogic);

export default instance;
