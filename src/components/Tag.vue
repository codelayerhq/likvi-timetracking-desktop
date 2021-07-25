<template>
  <li
    class="inline-flex items-center my-0.5 px-0.5 overflow-hidden text-sm rounded cursor-pointer"
    tabindex="0"
    :class="
      selectType === 'customer'
        ? 'bg-blue-100 focus:bg-blue-200 hover:bg-blue-200'
        : 'bg-red-100 focus:bg-red-300 hover:bg-red-200'
    "
  >
    <svg
      v-if="selectType === 'project'"
      xmlns="http://www.w3.org/2000/svg"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#6B7280"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <path
        d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"
      ></path>
      <line x1="7" y1="7" x2="7.01" y2="7"></line>
    </svg>
    <svg
      v-else
      xmlns="http://www.w3.org/2000/svg"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#6B7280"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
      <circle cx="12" cy="7" r="4"></circle>
    </svg>
    <span class="max-w-xs pl-1 leading-relaxed truncate">
      {{ title }}
    </span>
    <button
      class="inline-block w-6 h-6 text-gray-500 align-middle focus:outline-none"
      :aria-label="`${t('timeEntrySelect.remove')} ${selectType} ${title} ${t(
        'timeEntrySelect.fromTagList'
      )}`"
      @click="handleRemoveClick"
    >
      <svg
        class="w-6 h-6 mx-auto fill-current"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
      >
        <path
          fill-rule="evenodd"
          d="M15.78 14.36a1 1 0 0 1-1.42 1.42l-2.82-2.83-2.83 2.83a1 1 0 1 1-1.42-1.42l2.83-2.82L7.3 8.7a1 1 0 0 1 1.42-1.42l2.83 2.83 2.82-2.83a1 1 0 0 1 1.42 1.42l-2.83 2.83 2.83 2.82z"
        />
      </svg>
    </button>
  </li>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { useI18n } from "vue-i18n";

export default defineComponent({
  name: "Tag",
  props: {
    title: {
      type: String,
      required: true,
    },
    selectType: {
      type: String,
      required: true,
    },
    index: {
      type: Number || String,
      required: true,
    },
  },
  emits: ["removeTag"],
  setup(_, { emit }) {
    function handleRemoveClick() {
      emit("removeTag");
    }

    return {
      ...useI18n(),
      handleRemoveClick,
    };
  },
});
</script>
