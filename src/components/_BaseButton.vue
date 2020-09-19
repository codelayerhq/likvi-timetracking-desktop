<template>
  <button
    class="relative flex justify-center w-full px-4 py-2 text-sm font-medium leading-5 text-white transition duration-150 ease-in-out border border-transparent rounded-md group focus:outline-none"
    :class="state.buttonClasses"
  >
    <slot>
      {{ label }}
    </slot>
  </button>
</template>

<script lang="ts">
import { defineComponent, reactive, computed } from "vue";

export default defineComponent({
  name: "BaseButton",
  props: {
    label: {
      type: String,
      required: false,
      default: null,
    },
    color: {
      type: String,
      required: false,
      default: "brand",
    },
  },
  setup(props) {
    const state = reactive({
      // Todo: Colors not used elewhere will be purged by PurgeCSS
      buttonClasses: computed(() => [
        `hover:bg-${
          props.color === "brand" ? "brand-light" : props.color.concat("-500")
        }`,
        `bg-${props.color === "brand" ? "brand" : props.color.concat("-600")}`,
        `focus:border-${
          props.color === "brand" ? "brand-dark" : props.color.concat("-700")
        }`,
        `active:bg--${
          props.color === "brand" ? "brand-dark" : props.color.concat("-700")
        }`,
        `focus:shadow-outline-${
          props.color === "brand" ? "brand-light" : props.color.concat("-500")
        }`,
      ]),
    });

    return {
      state,
    };
  },
});
</script>
