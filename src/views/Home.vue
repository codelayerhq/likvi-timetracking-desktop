<template>
  <div
    class="grid max-h-screen min-h-screen grid-cols-1 bg-gray-100 grid-rows-layout min-w-screen"
  >
    <default-header />
    <time-entry-list class="h-full max-h-full overflow-y-scroll" />
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

export default defineComponent({
  name: "Home",
  components: {
    DefaultHeader,
    TimeEntryList,
    ActionBar,
    SelectedTimeEntryModal,
  },
  setup() {
    const store = useStore();

    store.dispatch("fetchActiveTimeEntry");
    store.dispatch("fetchTimeEntries");
    store.dispatch("fetchStatistics");
  },
});
</script>
