<template>
  <div class="flex items-center px-8 py-2 space-x-8 bg-gray-900">
    <start-stop-button :is-running="isRunning" @click="handleStartStop" />
    <active-time-entry-meta
      v-if="isRunning"
      :active-time-entry="activeTimeEntry"
      class="cursor-pointer"
      @click="handleSelectActiveTimeEntry"
    />
    <div
      v-else
      class="relative flex items-center w-full h-full p-0 bg-white text-input"
    >
      <new-time-entry-input
        v-model="taskData"
        class="h-full m-0 border-0 text-input"
        @time-entry-selected="handleTimeEntrySelected"
        @customer-selected="handleCustomerSelected"
        @project-selected="handleProjectSelected"
        @keyup.enter="handleStartStop"
      />
      <ul class="flex flex-col items-start py-0.5 mx-1 list-none">
        <tag
          v-for="(tag, index) in tags"
          :key="tag.title"
          :title="tag.title"
          :select-type="tag.selectType"
          :index="index"
          @remove-tag="handleRemoveTag"
        />
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, ref, reactive } from "vue";
import StartStopButton from "@/components/StartStopButton.vue";
import ActiveTimeEntryMeta from "@/components/ActiveTimeEntryMeta.vue";
import { useStore } from "vuex";
import NewTimeEntryInput from "@/components/NewTimeEntryInput.vue";
import { ActionTypes } from "@/store/actions";
import { RootState } from "@/store";
import { Customer, Project, TimeEntry } from "@/api/types";
import { getCustomerName } from "@/utils/getCustomerName";
import Tag from "@/components/Tag.vue";
import { TaskData } from "@/api/types";

interface TagValue {
  title: string;
  selectType: string;
}

export default defineComponent({
  name: "ActionBar",
  components: {
    StartStopButton,
    ActiveTimeEntryMeta,
    NewTimeEntryInput,
    Tag,
  },
  setup() {
    const store = useStore<RootState>();

    const taskData: TaskData = reactive({
      description: "",
      projectId: null,
      customerId: null,
    });

    const tags: TagValue[] = reactive([]);

    const activeTimeEntry = computed(() => store.state.activeTimeEntry);
    const isRunning = computed(() => !(activeTimeEntry.value === null));

    function handleCustomerSelected(customer: Customer) {
      const customerName = getCustomerName(customer);
      const selectType = "customer";
      const selectedCustomer = { title: customerName, selectType: selectType };
      const indexOfSelectedCustomer = tags.findIndex(
        (tag: TagValue) => tag.selectType === selectType
      );

      taskData.customerId = customer.id;

      if (indexOfSelectedCustomer !== -1) {
        tags.splice(indexOfSelectedCustomer, 1, selectedCustomer);
        return;
      }

      tags.push(selectedCustomer);
    }

    function handleProjectSelected(project: Project) {
      const selectType = "project";
      const selectedProject = { title: project.name, selectType: selectType };
      const indexOfSelectedProject = tags.findIndex(
        (tag: TagValue) => tag.selectType === selectType
      );

      taskData.projectId = project.id;

      if (indexOfSelectedProject != -1) {
        tags.splice(indexOfSelectedProject, 1, selectedProject);
        return;
      }
      tags.push(selectedProject);
    }

    function handleStartStop(): void {
      // Todo: find way to differ between selected customer / project and task
      if (isRunning.value) {
        store.dispatch(ActionTypes.STOP_ACTIVE_TIME_ENTRY, null);
        taskData.description = "";
        taskData.customerId = null;
        taskData.projectId = null;
        tags.length = 0;
      } else {
        store.dispatch(ActionTypes.START_NEW_TIME_ENTRY, taskData);
      }
    }

    function handleTimeEntrySelected(timeEntry: TimeEntry) {
      store.dispatch(ActionTypes.RESUME_TIME_ENTRY, timeEntry);
    }

    function handleSelectActiveTimeEntry() {
      store.dispatch(
        ActionTypes.SET_SELECTED_TIME_ENTRY,
        activeTimeEntry.value
      );
    }

    function handleRemoveTag(index: number) {
      tags.splice(index, 1);
    }

    return {
      activeTimeEntry,
      isRunning,
      handleStartStop,
      taskData,
      tags,
      handleTimeEntrySelected,
      handleSelectActiveTimeEntry,
      handleCustomerSelected,
      handleProjectSelected,
      handleRemoveTag,
    };
  },
});
</script>
