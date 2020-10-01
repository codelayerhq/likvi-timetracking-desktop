<template>
  <div
    class="grid max-h-screen min-h-screen grid-cols-1 bg-gray-100 grid-rows-layout min-w-screen"
  >
    <default-header />
    <time-entry-list
      class="h-full max-h-full px-4 pb-4 overflow-y-scroll bg-gray-200"
    />
    <action-bar />
  </div>

  <selected-time-entry-modal />
</template>

<script lang="ts">
import { defineComponent } from "vue";
import DefaultHeader from "@/components/DefaultHeader.vue";
import TimeEntryList from "@/components/TimeEntryList.vue";
import ActionBar from "@/components/ActionBar.vue";
import SelectedTimeEntryModal from "@/components/SelectedTimeEntryModal.vue";
import { useStore } from "vuex";
import { ActionTypes } from "@/store/actions";
import { RootState } from "@/store";
import { IpcRenderer } from "electron";

export default defineComponent({
  name: "Home",
  components: {
    DefaultHeader,
    TimeEntryList,
    ActionBar,
    SelectedTimeEntryModal,
  },
  setup() {
    const store = useStore<RootState>();

    store.dispatch(ActionTypes.FETCH_ACTIVE_TIME_ENTRY);
    store.dispatch(ActionTypes.FETCH_TIME_ENTRIES);
    store.dispatch(ActionTypes.FETCH_STATISTICS);

    // @ts-ignore
    const ipcRenderer = window.ipcRenderer as IpcRenderer;

    setInterval(() => {
      ipcRenderer.send("getIdle");
    }, 1000);

    ipcRenderer.on("getIdleResponse", (_, idleSeconds: number) => {
      store.dispatch(ActionTypes.SET_SYSTEM_IDLE_TIME, idleSeconds);
    });

    // Poll for active time entry
    setInterval(() => {
      store.dispatch(ActionTypes.FETCH_ACTIVE_TIME_ENTRY);
    }, 1000 * 5);
  },
});
</script>
