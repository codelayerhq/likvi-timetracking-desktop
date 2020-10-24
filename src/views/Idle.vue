<template>
  <div
    class="flex flex-col items-center justify-center w-screen h-screen space-y-8 bg-gray-100"
  >
    <div>
      <span>{{ t("idle.youAreIdleFor") }}&nbsp;</span>
      <span>{{ durationInMin }}</span>
      <span>&nbsp;{{ t("idle.minutes") }}</span>
    </div>

    <div class="space-y-2 fle felx-col">
      <base-button @click="handleStop">
        {{ t("idle.stopAndRemoveInaktive") }}
      </base-button>

      <base-button color="gray" @click="handleKeep">
        {{ t("idle.keepInaktive") }}
      </base-button>
    </div>
  </div>
</template>

<script lang="ts">
import useCurrentDate from "@/composables/useCurrentDate";
import { differenceInSeconds, subSeconds } from "date-fns";
import { IpcRenderer } from "electron";
import { computed, defineComponent, ref } from "vue";
import { useI18n } from "vue-i18n";

export default defineComponent({
  name: "Idle",
  setup() {
    const now = useCurrentDate();
    const { t } = useI18n();

    const idleSince = ref(new Date());
    const durationInSec = computed(() => {
      return differenceInSeconds(now.value, idleSince.value);
    });
    const durationInMin = computed(() => {
      return Math.floor(durationInSec.value / 60);
    });

    // @ts-ignore
    const ipcRenderer = window.ipcRenderer as IpcRenderer;

    ipcRenderer.send("getIdle");

    ipcRenderer.once("getIdleResponse", (_, idleSecondsValue: number) => {
      idleSince.value = subSeconds(idleSince.value, idleSecondsValue);
    });

    function handleStop() {
      ipcRenderer.send("idleWindow.removeStopped", idleSince.value);
      window.close();
    }

    function handleKeep() {
      window.close();
    }

    return {
      t,
      durationInMin,
      handleStop,
      handleKeep,
    };
  },
});
</script>
