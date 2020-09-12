import { createStore } from "vuex";
import auth from "./modules/auth";
import { startOfWeek, endOfWeek, format, startOfDay, endOfDay } from "date-fns";
import { TimeEntry } from "@/api/types";
import TimeEntriesService from "@/api/TimeEntriesService";

const DEFAULT_INCLUDES = ["project", "user", "customer"];

export interface RootState {
  startDate: Date;
  endDate: Date;
  activeTimeEntry: TimeEntry | null;
  selectedTimeEntry: TimeEntry | null;
  timeEntries: TimeEntry[];
}

export default createStore<RootState>({
  state: {
    startDate: startOfWeek(new Date(), { weekStartsOn: 1 }),
    endDate: endOfWeek(new Date(), { weekStartsOn: 1 }),
    activeTimeEntry: null,
    selectedTimeEntry: null,
    timeEntries: [],
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
    async fetchTimeEntries({ commit, state }) {
      const {
        data: { data: timeEntries },
      } = await new TimeEntriesService()
        .include(...DEFAULT_INCLUDES)
        .filter([
          [
            "started_at",
            ">",
            format(startOfDay(state.startDate), "yyyy-MM-dd"),
          ],
          ["started_at", "<", format(endOfDay(state.endDate), "yyyy-MM-dd")],
          ["running", "=", "false"],
        ])
        .list();

      commit("SET_TIME_ENTRIES", timeEntries);
    },
    async fetchActiveTimeEntry({ commit }) {
      try {
        const {
          data: { data: timeEntry },
        } = await new TimeEntriesService()
          .include(...DEFAULT_INCLUDES)
          .active();

        return commit("SET_ACTIVE_TIME_ENTRY", timeEntry);
      } catch (error) {
        return;
      }
    },
    async stopActiveTimeEntry({ commit, state, dispatch }) {
      if (state.activeTimeEntry !== null) {
        const id = state.activeTimeEntry.id;

        await new TimeEntriesService().include(...DEFAULT_INCLUDES).update(id, {
          stopped_at: format(new Date(), "yyyy-MM-dd HH:mm:ss"),
        });

        commit("SET_ACTIVE_TIME_ENTRY", null);

        return dispatch("fetchTimeEntries");
      }
    },
    async startNewTimeEntry({ commit }, description: string) {
      const {
        data: { data: timeEntry },
      } = await new TimeEntriesService().include(...DEFAULT_INCLUDES).create({
        description,
        started_at: format(new Date(), "yyyy-MM-dd HH:mm:ss"),
      });

      return commit("SET_ACTIVE_TIME_ENTRY", timeEntry);
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
    SET_TIME_ENTRIES(state, timeEntries: TimeEntry[]) {
      state.timeEntries = timeEntries;
    },
  },
  modules: {
    auth,
  },
});
