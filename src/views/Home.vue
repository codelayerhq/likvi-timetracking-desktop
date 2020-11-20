<template>
  <div
    class="grid max-h-screen min-h-screen grid-cols-1 bg-gray-50 grid-rows-layout min-w-screen"
  >
    <default-header />
    <time-entry-list
      class="h-full max-h-full px-4 pb-4 overflow-y-auto bg-gray-200"
    />
    <action-bar />
  </div>

  <selected-time-entry-modal />
  <add-project-modal />
</template>

<script lang="ts">
import { computed, defineComponent, onUnmounted, watch } from "vue";
import DefaultHeader from "@/components/DefaultHeader.vue";
import TimeEntryList from "@/components/TimeEntryList.vue";
import ActionBar from "@/components/ActionBar.vue";
import SelectedTimeEntryModal from "@/components/SelectedTimeEntryModal.vue";
import AddProjectModal from "@/components/AddProjectModal.vue";
import { useStore } from "vuex";
import { ActionTypes } from "@/store/actions";
import { RootState } from "@/store";
import { IpcRenderer, IpcRendererEvent } from "electron";
import { useRouter } from "vue-router";
import { useToast } from "vue-toastification";
import { useI18n } from "vue-i18n";

// @ts-ignore
const ipcRenderer = window.ipcRenderer as IpcRenderer;

export default defineComponent({
  name: "Home",
  components: {
    DefaultHeader,
    TimeEntryList,
    ActionBar,
    SelectedTimeEntryModal,
    AddProjectModal,
  },
  setup() {
    const store = useStore<RootState>();
    const router = useRouter();
    const toast = useToast();
    const { t } = useI18n();

    store.dispatch(ActionTypes.FETCH_DATA);

    const activeTimeEntry = computed(() => store.state.activeTimeEntry);
    watch(activeTimeEntry, () => {
      if (activeTimeEntry.value === null) {
        ipcRenderer.send("noActiveTimeEntry");
      } else {
        ipcRenderer.send("activeTimeEntry");
      }
    });

    ipcRenderer.on("tray.newTimeEntry", () => {
      store.dispatch(ActionTypes.START_NEW_TIME_ENTRY);
    });

    ipcRenderer.on("tray.logOut", () => {
      store.dispatch(`auth/${ActionTypes.LOGOUT}`);
      router.replace({ name: "login" });
    });

    ipcRenderer.on("tray.stopActive", () => {
      store.dispatch(ActionTypes.STOP_ACTIVE_TIME_ENTRY);
    });

    ipcRenderer.on("tray.switchTeam", (_, teamId: number) => {
      store.dispatch(`auth/${ActionTypes.SWITCH_TEAM}`, teamId);
      store.dispatch(ActionTypes.FETCH_DATA);
      toast.success(t("notification.switchedTeam"));
    });

    ipcRenderer.on("idle.stopActive", (_, idleSince: Date) => {
      store.dispatch(ActionTypes.STOP_ACTIVE_TIME_ENTRY, idleSince);
    });

    ipcRenderer.on("timeEntry.getActive", (event: IpcRendererEvent) => {
      console.log(event);
    });

    // Poll for active time entry
    const poll = setInterval(() => {
      store.dispatch(ActionTypes.FETCH_ACTIVE_TIME_ENTRY);
    }, 1000 * 5);

    onUnmounted(() => {
      clearInterval(poll);
    });
  },
});
</script>
