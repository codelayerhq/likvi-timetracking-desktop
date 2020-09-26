<template>
  <div class="flex items-center px-8 py-2 space-x-8 bg-gray-900">
    <start-stop-button :is-running="isRunning" @click="handleStartStop" />
    <active-time-entry-meta
      v-if="isRunning"
      :active-time-entry="activeTimeEntry"
    />
    <div v-else class="w-full">
      <new-time-entry-input
        v-model="description"
        @time-entry-selected="handleTimeEntrySelected"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, ref } from "vue";
import StartStopButton from "@/components/StartStopButton.vue";
import ActiveTimeEntryMeta from "@/components/ActiveTimeEntryMeta.vue";
import { useStore } from "vuex";
import NewTimeEntryInput from "@/components/NewTimeEntryInput.vue";
import { ActionTypes } from "@/store/actions";
import { RootState } from "@/store";
import { TimeEntry } from "@/api/types";

export default defineComponent({
  name: "ActionBar",
  components: {
    StartStopButton,
    ActiveTimeEntryMeta,
    NewTimeEntryInput,
  },
  setup() {
    const store = useStore<RootState>();

    const description = ref("");

    const activeTimeEntry = computed(() => store.state.activeTimeEntry);
    const isRunning = computed(() => !(activeTimeEntry.value === null));

    function handleStartStop(): void {
      if (isRunning.value) {
        store.dispatch(ActionTypes.STOP_ACTIVE_TIME_ENTRY, null);
      } else {
        store.dispatch(ActionTypes.START_NEW_TIME_ENTRY, description.value);
      }
    }

    function handleTimeEntrySelected(timeEntry: TimeEntry) {
      store.dispatch(ActionTypes.RESUME_TIME_ENTRY, timeEntry);
    }

    return {
      activeTimeEntry,
      isRunning,
      handleStartStop,
      description,
      handleTimeEntrySelected,
    };
  },
});
</script>
