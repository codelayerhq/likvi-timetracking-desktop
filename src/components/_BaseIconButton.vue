<template>
  <button
    class="text-gray-600 border border-transparent rounded hover:text-gray-500 focus:outline-none active:text-gray-700 focus:shadow-outline-gray-500"
  >
    <slot />
  </button>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "BaseIconButton",
});
</script>
