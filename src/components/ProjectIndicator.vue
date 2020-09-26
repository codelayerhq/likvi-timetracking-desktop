<template>
  <div :style="{ color }" class="flex items-center text-xs select-none">
    <svg
      width="10"
      height="10"
      viewBox="0 0 10 10"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      class="mr-2"
    >
      <circle cx="5" cy="5" r="5" class="fill-current" />
    </svg>
    <span class="block">{{ name }}</span>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, computed } from "vue";
import { Project } from "@/api/types";
import { useI18n } from "vue-i18n";

export default defineComponent({
  name: "ProjectIndicator",
  props: {
    project: {
      type: Object as PropType<Project | undefined>,
      required: false,
      default: undefined,
    },
  },
  setup(props) {
    const { t } = useI18n();

    const name = computed(
      () => props?.project?.name || t("projectIndicator.noProject")
    );
    const color = computed(() => props?.project?.color_hex || "#676767");

    return {
      name,
      color,
    };
  },
});
</script>
