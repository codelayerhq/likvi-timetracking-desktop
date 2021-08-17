import { createApp } from "vue";
import { createI18n } from "vue-i18n";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import "./styles/tailwind.css";
import de from "@/i18n/de";
import en from "@/i18n/en";
import Toast from "vue-toastification";
import "vue-toastification/dist/index.css";
import focus from "./directives/autofocus";

const app = createApp(App);

const i18n = createI18n({
  locale: navigator.language,
  messages: {
    en,
    de,
    "de-DE": de,
    "de-AT": de,
    "en-GB": en,
    "en-US": en,
  },
  fallbackLocale: "en",
});

app.use(store).use(router).use(i18n).use(Toast).mount("#app");

app.directive("focus", focus);

// Globally register all base components
const requireComponent = require.context(
  // Look for files in the current directory
  "./components/",
  // Do not look in subdirectories
  false,
  // Only include "_Base" prefixed .vue files
  /_Base[\w-]+\.vue$/
);

// For each matching file name...
requireComponent.keys().forEach((fileName) => {
  // Get the component config
  const componentConfig = requireComponent(fileName);
  // Get the PascalCase version of the component name
  const componentName = fileName
    // Remove the "./_" from the beginning
    .replace(/^\.\/_/, "")
    // Remove the file extension from the end
    .replace(/\.\w+$/, "");

  // Globally register the component
  app.component(componentName, componentConfig.default || componentConfig);
});

export { app, i18n };
