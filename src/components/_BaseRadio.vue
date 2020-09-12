<template>
  <div>
    <span class="text-gray-700">{{ label }}</span>
    <div class="mt-2 space-x-4">
      <label
        v-for="(option, index) in options"
        :key="index"
        class="inline-flex items-center"
      >
        <input
          type="radio"
          class="form-radio"
          :name="name"
          :value="option.value"
          :checked="modelValue === option.value"
          @input="handleInput"
        />
        <span class="ml-2">{{ option.label }}</span>
      </label>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";

interface SelectOption {
  label: string;
  value: unknown;
}

export default defineComponent({
  name: "BaseRadio",
  props: {
    modelValue: { type: null, required: true },
    name: { type: String, required: true },
    label: {
      type: String,
      required: true,
    },
    options: {
      type: Array as PropType<SelectOption[]>,
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
