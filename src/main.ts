import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import "./styles/tailwind.css";

const app = createApp(App);
app.use(store).use(router).mount("#app");

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
