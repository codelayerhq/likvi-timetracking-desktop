<template>
  <div
    class="w-full max-w-sm overflow-hidden bg-white rounded-lg shadow-lg pointer-events-auto ring-1 ring-black ring-opacity-5"
    data-testid="notification"
  >
    <div class="p-4">
      <div class="flex items-start">
        <div class="flex-1 w-0 ml-3">
          <p class="text-sm font-medium text-gray-400">
            {{ notification.title }}
          </p>
          <p class="mt-1 text-sm text-gray-60">
            {{ notification.body }}
          </p>
        </div>
        <div class="flex flex-shrink-0 ml-4">
          <button
            class="inline-flex p-0.5 bg-white rounded-md text-gray-60 hover:text-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-40"
            @click="handleClose"
          >
            <span class="sr-only">{{ t("errors.close") }}</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="15"
              viewBox="0 0 329.26933 329"
              width="15"
            >
              <path
                d="m194.800781 164.769531 128.210938-128.214843c8.34375-8.339844 8.34375-21.824219 0-30.164063-8.339844-8.339844-21.824219-8.339844-30.164063 0l-128.214844 128.214844-128.210937-128.214844c-8.34375-8.339844-21.824219-8.339844-30.164063 0-8.34375 8.339844-8.34375 21.824219 0 30.164063l128.210938 128.214843-128.210938 128.214844c-8.34375 8.339844-8.34375 21.824219 0 30.164063 4.15625 4.160156 9.621094 6.25 15.082032 6.25 5.460937 0 10.921875-2.089844 15.082031-6.25l128.210937-128.214844 128.214844 128.214844c4.160156 4.160156 9.621094 6.25 15.082032 6.25 5.460937 0 10.921874-2.089844 15.082031-6.25 8.34375-8.339844 8.34375-21.824219 0-30.164063zm0 0"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from "vue";
import { Notification as INotification } from "@/composables/useNotifications";
import { useI18n } from "vue-i18n";

const notificationTypeIconMap = {
  info: "information-circle",
  positive: "check-circle-1",
  warning: "alert-circle",
  negative: "remove-circle",
};

const notificationTypeClassMap = {
  info: ["text-blue-100"],
  positive: ["text-green-100"],
  warning: ["text-yellow-100"],
  negative: ["text-red-100"],
};

export default defineComponent({
  name: "Notification",
  props: {
    notification: {
      type: Object as PropType<INotification>,
      required: true,
    },
  },
  emits: ["close"],
  setup(props, { emit }) {
    function handleClose() {
      emit("close", props.notification.uuid);
    }

    if (props.notification.timeout !== undefined) {
      window.setTimeout(handleClose, props.notification.timeout);
    }

    return {
      ...useI18n(),
      handleClose,
    };
  },
});
</script>
