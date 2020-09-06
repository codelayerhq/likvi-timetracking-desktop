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
      <select
        :id="name"
        class="block w-full form-select px-7 sm:text-sm sm:leading-5"
        :value="modelValue"
        v-bind="$attrs"
        @input="handleInput"
      >
        <slot>
          <option v-if="placeholder" :value="null" disabled>
            {{ placeholder }}
          </option>
          <option
            v-for="(option, index) in options"
            :key="index"
            :value="option.value"
          >
            {{ option.label }}
          </option>
        </slot>
      </select>
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
  name: "BaseSelect",
  props: {
    modelValue: { type: null, required: true },
    name: { type: String, required: true },
    label: {
      type: String,
      required: true,
    },
    placeholder: {
      type: String as PropType<string | null>,
      required: false,
      default: null,
    },
    options: {
      type: Array as PropType<SelectOption[]>,
      required: true,
    },
  },
  emits: ["update:modelValue"],
  setup(_, { emit }) {
    function handleInput(event: Event): void {
      const target = event.target as HTMLSelectElement;
      emit("update:modelValue", target.value);
    }

    return {
      handleInput,
    };
  },
});
</script>
