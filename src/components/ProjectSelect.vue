<template>
  <div>
    <label
      for="project-select"
      class="block text-sm font-medium leading-5 text-gray-700"
    >
      {{ t("projectSelect.label") }}
      <input
        v-show="!hasProject"
        id="project-select"
        ref="input"
        :value="modelValue ? modelValue.name : ''"
        class="mt-1 text-input"
        :placeholder="t('projectSelect.placeholder')"
        type="search"
      />
    </label>
    <div
      v-show="hasProject"
      class="flex items-center justify-between w-full px-4 mt-1 border text-input"
    >
      <project-indicator :project="modelValue" class="text-base" />
      <button
        type="button"
        class="h-full p-1 text-gray-500 bg-transparent border-transparent sm:text-sm sm:leading-5"
        @click="handleReset"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          class="w-4 h-4"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  nextTick,
  onBeforeUnmount,
  onMounted,
  PropType,
  Ref,
  ref,
} from "vue";
import autocomplete, { AutocompleteResult } from "autocompleter";
import ProjectsService from "@/api/ProjectsService";
import { Project } from "@/api/types";
import ProjectIndicator from "@/components/ProjectIndicator.vue";
import { useI18n } from "vue-i18n";

interface ProjectAutocompleteItem {
  label: string;
  value: Project;
}

export default defineComponent({
  name: "ProjectSelect",
  components: {
    ProjectIndicator,
  },
  props: {
    modelValue: {
      type: Object as PropType<Project | null>,
      default: null,
    },
  },
  emits: ["update:modelValue"],
  setup(props, { emit }) {
    const { t } = useI18n();
    const input = ref() as Ref<HTMLInputElement>;
    const inputValue = ref();
    const hasProject = computed(() => props.modelValue !== null);
    let autocompleteInstance: AutocompleteResult;

    function handleReset() {
      emit("update:modelValue", null);
      nextTick(() => input.value.focus());
    }

    onMounted(() => {
      autocompleteInstance = autocomplete<ProjectAutocompleteItem>({
        input: input.value,
        emptyMsg: t("projectSelect.noProjectsFound"),
        minLength: 0,
        showOnFocus: true,
        debounceWaitMs: 100,
        fetch: async (text, callback) => {
          let loadedData;
          if (text === "") {
            const {
              data: { data: projects },
            } = await new ProjectsService().suggest(text);

            const newData: ProjectAutocompleteItem[] = projects.map(
              (project: Project) => ({
                label: project.name,
                value: project,
              })
            );
            loadedData = newData;
          } else {
            const {
              data: { data: projects },
            } = await new ProjectsService().search(text);

            const newData: ProjectAutocompleteItem[] = projects.map(
              (project: Project) => ({
                label: project.name,
                value: project,
              })
            );
            loadedData = newData;
          }

          callback(loadedData as false | ProjectAutocompleteItem[]);
        },
        render(item: ProjectAutocompleteItem): HTMLDivElement | undefined {
          const wrapper = document.createElement("div");
          const svg = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "svg"
          );
          const circle = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "circle"
          );
          const span = document.createElement("span");

          const name = item.value?.name || t("projectIndicator.noProject");
          const color = item.value?.color_hex || "#676767";

          [
            "flex",
            "items-center",
            "select-none",
            "text-gray-900",
            "text-sm",
          ].forEach((eleClass) => wrapper.classList.add(eleClass));

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
          circle.style.color = color;

          span.classList.add("block");
          span.textContent = name;

          svg.appendChild(circle);
          wrapper.appendChild(svg);
          wrapper.appendChild(span);

          return wrapper;
        },
        onSelect(item: ProjectAutocompleteItem) {
          emit("update:modelValue", item.value);
          inputValue.value = item.label;
        },
      });
    });

    onBeforeUnmount(() => {
      autocompleteInstance.destroy();
    });

    return {
      t,
      input,
      inputValue,
      hasProject,
      handleReset,
    };
  },
});
</script>
