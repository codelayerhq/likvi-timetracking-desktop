export enum ActionTypes {
  // Root
  SET_START_DATE = "SET_START_DATE",
  SET_END_DATE = "SET_END_DATE",
  SET_ACTIVE_TIME_ENTRY = "SET_ACTIVE_TIME_ENTRY",
  SET_SELECTED_TIME_ENTRY = "SET_SELECTED_TIME_ENTRY",
  FETCH_TIME_ENTRIES = "FETCH_TIME_ENTRIES",
  FETCH_ACTIVE_TIME_ENTRY = "FETCH_ACTIVE_TIME_ENTRY",
  STOP_ACTIVE_TIME_ENTRY = "STOP_ACTIVE_TIME_ENTY",
  START_NEW_TIME_ENTRY = "START_NEW_TIME_ENTRY",
  UPDATE_SELECTED_TIME_ENTRY = "UPDATE_SELECTED_TIME_ENTRY",
  FETCH_STATISTICS = "FETCH_STATISTICS",

  // Auth
  LOGIN = "LOGIN",
  LOGOUT = "LOGOUT",
  VALIDATE = "VALIDATE",
}
