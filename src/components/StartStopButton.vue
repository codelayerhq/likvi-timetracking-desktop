<template>
  <button
    class="flex items-center justify-center flex-shrink-0 w-12 h-12 border border-transparent rounded-full cursor-pointer focus:bg-brand-light focus:border-white focus:outline-none bg-brand hover:bg-brand-light"
    tabindex="1"
  >
    <svg
      v-if="!isRunning"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M17.8863 9.87401L9.88958 4.42942C9.51253 4.17258 9.0742 4.02517 8.62145 4.00295C8.16869 3.98072 7.71854 4.08452 7.31909 4.30325C6.91964 4.52198 6.58591 4.84741 6.35358 5.24477C6.12124 5.64213 5.99903 6.09647 6.00001 6.55924V17.4459C5.99994 17.9082 6.12281 18.3619 6.35551 18.7585C6.58821 19.1551 6.92201 19.4798 7.3213 19.698C7.72058 19.9161 8.17038 20.0194 8.6227 19.997C9.07501 19.9746 9.51288 19.8272 9.88958 19.5706L17.8863 14.126C18.2289 13.8928 18.5098 13.5768 18.7041 13.2062C18.8984 12.8355 19 12.4217 19 12.0013C19 11.5809 18.8984 11.167 18.7041 10.7964C18.5098 10.4257 18.2289 10.1098 17.8863 9.87656V9.87401Z"
        fill="white"
        stroke="white"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>

    <svg
      v-else
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M4 6.66667C4 5.95942 4.28095 5.28115 4.78105 4.78105C5.28115 4.28095 5.95942 4 6.66667 4H17.3333C18.0406 4 18.7189 4.28095 19.219 4.78105C19.719 5.28115 20 5.95942 20 6.66667V17.3333C20 18.0406 19.719 18.7189 19.219 19.219C18.7189 19.719 18.0406 20 17.3333 20H6.66667C5.95942 20 5.28115 19.719 4.78105 19.219C4.28095 18.7189 4 18.0406 4 17.3333V6.66667Z"
        fill="white"
        stroke="white"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  </button>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "StartStopButton",
  props: {
    isRunning: {
      type: Boolean,
      required: true,
    },
  },
});
</script>
