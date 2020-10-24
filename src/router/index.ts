import {
  createRouter,
  createWebHashHistory,
  createWebHistory,
  RouteRecordRaw,
} from "vue-router";
import store from "@/store";
import Home from "@/views/Home.vue";
import Auth from "@/views/Auth.vue";
import Idle from "@/views/Idle.vue";
import { ActionTypes } from "@/store/actions";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/login",
    name: "login",
    component: Auth,
  },
  {
    path: "/",
    name: "home",
    component: Home,
    meta: {
      authRequired: true,
    },
  },
  {
    path: "/idle",
    name: "idle",
    component: Idle,
  },
];

const router = createRouter({
  history: process.env.IS_ELECTRON
    ? createWebHashHistory(process.env.BASE_URL)
    : createWebHistory(process.env.BASE_URL),
  routes,
});

// From https://github.com/chrisvfritz/vue-enterprise-boilerplate/blob/master/src/router/index.js
router.beforeEach((routeTo, routeFrom, next) => {
  // Check if auth is required on this route
  // (including nested routes).
  const authRequired = routeTo.matched.some((route) => route.meta.authRequired);

  // If auth isn't required for the route, just continue.
  if (!authRequired) {
    return next();
  }

  // If auth is required and the user is logged in...
  if (store.getters["auth/loggedIn"]) {
    // Validate the local user token...
    return store.dispatch(`auth/${ActionTypes.VALIDATE}`).then((validUser) => {
      // Then continue if the token still represents a valid user,
      // otherwise redirect to login.
      validUser ? next() : redirectToLogin();
    });
  }

  // If auth is required and the user is NOT currently logged in,
  // redirect to login.
  redirectToLogin();

  function redirectToLogin() {
    // Pass the original route to the login component
    next({ name: "login", query: { redirectFrom: routeTo.fullPath } });
  }
});

export default router;
