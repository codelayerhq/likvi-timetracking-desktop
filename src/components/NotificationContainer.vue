<template>
  <teleport to="body">
    <div
      aria-live="assertive"
      class="fixed inset-0 z-20 flex px-4 py-6 pointer-events-none sm:p-6"
    >
      <div class="flex flex-col items-center w-full space-y-4">
        <transition-group
          enter-active-class="transition duration-300 ease-out transform"
          enter-from-class="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
          enter-to-class="translate-y-0 opacity-100 sm:translate-x-0"
          leave-active-class="transition duration-100 ease-in"
          leave-from-class="opacity-100"
          leave-to-class="opacity-0"
        >
          <notification
            v-for="notification in notifications"
            :key="`${notification.uuid}`"
            :notification="notification"
            @close="handleClose"
          />
        </transition-group>
      </div>
    </div>
  </teleport>
</template>

<script lang="ts">
import useNotifications from "@/composables/useNotifications";
import { defineComponent } from "vue";
import Notification from "@/components/Notification.vue";

export default defineComponent({
  name: "NotificationContainer",
  components: { Notification },
  setup() {
    const { notifications } = useNotifications();

    function handleClose(uuid: string) {
      const index = notifications.value.findIndex(
        (notification) => notification.uuid === uuid
      );

      if (index !== -1) {
        notifications.value.splice(index, 1);
      }
    }

    return {
      notifications,
      handleClose,
    };
  },
});
</script>
