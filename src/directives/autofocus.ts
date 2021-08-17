import { Directive } from "vue";

const focus: Directive = {
  mounted(el: HTMLElement) {
    el.focus();
  },
};

export default focus;
