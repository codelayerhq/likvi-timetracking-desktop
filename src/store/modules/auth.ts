import type { ActionContext, ActionTree, Module, MutationTree } from "vuex";
import { LogInDetails, login, validate } from "@/api/AuthService";
import axios from "@/api/axios";
import { User } from "@/api/types";
import { RootState } from "..";
import { MutationTypes } from "../mutation-types";
import { ActionTypes } from "../actions";

type AugmentedActionContext<S, R> = {
  commit<K extends keyof Mutations>(
    key: K,
    payload: Parameters<Mutations[K]>[1]
  ): ReturnType<Mutations[K]>;
} & Omit<ActionContext<S, R>, "commit">;

interface State {
  user: User;
  currentTeamId: number;
}

interface Mutations<S = State> {
  [MutationTypes.SET_USER](state: S, user: User): void;
  [MutationTypes.SET_TOKEN](state: S, token: string): void;
  [MutationTypes.SET_CURRENT_TEAM_ID](
    state: State,
    currentTeamId: number
  ): void;
}

interface Actions<S = State, R = RootState> {
  [ActionTypes.LOGIN](
    { commit, dispatch, getters }: AugmentedActionContext<S, R>,
    logInDetails: LogInDetails
  ): Promise<unknown>;
  [ActionTypes.LOGOUT]({ commit }: AugmentedActionContext<S, R>): void;
  [ActionTypes.VALIDATE]({
    commit,
    state,
  }: AugmentedActionContext<S, R>): Promise<User | null>;
}

const state: State = {
  user: getSavedState("auth.user"),
  currentTeamId: getSavedState("auth.currentTeamId"),
};

const actions: ActionTree<State, RootState> & Actions = {
  async [ActionTypes.LOGIN](
    { commit, dispatch, getters }: ActionContext<State, RootState>,
    logInDetails: LogInDetails
  ): Promise<unknown> {
    // If user already logged in only validate user.
    if (getters.loggedIn) {
      dispatch(`auth/${ActionTypes.VALIDATE}`);
    }

    const {
      data: {
        data: {
          token,
          user: { data: user },
        },
      },
    } = await login(logInDetails);

    commit(MutationTypes.SET_USER, user);
    commit(MutationTypes.SET_TOKEN, token);
    commit(MutationTypes.SET_CURRENT_TEAM_ID, user.current_team_id);

    return Promise.resolve();
  },

  [ActionTypes.LOGOUT]({ commit }: ActionContext<State, RootState>): void {
    commit(MutationTypes.SET_USER, null);
  },

  async [ActionTypes.VALIDATE]({
    commit,
    state,
  }: ActionContext<State, RootState>): Promise<User | null> {
    const token = getSavedState("auth.token");
    commit(MutationTypes.SET_TOKEN, token);

    return validate()
      .then(() => {
        return Promise.resolve(state.user);
      })
      .catch(() => {
        return Promise.resolve(null);
      });
  },
};

const mutations: MutationTree<State> & Mutations = {
  [MutationTypes.SET_USER](state: State, user: User): void {
    state.user = user;
    saveState("auth.user", user);
  },
  [MutationTypes.SET_TOKEN](state: State, token: string): void {
    saveState("auth.token", token);
    setDefaultAuthHeaders(token);
  },
  [MutationTypes.SET_CURRENT_TEAM_ID](
    state: State,
    currentTeamId: number
  ): void {
    saveState("auth.currentTeamId", currentTeamId);
    state.currentTeamId = currentTeamId;
  },
};

const module: Module<State, RootState> = {
  state,
  getters: {
    loggedIn(state: State): boolean {
      return !!state.user;
    },
    user(state: State): User {
      return state.user;
    },
    currentTeamId(state: State): number {
      return state.currentTeamId;
    },
  },
  actions,
  mutations,
  namespaced: true,
};

function getSavedState(key: string) {
  const state = window.localStorage.getItem(key);
  if (typeof state === "string") {
    return JSON.parse(state);
  } else {
    return null;
  }
}

function saveState(key: string, state: unknown) {
  window.localStorage.setItem(key, JSON.stringify(state));
}

function setDefaultAuthHeaders(token: string) {
  axios.defaults.headers.common.Authorization = "Bearer " + token;
}

export default module;
