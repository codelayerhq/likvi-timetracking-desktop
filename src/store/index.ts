import { ActionContext, ActionTree, createStore, MutationTree } from "vuex";
import auth from "./modules/auth";
import { startOfWeek, endOfWeek, startOfDay, endOfDay } from "date-fns";
import {
  ProjectPayload,
  Statistic,
  TimeEntry,
  TimeEntryPayload,
  TaskData,
} from "@/api/types";
import TimeEntriesService from "@/api/TimeEntriesService";
import ProjectsService from "@/api/ProjectsService";
import { toDateStr } from "@/utils/dateStr";
import { MutationTypes } from "./mutation-types";
import { ActionTypes } from "./actions";
import { toDateTimeStrUTC } from "@/utils/dateTimeStrUTC";
import { timeEntryToPayload } from "@/utils/timeEntryToPayload";
import StatisticsService from "@/api/StatisticsService";

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
  systemIdleTime: number;
  addProjectModalOpen: boolean;
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
  [MutationTypes.SET_SYSTEM_IDLE_TIME](state: S, idleSeconds: number): void;
  [MutationTypes.SET_ADD_PROJECT_MODAL_OPEN](state: S, value: boolean): void;
}

interface Actions<S = RootState, R = RootState> {
  [ActionTypes.FETCH_DATA](
    { commit }: AugmentedActionContext<S, R>,
    date: Date
  ): void;
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
    dispatch,
  }: AugmentedActionContext<S, R>): void;
  [ActionTypes.STOP_ACTIVE_TIME_ENTRY]({
    commit,
    state,
    dispatch,
  }: AugmentedActionContext<S, R>): void;
  [ActionTypes.START_NEW_TIME_ENTRY](
    { commit }: AugmentedActionContext<S, R>,
    // description: string
    taskData: TaskData
  ): void;
  [ActionTypes.UPDATE_SELECTED_TIME_ENTRY](
    { commit, state }: AugmentedActionContext<S, R>,
    data: unknown
  ): void;
  [ActionTypes.FETCH_STATISTICS]({
    commit,
    state,
  }: AugmentedActionContext<S, R>): void;
  [ActionTypes.SET_SYSTEM_IDLE_TIME](
    { commit }: AugmentedActionContext<S, R>,
    idleSeconds: number
  ): void;
  [ActionTypes.RESUME_TIME_ENTRY](
    { state, dispatch }: AugmentedActionContext<S, R>,
    timeEntry: TimeEntry
  ): void;
  [ActionTypes.DELETE_TIME_ENTRY](
    { state, dispatch }: AugmentedActionContext<S, R>,
    timeEntry: TimeEntry
  ): void;
  [ActionTypes.SET_ADD_PROJECT_MODAL_OPEN](
    { state, dispatch }: AugmentedActionContext<S, R>,
    value: boolean
  ): void;
  [ActionTypes.CREATE_PROJECT](
    { state, dispatch }: AugmentedActionContext<S, R>,
    data: ProjectPayload
  ): void;
}

const state: RootState = {
  startDate: startOfWeek(new Date(), { weekStartsOn: 1 }),
  endDate: endOfWeek(new Date(), { weekStartsOn: 1 }),
  activeTimeEntry: null,
  selectedTimeEntry: null,
  timeEntries: [],
  statistics: [],
  systemIdleTime: 0,
  addProjectModalOpen: false,
};

const actions: ActionTree<RootState, RootState> & Actions = {
  async [ActionTypes.FETCH_DATA]({ dispatch }) {
    return Promise.all([
      dispatch(ActionTypes.FETCH_ACTIVE_TIME_ENTRY),
      dispatch(ActionTypes.FETCH_TIME_ENTRIES),
      dispatch(ActionTypes.FETCH_STATISTICS),
    ]);
  },
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
  async [ActionTypes.FETCH_TIME_ENTRIES]({ commit, state, rootGetters }) {
    let page = 1;
    let totalPages = 1;
    let timeEntriesResult: TimeEntry[] = [];

    do {
      const {
        data: { data: timeEntries, meta },
      } = await new TimeEntriesService()
        .page(page)
        .include(...DEFAULT_INCLUDES)
        .filter([
          ["started_at", ">=", toDateStr(startOfDay(state.startDate))],
          ["started_at", "<=", toDateStr(endOfDay(state.endDate))],
          ["running", "=", "false"],
          ["user_id", "=", rootGetters["auth/user"].id],
        ])
        .list();

      totalPages = meta.pagination.total_pages;
      page = meta.pagination.current_page + 1;

      timeEntriesResult = timeEntriesResult.concat(timeEntries);
    } while (page <= totalPages);

    commit(MutationTypes.SET_TIME_ENTRIES, timeEntriesResult);
  },
  async [ActionTypes.FETCH_ACTIVE_TIME_ENTRY]({ commit, dispatch }) {
    try {
      const {
        data: { data: timeEntry },
      } = await new TimeEntriesService().include(...DEFAULT_INCLUDES).active();

      return commit(MutationTypes.SET_ACTIVE_TIME_ENTRY, timeEntry);
    } catch (error) {
      console.log(error.response.status);
      if (error.response.status === 404) {
        // No active time entry, not truely an error
        if (state.activeTimeEntry !== null) {
          commit(MutationTypes.SET_ACTIVE_TIME_ENTRY, null);
          dispatch(ActionTypes.FETCH_TIME_ENTRIES);
        }
      }
    }
  },
  async [ActionTypes.STOP_ACTIVE_TIME_ENTRY](
    { commit, state, dispatch },
    stoppedDate?: Date
  ) {
    if (state.activeTimeEntry !== null) {
      const id = state.activeTimeEntry.id;

      await new TimeEntriesService().include(...DEFAULT_INCLUDES).update(id, {
        stopped_at: toDateTimeStrUTC(stoppedDate ?? new Date()),
      });

      commit(MutationTypes.SET_ACTIVE_TIME_ENTRY, null);

      return dispatch(ActionTypes.FETCH_DATA);
    }
  },
  async [ActionTypes.START_NEW_TIME_ENTRY]({ commit }, taskData: TaskData) {
    const {
      data: { data: timeEntry },
    } = await new TimeEntriesService().include(...DEFAULT_INCLUDES).create({
      description: taskData.description,
      customer_id: taskData.customerId,
      project_id: taskData.projectId,
      started_at: toDateTimeStrUTC(new Date()),
    });

    return commit(MutationTypes.SET_ACTIVE_TIME_ENTRY, timeEntry);
  },
  async [ActionTypes.UPDATE_SELECTED_TIME_ENTRY](
    { commit, state },
    data: TimeEntryPayload
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
  async [ActionTypes.FETCH_STATISTICS]({ commit, state, rootGetters }) {
    const {
      data: { data: statistics },
    } = await new StatisticsService()
      .filter([["user_id", "=", rootGetters["auth/user"].id]])
      .list({
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
  [ActionTypes.SET_SYSTEM_IDLE_TIME]({ commit }, idleSeconds) {
    commit(MutationTypes.SET_SYSTEM_IDLE_TIME, idleSeconds);
  },
  async [ActionTypes.RESUME_TIME_ENTRY]({ state, dispatch }, timeEntry) {
    if (state.activeTimeEntry) {
      await dispatch(ActionTypes.STOP_ACTIVE_TIME_ENTRY);
    }

    const payload = timeEntryToPayload(timeEntry);

    await new TimeEntriesService().include(...DEFAULT_INCLUDES).create(payload);

    return dispatch(ActionTypes.FETCH_DATA);
  },
  async [ActionTypes.DELETE_TIME_ENTRY]({ dispatch }, timeEntry) {
    await new TimeEntriesService().destroy(timeEntry.id);

    return dispatch(ActionTypes.FETCH_DATA);
  },
  [ActionTypes.SET_ADD_PROJECT_MODAL_OPEN]({ commit }, value) {
    return commit(MutationTypes.SET_ADD_PROJECT_MODAL_OPEN, value);
  },
  async [ActionTypes.CREATE_PROJECT](_, data) {
    await new ProjectsService().create(data);
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
  [MutationTypes.SET_SYSTEM_IDLE_TIME](state: RootState, idleSeconds: number) {
    state.systemIdleTime = idleSeconds;
  },
  [MutationTypes.SET_ADD_PROJECT_MODAL_OPEN](state: RootState, value: boolean) {
    state.addProjectModalOpen = value;
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
