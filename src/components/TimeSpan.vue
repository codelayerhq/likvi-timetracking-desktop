<template>
  <span>{{ humanReadable }}</span>
</template>

<script lang="ts">
import { differenceInCalendarWeeks, startOfWeek } from "date-fns";
import { defineComponent, computed, PropType } from "vue";
import { useI18n } from "vue-i18n";

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
    const { t } = useI18n();

    const differenceInWeeks = computed(() =>
      differenceInCalendarWeeks(
        props.startDate,
        startOfWeek(new Date(), { weekStartsOn: 1 })
      )
    );

    const humanReadable = computed(() => {
      const difference = differenceInWeeks.value;

      if (difference === 0) {
        return t("timeSpan.currentWeek");
      } else if (difference < 0) {
        return t("timeSpan.weeksAgo", Math.abs(difference));
      } else {
        return t("timeSpan.weeksAhead", Math.abs(difference));
      }
    });

    return {
      humanReadable,
    };
  },
});
</script>
