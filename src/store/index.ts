import { createStore } from "vuex";
import auth from "./modules/auth";
import { startOfWeek, endOfWeek } from "date-fns";
import { TimeEntry } from "@/api/types";

interface State {
  startDate: Date;
  endDate: Date;
  activeTimeEntry: TimeEntry | null;
  selectedTimeEntry: TimeEntry | null;
}

export default createStore<State>({
  state: {
    startDate: startOfWeek(new Date(), { weekStartsOn: 1 }),
    endDate: endOfWeek(new Date(), { weekStartsOn: 1 }),
    activeTimeEntry: null,
    selectedTimeEntry: null,
  },
  actions: {
    setStartDate({ commit }, date: Date) {
      commit("SET_START_DATE", date);
    },
    setEndDate({ commit }, date: Date) {
      commit("SET_END_DATE", date);
    },
    setActiveTimeEntry({ commit }, timeEntry: TimeEntry) {
      commit("SET_ACTIVE_TIME_ENTRY", timeEntry);
    },
    setSelectedTimeEntry({ commit }, timeEntry: TimeEntry) {
      commit("SET_SELECTED_TIME_ENTRY", timeEntry);
    },
  },
  mutations: {
    SET_START_DATE(state, date: Date) {
      state.startDate = date;
    },
    SET_END_DATE(state, date: Date) {
      state.endDate = date;
    },
    SET_ACTIVE_TIME_ENTRY(state, activeTimeEntry: TimeEntry) {
      state.activeTimeEntry = activeTimeEntry;
    },
    SET_SELECTED_TIME_ENTRY(state, selectedTimeEntry: TimeEntry) {
      state.selectedTimeEntry = selectedTimeEntry;
    },
  },
  modules: {
    auth,
  },
});
