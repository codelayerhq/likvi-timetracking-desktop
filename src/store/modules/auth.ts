import type { Module } from "vuex";
import { LogInDetails, login, validate } from "@/api/AuthService";
import axios from "@/api/axios";

interface State {
  user: any;
}

const module: Module<State, any> = {
  state: {
    user: getSavedState("auth.user"),
  },

  getters: {
    loggedIn(state: State): boolean {
      return !!state.user;
    },
    user(state: State): any {
      return state.user;
    },
  },

  actions: {
    async login(
      { commit, dispatch, getters },
      logInDetails: LogInDetails
    ): Promise<any> {
      // If user already logged in only validate user.
      if (getters.loggedIn) {
        dispatch("validate");
      }

      const {
        data: {
          data: {
            token,
            user: { data: user },
          },
        },
      } = await login(logInDetails);

      commit("SET_USER", user);
      commit("SET_TOKEN", token);

      return Promise.resolve();
    },

    logOut({ commit }): void {
      commit("SET_USER", null);
    },

    async validate({ commit, state }): Promise<any> {
      const token = getSavedState("auth.token");
      commit("SET_TOKEN", token);

      return validate()
        .then(() => {
          return Promise.resolve(state.user);
        })
        .catch(() => {
          return Promise.resolve(null);
        });
    },
  },

  mutations: {
    SET_USER(state: State, user: any): void {
      state.user = user;
      saveState("auth.user", user);
    },
    SET_TOKEN(state: State, token: string): void {
      saveState("auth.token", token);
      setDefaultAuthHeaders(token);
    },
  },

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

function saveState(key: string, state: any) {
  window.localStorage.setItem(key, JSON.stringify(state));
}

function setDefaultAuthHeaders(token: string) {
  axios.defaults.headers.common.Authorization = "Bearer " + token;
}

export default module;
