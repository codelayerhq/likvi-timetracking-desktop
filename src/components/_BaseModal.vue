<template>
  <teleport to="body">
    <dialog ref="dialog" v-bind="$attrs" class="rounded-lg">
      <slot name="header" v-bind="{ open, close }" />
      <slot />
    </dialog>
  </teleport>
</template>

<script lang="ts">
import { defineComponent, ref, Ref } from "vue";

export default defineComponent({
  name: "BaseModal",
  setup() {
    const dialog = ref() as Ref<HTMLDialogElement>;
    const appElement = document.getElementById("app");
    const appElementModalOpendClasses = [
      "transform",
      "scale-95",
      "duration-100",
      "ease-in-out",
      "rounded-lg",
      "overflow-hidden",
      "bg-black",
    ];

    function getOpenState() {
      return dialog.value.open;
    }

    function open() {
      dialog.value.showModal();
      applyAppElementTransform();
    }

    function close() {
      dialog.value.close();
      removeAppElementTransform();
    }

    function applyAppElementTransform() {
      if (appElement !== null) {
        appElement.classList.add(...appElementModalOpendClasses);
      }
    }

    function removeAppElementTransform() {
      if (appElement !== null) {
        appElement.classList.remove(...appElementModalOpendClasses);
      }
    }

    return {
      dialog,
      open,
      close,
      getOpenState,
    };
  },
});
</script>
