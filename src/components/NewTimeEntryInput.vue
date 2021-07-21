<template>
  <label for="newTimeEntry" class="sr-only">
    {{ t("actionBar.what_are_you_working_on") }}
  </label>
  <input
    ref="input"
    type="text"
    projectName="newTimeEntry"
    class="h-full text-input"
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

interface TimeEntryAutocompleteItem {
  label: string;
  value: TimeEntry;
}

interface ProjectAutocompleteItem {
  label: string;
  value: Project;
  projectId: number;
}

interface CustomerAutocompleteItem {
  label: string;
  value: Customer;
  customerId: number;
}

type AutocompleteItem = Partial<
  CustomerAutocompleteItem & ProjectAutocompleteItem & TimeEntryAutocompleteItem
>;

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
    let spliceIndex: number;
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

    onMounted(() => {
      autocompleteInstance = autocomplete<AutocompleteItem>({
        input: input.value,
        emptyMsg: t("actionBar.noResult"),
        minLength: 0,
        debounceWaitMs: 100,
        showOnFocus: true,
        fetch: async (text, callback) => {
          let loadedData;
          if (text.search("#") < 0 && text.search("@") < 0) {
            const {
              data: { data: timeEntries },
            } =
              text === ""
                ? await new TimeEntriesService().include("project").suggest()
                : await new TimeEntriesService()
                    .include("project")
                    .search(text);

            const newData: TimeEntryAutocompleteItem[] = timeEntries.map(
              (timeEntry: TimeEntry) => ({
                label: timeEntry.description,
                value: timeEntry,
              })
            );

            loadedData = newData;
          } else if (text.search("#") > text.search("@")) {
            spliceIndex = text.search("#");

            const {
              data: { data: projects },
            } =
              text.length < spliceIndex || spliceIndex === 0
                ? await new ProjectsService().suggest()
                : await new ProjectsService().search(text);

            const newData: ProjectAutocompleteItem[] = projects.map(
              (project: Project) => ({
                label: project.name,
                value: project,
                projectId: project.id,
              })
            );

            loadedData = newData;
          } else if (text.search("@") > text.search("#")) {
            spliceIndex = text.search("@");
            console.log("splice here", spliceIndex);
            console.log("text length", text.length);
            const {
              data: { data: customers },
            } =
              text.length < spliceIndex || spliceIndex === 0
                ? await new CustomersService().suggest()
                : await new CustomersService().search(text);

            const newData: CustomerAutocompleteItem[] = customers.map(
              (customer: Customer) => ({
                label: getCustomerName(customer),
                value: customer,
                customerId: customer.id,
              })
            );

            loadedData = newData;
          }
          callback(loadedData as false | AutocompleteItem[]);
        },
        render(item: AutocompleteItem): HTMLDivElement | undefined {
          let returnedWrapper;
          if (item.value?.description) {
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
              "w-full",
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

            returnedWrapper = wrapper;
          } else if (item.value?.type === "person") {
            const wrapper = document.createElement("div");
            const customerSpan = document.createElement("span");
            const customerWrapper = document.createElement("div");
            const customerName = item.label;

            [
              "flex",
              "justify-between",
              "select-none",
              "text-gray-900",
              "text-sm",
              "w-full",
            ].forEach((eleClass) => wrapper.classList.add(eleClass));

            [
              "flex",
              "items-center",
              "text-xs",
              "select-none",
            ].forEach((eleClass) => customerWrapper.classList.add(eleClass));

            customerSpan.textContent = customerName as string | null;
            customerSpan.classList.add("block");

            wrapper.appendChild(customerSpan);
            wrapper.appendChild(customerWrapper);

            returnedWrapper = wrapper;
          } else if (item.value?.project_type) {
            const wrapper = document.createElement("div");
            const projectSpan = document.createElement("span");
            const projectWrapper = document.createElement("div");
            const projectName = item.label;

            [
              "flex",
              "justify-between",
              "select-none",
              "text-gray-900",
              "text-sm",
              "w-full",
            ].forEach((eleClass) => wrapper.classList.add(eleClass));

            [
              "flex",
              "items-center",
              "text-xs",
              "select-none",
            ].forEach((eleClass) => projectWrapper.classList.add(eleClass));

            projectSpan.textContent = projectName as string | null;
            projectSpan.classList.add("block");

            wrapper.appendChild(projectSpan);
            wrapper.appendChild(projectWrapper);

            returnedWrapper = wrapper;
          }
          return returnedWrapper;
        },
        onSelect(item: AutocompleteItem) {
          if (item.value?.description) {
            emit("time-entry-selected", item.value);
          } else if (item.value?.type === "person") {
            emit("customer-selected", item.value);
            input.value.value = input.value.value.slice(0, spliceIndex);
          } else if (item.value?.project_type) {
            emit("project-selected", item.value);
            input.value.value = input.value.value.slice(0, spliceIndex);
          }
        },
        customize: (
          input: HTMLInputElement,
          inputRect,
          container: HTMLDivElement,
          maxHeight: number
        ) => {
          container.style.width = `${inputRect.width}`;
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
