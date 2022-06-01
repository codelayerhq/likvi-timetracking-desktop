<template>
  <Menu as="div" class="relative inline-block text-left">
    <MenuButton
      ref="reference"
      class="block w-full text-gray-900 border border-gray-300 rounded-md bg-gray-50 focus:outline-none focus:border-gray-200 focus:ring-2 focus:ring-gray-500"
      style="padding: 0.875rem"
    >
      <div
        class="w-5 h-5 rounded-full"
        :style="{ backgroundColor: computedColor }"
      ></div>
    </MenuButton>

    <div ref="popper" class="w-40">
      <transition
        enter-active-class="transition duration-100 ease-out"
        enter-from-class="transform scale-95 opacity-0"
        enter-to-class="transform scale-100 opacity-100"
        leave-active-class="transition duration-75 ease-in"
        leave-from-class="transform scale-100 opacity-100"
        leave-to-class="transform scale-95 opacity-0"
      >
        <MenuItems
          class="w-40 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none grid grid-cols-3 gap-4 p-4"
        >
          <MenuItem
            v-for="color in availableColors"
            :key="color"
            v-slot="{ active }"
          >
            <button
              type="button"
              class="w-full h-full flex items-center justify-center group focus:outline-none"
              @click="handleSelect(color)"
            >
              <div
                class="w-full h-8 rounded-full"
                :class="active ? 'ring-2 ring-gray-500' : ''"
                :style="{ backgroundColor: color }"
              >
                <span class="sr-only">{{ color }}</span>
              </div>
            </button>
          </MenuItem>
        </MenuItems>
      </transition>
    </div>
  </Menu>
</template>

<script lang="ts">
import usePopper from "@/composables/usePopper";
import { ref, computed, defineComponent, PropType } from "vue";
import { Menu, MenuButton, MenuItems, MenuItem } from "@headlessui/vue";

export default defineComponent({
  name: "ColorSelect",
  components: {
    Menu,
    MenuButton,
    MenuItems,
    MenuItem,
  },
  props: {
    modelValue: {
      type: String,
      required: false,
      default: undefined,
    },
    availableColors: {
      type: Array as PropType<string[]>,
      required: false,
      default: () => [
        "#CCCDD4",
        "#3DAFCF",
        "#D9967E",
        "#458C78",
        "#925244",
        "#DD4B4B",
        "#F2BC1B",
        "#F294C0",
        "#4B6584",
      ],
    },
  },
  emits: { "update:modelValue": null },
  setup(props, { emit }) {
    const [reference, popper] = usePopper({
      placement: "bottom-end",
      strategy: "absolute",
      modifiers: [{ name: "offset", options: { offset: [0, 10] } }],
    });

    const colorProxy = computed({
      get() {
        return props.modelValue;
      },

      set(value: string) {
        emit("update:modelValue", value);
      },
    });

    const computedColor = computed(() => {
      return props.modelValue ?? "#000000";
    });

    function handleSelect(color: string) {
      colorProxy.value = color;
    }

    return {
      reference,
      popper,
      colorProxy,
      computedColor,
      handleSelect,
    };
  },
});
</script>
