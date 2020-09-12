<template>
  <span>{{ humanReadable }}</span>
</template>

<script lang="ts">
import { defineComponent, computed } from "vue";
import useCurrentDate from "@/composables/useCurrentDate";

export default defineComponent({
  name: "CurrentTime",
  setup() {
    const date = useCurrentDate();
    const humanReadable = computed(() => date.value.toLocaleTimeString());

    return {
      date,
      humanReadable,
    };
  },
});
</script>
