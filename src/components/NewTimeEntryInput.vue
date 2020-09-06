<template>
  <label for="newTimeEntry" class="sr-only">
    What are you working on?
  </label>
  <input
    list="recentTimeEntries"
    name="newTimeEntry"
    class="block w-full placeholder-gray-600 bg-gray-300 form-input px-7 sm:text-sm sm:leading-5 focus:bg-white"
    placeholder="What are you working on?"
    v-bind="$attrs"
    @input="handleInput"
  />
  <datalist id="recentTimeEntries">
    <option
      v-for="(entry, index) in suggestedTimeEntries"
      :key="index"
      :value="entry.description"
    >
      {{ entry.description }}
    </option>
  </datalist>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import useSuggestedTimeEntries from "@/composables/useSuggestedTimeEntries";

export default defineComponent({
  name: "NewTimeEntryInput",
  props: {
    modelValue: { type: String, required: true },
  },
  emits: ["update:modelValue"],
  setup(_, { emit }) {
    const {
      suggestedTimeEntries,
      fetchSuggestedTimeEntries,
    } = useSuggestedTimeEntries();

    fetchSuggestedTimeEntries();

    function handleInput(event: Event): void {
      const target = event.target as HTMLInputElement;
      emit("update:modelValue", target.value);
    }

    return {
      handleInput,
      suggestedTimeEntries,
    };
  },
});
</script>
