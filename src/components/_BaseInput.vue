<template>
  <div>
    <label
      :for="name"
      class="block text-sm font-medium leading-5 text-gray-700"
    >
      Price
    </label>

    <div class="relative mt-1 rounded-md shadow-sm">
      <input
        :id="name"
        class="block w-full pr-12 form-input pl-7 sm:text-sm sm:leading-5"
        v-bind="$attrs"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "BaseInput",
  props: {
    name: { type: String, required: true },
  },
});
</script>
