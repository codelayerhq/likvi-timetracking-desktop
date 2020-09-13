import { ActionContext, ActionTree, createStore, MutationTree } from "vuex";
import auth from "./modules/auth";
import { startOfWeek, endOfWeek, format, startOfDay, endOfDay } from "date-fns";
import { Statistic, TimeEntry } from "@/api/types";
import TimeEntriesService from "@/api/TimeEntriesService";
import StatisticsService from "@/api/StatisticsService";
import { toDateStr } from "@/utils/dateStr";
import { MutationTypes } from "./mutation-types";
import { ActionTypes } from "./actions";

const DEFAULT_INCLUDES = ["project", "user", "customer"];

type AugmentedActionContext<S, R> = {
  commit<K extends keyof Mutations>(
    key: K,
    payload: Parameters<Mutations[K]>[1]
  ): ReturnType<Mutations[K]>;
} & Omit<ActionContext<S, R>, "commit">;

export interface RootState {
  startDate: Date;
  endDate: Date;
  activeTimeEntry: TimeEntry | null;
  selectedTimeEntry: TimeEntry | null;
  timeEntries: TimeEntry[];
  statistics: Statistic[];
}

interface Mutations<S = RootState> {
  [MutationTypes.SET_START_DATE](state: S, date: Date): void;
  [MutationTypes.SET_END_DATE](state: S, date: Date): void;
  [MutationTypes.SET_ACTIVE_TIME_ENTRY](
    state: S,
    activeTimeEntry: TimeEntry | null
  ): void;
  [MutationTypes.SET_SELECTED_TIME_ENTRY](
    state: S,
    selectedTimeEntry: TimeEntry | null
  ): void;
  [MutationTypes.SET_TIME_ENTRIES](state: S, timeEntries: TimeEntry[]): void;
  [MutationTypes.SET_STATISTICS](state: S, statistics: Statistic[]): void;
}

interface Actions<S = RootState, R = RootState> {
  [ActionTypes.SET_START_DATE](
    { commit }: AugmentedActionContext<S, R>,
    date: Date
  ): void;
  [ActionTypes.SET_END_DATE](
    { commit }: AugmentedActionContext<S, R>,
    date: Date
  ): void;
  [ActionTypes.SET_ACTIVE_TIME_ENTRY](
    { commit }: AugmentedActionContext<S, R>,
    timeEntry: TimeEntry
  ): void;
  [ActionTypes.SET_SELECTED_TIME_ENTRY](
    { commit }: AugmentedActionContext<S, R>,
    timeEntry: TimeEntry
  ): void;
  [ActionTypes.FETCH_TIME_ENTRIES]({
    commit,
    state,
  }: ActionContext<S, S>): void;
  [ActionTypes.FETCH_ACTIVE_TIME_ENTRY]({
    commit,
  }: AugmentedActionContext<S, R>): void;
  [ActionTypes.STOP_ACTIVE_TIME_ENTRY]({
    commit,
    state,
    dispatch,
  }: AugmentedActionContext<S, R>): void;
  [ActionTypes.START_NEW_TIME_ENTRY](
    { commit }: AugmentedActionContext<S, R>,
    description: string
  ): void;
  [ActionTypes.UPDATE_SELECTED_TIME_ENTRY](
    { commit, state }: AugmentedActionContext<S, R>,
    data: unknown
  ): void;
  [ActionTypes.FETCH_STATISTICS]({
    commit,
    state,
  }: AugmentedActionContext<S, R>): void;
}

const state: RootState = {
  startDate: startOfWeek(new Date(), { weekStartsOn: 1 }),
  endDate: endOfWeek(new Date(), { weekStartsOn: 1 }),
  activeTimeEntry: null,
  selectedTimeEntry: null,
  timeEntries: [],
  statistics: [],
};

const actions: ActionTree<RootState, RootState> & Actions = {
  [ActionTypes.SET_START_DATE]({ commit }, date: Date) {
    commit(MutationTypes.SET_START_DATE, date);
  },
  [ActionTypes.SET_END_DATE]({ commit }, date: Date) {
    commit(MutationTypes.SET_END_DATE, date);
  },
  [ActionTypes.SET_ACTIVE_TIME_ENTRY]({ commit }, timeEntry: TimeEntry) {
    commit(MutationTypes.SET_ACTIVE_TIME_ENTRY, timeEntry);
  },
  [ActionTypes.SET_SELECTED_TIME_ENTRY]({ commit }, timeEntry: TimeEntry) {
    commit(MutationTypes.SET_SELECTED_TIME_ENTRY, timeEntry);
  },
  async [ActionTypes.FETCH_TIME_ENTRIES]({ commit, state }) {
    const {
      data: { data: timeEntries },
    } = await new TimeEntriesService()
      .include(...DEFAULT_INCLUDES)
      .filter([
        ["started_at", ">", toDateStr(startOfDay(state.startDate))],
        ["started_at", "<", toDateStr(endOfDay(state.endDate))],
        ["running", "=", "false"],
      ])
      .list();

    commit(MutationTypes.SET_TIME_ENTRIES, timeEntries);
  },
  async [ActionTypes.FETCH_ACTIVE_TIME_ENTRY]({ commit }) {
    try {
      const {
        data: { data: timeEntry },
      } = await new TimeEntriesService().include(...DEFAULT_INCLUDES).active();

      return commit(MutationTypes.SET_ACTIVE_TIME_ENTRY, timeEntry);
    } catch (error) {
      return;
    }
  },
  async [ActionTypes.STOP_ACTIVE_TIME_ENTRY]({ commit, state, dispatch }) {
    if (state.activeTimeEntry !== null) {
      const id = state.activeTimeEntry.id;

      await new TimeEntriesService().include(...DEFAULT_INCLUDES).update(id, {
        stopped_at: format(new Date(), "yyyy-MM-dd HH:mm:ss"),
      });

      commit(MutationTypes.SET_ACTIVE_TIME_ENTRY, null);

      return dispatch(ActionTypes.FETCH_TIME_ENTRIES);
    }
  },
  async [ActionTypes.START_NEW_TIME_ENTRY]({ commit }, description: string) {
    const {
      data: { data: timeEntry },
    } = await new TimeEntriesService().include(...DEFAULT_INCLUDES).create({
      description,
      started_at: format(new Date(), "yyyy-MM-dd HH:mm:ss"),
    });

    return commit(MutationTypes.SET_ACTIVE_TIME_ENTRY, timeEntry);
  },
  async [ActionTypes.UPDATE_SELECTED_TIME_ENTRY](
    { commit, state },
    data: unknown
  ) {
    if (state.selectedTimeEntry === null) {
      return;
    }

    const {
      data: { data: timeEntry },
    } = await new TimeEntriesService()
      .include(...DEFAULT_INCLUDES)
      .update(state.selectedTimeEntry.id, data);

    return commit(MutationTypes.SET_SELECTED_TIME_ENTRY, timeEntry);
  },
  async [ActionTypes.FETCH_STATISTICS]({ commit, state }) {
    const {
      data: { data: statistics },
    } = await new StatisticsService().list({
      statistics: [
        {
          name: "time_entries",
          options: {
            unit: "day",
            start_date: toDateStr(state.startDate),
            end_date: toDateStr(state.endDate),
          },
        },
        {
          name: "project_seconds",
          options: {
            unit: "day",
            start_date: toDateStr(state.startDate),
            end_date: toDateStr(state.endDate),
          },
        },
      ],
    });

    commit(MutationTypes.SET_STATISTICS, statistics);
  },
};

const mutations: MutationTree<RootState> & Mutations = {
  [MutationTypes.SET_START_DATE](state: RootState, date: Date) {
    state.startDate = date;
  },
  [MutationTypes.SET_END_DATE](state: RootState, date: Date) {
    state.endDate = date;
  },
  [MutationTypes.SET_ACTIVE_TIME_ENTRY](
    state: RootState,
    activeTimeEntry: TimeEntry | null
  ) {
    state.activeTimeEntry = activeTimeEntry;
  },
  [MutationTypes.SET_SELECTED_TIME_ENTRY](
    state: RootState,
    selectedTimeEntry: TimeEntry | null
  ) {
    state.selectedTimeEntry = selectedTimeEntry;
  },
  [MutationTypes.SET_TIME_ENTRIES](state: RootState, timeEntries: TimeEntry[]) {
    state.timeEntries = timeEntries;
  },
  [MutationTypes.SET_STATISTICS](state: RootState, statistics: Statistic[]) {
    state.statistics = statistics;
  },
};

export default createStore<RootState>({
  state,
  getters: {
    timeEntriesStatistic: (state) =>
      state.statistics.find((statistic) => statistic.name === "time_entries"),
    projectSecondsStatistic: (state) =>
      state.statistics.find((statistic) => statistic.name === "time_entries"),
  },
  actions,
  mutations,
  modules: {
    auth,
  },
});
