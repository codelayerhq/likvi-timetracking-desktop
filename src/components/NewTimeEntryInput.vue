<template>
  <label for="newTimeEntry" class="sr-only">
    {{ t("actionBar.what_are_you_working_on") }}
  </label>
  <input
    ref="input"
    type="text"
    project-name="newTimeEntry"
    class="w-full h-full py-3 text-gray-900 placeholder-gray-400 bg-transparent rounded-md focus:outline-none focus:ring-0"
    :placeholder="t('actionBar.what_are_you_working_on')"
    v-bind="$attrs"
    @input="handleInput"
  />
</template>

<script lang="ts">
import {
  defineComponent,
  Ref,
  ref,
  onMounted,
  onBeforeUnmount,
  computed,
  PropType,
} from "vue";
import { useI18n } from "vue-i18n";
import autocomplete, { AutocompleteResult } from "autocompleter";
import { Customer, Project, TimeEntry } from "@/api/types";
import TimeEntriesService from "@/api/TimeEntriesService";
import ProjectsService from "@/api/ProjectsService";
import CustomersService from "@/api/CustomersService";
import { getCustomerName } from "@/utils/getCustomerName";
import { TaskData } from "@/api/types";
import {
  AutocompleteItem,
  CustomerAutocompleteItem,
  ProjectAutocompleteItem,
  renderAutocompleteCustomerEntry,
  renderAutocompleteProjectEntry,
  renderAutocompleteTimeEntryEntry,
  TimeEntryAutocompleteItem,
} from "@/utils/renderAutocompleteItem";

export default defineComponent({
  projectName: "NewTimeEntryInput",
  props: {
    modelValue: {
      type: Object as PropType<TaskData>,
      required: true,
    },
  },
  emits: [
    "update:modelValue",
    "time-entry-selected",
    "customer-selected",
    "project-selected",
  ],
  setup(props, { emit }) {
    const { t } = useI18n();
    const input = ref() as Ref<HTMLInputElement>;
    let spliceIndex: number | undefined;
    let autocompleteInstance: AutocompleteResult;

    const modelProxy = computed({
      get() {
        return props.modelValue;
      },
      set(value: TaskData) {
        emit("update:modelValue", value);
      },
    });

    function handleInput(event: Event): void {
      const target = event.target as HTMLInputElement;
      modelProxy.value.description = target.value;
    }

    async function suggestTimeEntries(query: string) {
      const {
        data: { data: timeEntries },
      } =
        query === ""
          ? await new TimeEntriesService().include("project").suggest()
          : await new TimeEntriesService().include("project").search(query);

      const newData: TimeEntryAutocompleteItem[] = timeEntries.map(
        (timeEntry: TimeEntry) => ({
          type: "time-entry",
          label: timeEntry.description,
          value: timeEntry,
        })
      );

      return newData;
    }

    function getQuerySuggestion(text: string, stopWord: string) {
      return text.match(new RegExp(`${stopWord}(\\w+)`));
    }

    async function suggestProject(text: string) {
      const match = getQuerySuggestion(text, "#");

      const query = match ? match[1] ?? "" : "";
      spliceIndex = match ? match["index"] ?? spliceIndex : spliceIndex;

      const {
        data: { data: projects },
      } =
        query === ""
          ? await new ProjectsService().suggest()
          : await new ProjectsService().search(query);

      const newData: ProjectAutocompleteItem[] = projects.map(
        (project: Project) => ({
          type: "project",
          label: project.name,
          value: project,
        })
      );

      return newData;
    }

    async function suggestCustomer(text: string) {
      const match = getQuerySuggestion(text, "@");

      const query = match ? match[1] ?? "" : "";
      spliceIndex = match ? match["index"] ?? spliceIndex : spliceIndex;

      const {
        data: { data: customers },
      } =
        query === ""
          ? await new CustomersService().suggest()
          : await new CustomersService().search(query);

      const newData: CustomerAutocompleteItem[] = customers.map(
        (customer: Customer) => ({
          type: "customer",
          label: getCustomerName(customer),
          value: customer,
        })
      );

      return newData;
    }

    onMounted(() => {
      autocompleteInstance = autocomplete<AutocompleteItem>({
        input: input.value,
        emptyMsg: t("actionBar.noResult"),
        minLength: 0,
        debounceWaitMs: 100,
        showOnFocus: true,
        fetch: async (text, callback) => {
          if (!text.includes("#") && !text.includes("@")) {
            return callback(await suggestTimeEntries(text));
          } else if (text.search("#") > text.search("@")) {
            return callback(await suggestProject(text));
          } else {
            return callback(await suggestCustomer(text));
          }
        },
        render(item: AutocompleteItem): HTMLDivElement | undefined {
          if (item.type === "time-entry") {
            return renderAutocompleteTimeEntryEntry(item);
          }

          if (item.type === "customer") {
            return renderAutocompleteCustomerEntry(item);
          }

          if (item.type === "project") {
            return renderAutocompleteProjectEntry(
              item as ProjectAutocompleteItem
            );
          }
        },
        onSelect(item: AutocompleteItem) {
          if (item.type === "time-entry") {
            emit("time-entry-selected", item.value);
          }

          if (item.type === "customer") {
            emit("customer-selected", item.value);
            input.value.value = input.value.value.slice(0, spliceIndex).trim();
            modelProxy.value.description = input.value.value;
            spliceIndex = undefined;
          }

          if (item.type === "project") {
            emit("project-selected", item.value);
            input.value.value = input.value.value.slice(0, spliceIndex).trim();
            modelProxy.value.description = input.value.value;
            spliceIndex = undefined;
          }
        },
        customize: (
          input: HTMLInputElement,
          inputRect,
          container: HTMLDivElement,
          maxHeight: number
        ) => {
          container.style.width = `${
            input.parentElement?.getBoundingClientRect().width
          }px`;

          container.style.visibility = "visible";
          container.style.zIndex = "1000";

          if (maxHeight < 100) {
            container.style.top = "";
            container.style.bottom =
              window.innerHeight - inputRect.bottom + input.offsetHeight + "px";
            container.style.maxHeight = "200px";
          }
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
