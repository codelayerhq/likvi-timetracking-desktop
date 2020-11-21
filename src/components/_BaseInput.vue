<template>
  <label :for="name" class="block text-sm font-medium leading-5 text-gray-700">
    <slot name="label">
      <span>{{ label }}</span>
    </slot>
    <input
      :id="name"
      type="text"
      class="mt-1 text-input"
      :value="modelValue"
      v-bind="$attrs"
      @input="handleInput"
    />
  </label>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "BaseInput",
  inheritAttrs: false,
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
