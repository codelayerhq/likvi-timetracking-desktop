/**
 * This ist the original shim set up with Vue CLI, but it fails in vue-test-utils,
 * due to https://github.com/vuejs/vue-test-utils-next/issues/194
declare module "*.vue" {
  import { defineComponent } from "vue";
  const component: ReturnType<typeof defineComponent>;
  export default component;
}
*/

declare module "*.vue" {
  import { DefineComponent } from "vue";
  const component: DefineComponent;
  export default component;
}
