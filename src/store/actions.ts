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
  SET_SYSTEM_IDLE_TIME = "SET_SYSTEM_IDLE_TIME",
  RESUME_TIME_ENTRY = "RESUME_TIME_ENTRY",
  DELETE_TIME_ENTRY = "DELETE_TIME_ENTRY",
  FETCH_DATA = "FETCH_DATA",
  SET_ADD_PROJECT_MODAL_OPEN = "SET_ADD_PROJECT_MODAL_OPEN",
  CREATE_PROJECT = "CREATE_PROJECT",

  // Auth
  LOGIN = "LOGIN",
  LOGIN_FROM_TOKEN = "LOGIN_FROM_TOKEN",
  LOGOUT = "LOGOUT",
  VALIDATE = "VALIDATE",
  SWITCH_TEAM = "SWITCH_TEAM",
}
