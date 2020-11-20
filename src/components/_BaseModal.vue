<template>
  <teleport to="body">
    <dialog ref="dialog" v-bind="$attrs" class="z-20 rounded-lg">
      <slot name="header" v-bind="{ open, close }" />
      <slot />
    </dialog>
  </teleport>
</template>

<script lang="ts">
import { defineComponent, ref, Ref } from "vue";

export default defineComponent({
  name: "BaseModal",
  props: {
    showModal: {
      type: Boolean,
      required: false,
      defaul: false,
    },
    applyTransformStyles: {
      type: Boolean,
      required: false,
      defaul: false,
    },
  },
  setup(props) {
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
      // Todo: dialog.value.showModal(); breaks the autocomplete component
      if (props.showModal) {
        dialog.value.showModal();
      } else {
        dialog.value.show();
      }

      if (props.applyTransformStyles) {
        applyAppElementTransform();
      }
    }

    function close() {
      dialog.value.close();

      if (props.applyTransformStyles) {
        removeAppElementTransform();
      }
    }

    function applyAppElementTransform() {
      document.body.classList.add("bg-black");
      if (appElement !== null) {
        appElement.classList.add(...appElementModalOpendClasses);
      }
    }

    function removeAppElementTransform() {
      document.body.classList.remove("bg-black");
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
