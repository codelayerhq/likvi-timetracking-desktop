<template>
  <label for="newTimeEntry" class="sr-only">
    {{ t("actionBar.what_are_you_working_on") }}
  </label>
  <input
    ref="input"
    projectName="newTimeEntry"
    class="block w-full placeholder-gray-600 bg-gray-300 form-input px-7 sm:text-sm sm:leading-5 focus:bg-white"
    :placeholder="t('actionBar.what_are_you_working_on')"
    v-bind="$attrs"
    @input="handleInput"
  />
</template>

<script lang="ts">
import { defineComponent, Ref, ref, onMounted, onBeforeUnmount } from "vue";
import { useI18n } from "vue-i18n";
import autocomplete, { AutocompleteResult } from "autocompleter";
import { TimeEntry } from "@/api/types";
import TimeEntriesService from "@/api/TimeEntriesService";
import { createPopper, Instance as PopperInstance } from "@popperjs/core";

interface TimeEntryAutocompleteItem {
  label: string;
  value: TimeEntry;
}

export default defineComponent({
  projectName: "NewTimeEntryInput",
  props: {
    modelValue: { type: String, required: true },
  },
  emits: ["update:modelValue", "time-entry-selected"],
  setup(_, { emit }) {
    const { t } = useI18n();
    const input = ref() as Ref<HTMLInputElement>;

    function handleInput(event: Event): void {
      const target = event.target as HTMLInputElement;
      emit("update:modelValue", target.value);
    }

    let autocompleteInstance: AutocompleteResult;
    let popper: PopperInstance;

    onMounted(() => {
      autocompleteInstance = autocomplete<TimeEntryAutocompleteItem>({
        input: input.value,
        emptyMsg: t("timeEntrySelect.noTimeEntriesFound"),
        minLength: 0,
        debounceWaitMs: 100,
        showOnFocus: true,
        fetch: async (text, callback) => {
          const {
            data: { data: customers },
          } = await new TimeEntriesService().include("project").suggest(text);

          const newData: TimeEntryAutocompleteItem[] = customers.map(
            (timeEntry: TimeEntry) => ({
              label: timeEntry.description,
              value: timeEntry,
            })
          );

          callback(newData);
        },
        render(item: TimeEntryAutocompleteItem): HTMLDivElement | undefined {
          const wrapper = document.createElement("div");
          const svg = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "svg"
          );
          const circle = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "circle"
          );
          const timeEntrySpan = document.createElement("span");
          const projectWrapper = document.createElement("div");
          const projectSpan = document.createElement("span");

          const projectName =
            item.value?.project?.data.name || t("projectIndicator.noProject");
          const color = item.value?.project?.data.color_hex || "#676767";

          const timeEntryName = item.value.description;

          [
            "flex",
            "justify-between",
            "select-none",
            "text-gray-900",
            "text-sm",
          ].forEach((eleClass) => wrapper.classList.add(eleClass));

          [
            "flex",
            "items-center",
            "text-xs",
            "select-none",
          ].forEach((eleClass) => projectWrapper.classList.add(eleClass));
          projectWrapper.style.color = color;

          svg.setAttribute("width", "10");
          svg.setAttribute("height", "10");
          svg.setAttribute("viewBox", "0 0 10 10");
          svg.setAttribute("fill", "none");
          svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
          svg.classList.add("mr-2");

          circle.setAttribute("cx", "5");
          circle.setAttribute("cy", "5");
          circle.setAttribute("r", "5");
          circle.classList.add("fill-current");

          timeEntrySpan.textContent = timeEntryName;
          timeEntrySpan.classList.add("block");

          projectSpan.classList.add("block");
          projectSpan.textContent = projectName;

          svg.appendChild(circle);
          projectWrapper.appendChild(svg);
          projectWrapper.appendChild(projectSpan);

          wrapper.appendChild(timeEntrySpan);
          wrapper.appendChild(projectWrapper);

          return wrapper;
        },
        onSelect(item: TimeEntryAutocompleteItem) {
          emit("time-entry-selected", item.value);
        },
        // Because the autocomplete plugion always places elements
        // at the bottom we use Popper.js to update its position.
        customize: (input: HTMLInputElement, _, container: HTMLDivElement) => {
          // ToDo: using Popper.js in this way (destroying, creating) is not poptimal
          if (popper !== undefined) {
            popper.destroy();
          }

          popper = createPopper(input, container, {
            placement: "auto",
            modifiers: [
              {
                name: "offset",
                options: {
                  offset: [0, 10],
                },
              },
            ],
          });
        },
      });
    });

    onBeforeUnmount(() => {
      autocompleteInstance.destroy();
    });

    return {
      input,
      handleInput,
      ...useI18n(),
    };
  },
});
</script>
