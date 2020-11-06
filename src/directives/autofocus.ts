import { Directive } from "vue";

const focus: Directive = {
  mounted(el: HTMLElement) {
    console.log(el);
    el.focus();
  },
};

export default focus;
