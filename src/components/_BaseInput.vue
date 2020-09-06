<template>
  <div>
    <label
      :for="name"
      class="block text-sm font-medium leading-5 text-gray-700"
    >
      <slot name="label">
        {{ label }}
      </slot>
    </label>
    <div class="relative mt-1 rounded-md shadow-sm">
      <input
        :id="name"
        class="block w-full form-input px-7 sm:text-sm sm:leading-5"
        :value="modelValue"
        v-bind="$attrs"
        @input="handleInput"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "BaseInput",
  props: {
    modelValue: { type: null, required: true },
    name: { type: String, required: true },
    label: {
      type: String,
      required: true,
    },
  },
  emits: ["update:modelValue"],
  setup(_, { emit }) {
    function handleInput(event: Event): void {
      const target = event.target as HTMLInputElement;
      emit("update:modelValue", target.value);
    }

    return {
      handleInput,
    };
  },
});
</script>
