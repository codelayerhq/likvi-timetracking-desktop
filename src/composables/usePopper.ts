// Source: https://github.com/tailwindlabs/headlessui/blob/develop/packages/%40headlessui-vue/examples/src/playground-utils/hooks/use-popper.js

import type { Ref } from "vue";
import { ref, onMounted, onUpdated, nextTick, watchEffect } from "vue";
import type { Instance, Options } from "@popperjs/core";
import { createPopper } from "@popperjs/core";

type RefType = Ref<HTMLElement | { $el: HTMLElement }>;

export default function usePopper(
  options: Options
): [RefType, RefType, Ref<Instance | undefined>] {
  const reference = ref() as RefType;
  const popper = ref() as RefType;
  const instance = ref<Instance>();

  onMounted(() => {
    watchEffect((onInvalidate) => {
      const popperEl =
        popper.value instanceof HTMLElement ? popper.value : popper.value.$el;
      const referenceEl =
        reference.value instanceof HTMLElement
          ? reference.value
          : reference.value.$el;

      if (!(referenceEl instanceof HTMLElement)) return;
      if (!(popperEl instanceof HTMLElement)) return;

      instance.value = createPopper(referenceEl, popperEl, options);

      onInvalidate(instance.value.destroy);
    });
  });

  // This fixes an issue when the virtual dom gets changed e.g. when a list gets re-sorted
  // and the popper element still has the old position.
  onUpdated(() => nextTick(() => instance.value?.update()));

  return [reference, popper, instance];
}
