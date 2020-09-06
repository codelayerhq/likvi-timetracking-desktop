<template>
  <span>{{ humanReadable }}</span>
</template>

<script lang="ts">
import { defineComponent, computed, PropType } from "vue";

export default defineComponent({
  name: "TimeSpan",
  props: {
    startDate: {
      type: Date as PropType<Date>,
      required: true,
    },
    endDate: {
      type: Date as PropType<Date>,
      required: true,
    },
  },
  setup(props) {
    const humanReadable = computed(() => {
      return `${props.startDate.toLocaleDateString()} - ${props.endDate.toLocaleDateString()}`;
    });

    return {
      humanReadable,
    };
  },
});
</script>
