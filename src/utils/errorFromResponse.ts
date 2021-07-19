import useNotifications from "@/composables/useNotifications";
import { AxiosError } from "axios";
import i18n from "@/i18n";

function getErrorMessageFromResponse(error: AxiosError): string {
  const errorCode = getErrorCodeFromResponse(error);

  if (errorCode === "VALIDATION") {
    return error.response?.data.errors[
      Object.keys(error.response.data.errors)[0]
    ][0];
  }
  return i18n.global.t(`errors.${errorCode}`);
}

function getErrorCodeFromResponse(error: AxiosError): string {
  return error.response?.data.error_code ?? "UNKNOWN_ERROR";
}

export default function errorFromResponse(error: AxiosError): void {
  const { notify } = useNotifications();
  notify({
    title: i18n.global.t("errors.error"),
    body: getErrorMessageFromResponse(error),
    type: "negative",
  });
}
