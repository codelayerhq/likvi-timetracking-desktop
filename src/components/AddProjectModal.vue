<template>
  <base-modal
    ref="modal"
    class="w-3/4 px-8 py-6"
    style="top: 50%; left: 50%; transform: translate(-50%, -50%)"
    show-modal
  >
    <template #header>
      <header class="absolute top-0 right-0 mt-4 mr-4">
        <button class="block ml-auto btn-icon" @click="handleCloseClick">
          <svg viewBox="0 0 20 20" fill="currentColor" class="w-6 h-6 x">
            <path
              fill-rule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clip-rule="evenodd"
            ></path>
          </svg>
        </button>
      </header>

      <div class="flex flex-col justify-between h-full">
        <form id="add-project-form" @submit.prevent="handleSave">
          <h2 class="mb-6 font-semibold text-gray-800">
            {{ t("projectModal.project") }}
          </h2>

          <div class="flex mb-4 space-x-4">
            <div class="w-full">
              <base-input
                v-model="formData.name"
                name="name"
                :label="t('projectModal.name')"
                :placeholder="t('projectModal.name')"
                required
              />
            </div>

            <label
              for="colorHex"
              class="block text-sm font-medium leading-5 text-gray-700"
            >
              <span>{{ t("projectModal.colorHex") }}</span>

              <color-select
                v-model="formData.colorHex"
                name="colorHex"
                :label="t('projectModal.colorHex')"
                :placeholder="t('projectModal.colorHex')"
                type="color"
                class="mt-1"
              />
            </label>
          </div>

          <!-- Todo: Customer Select breaks on modal due to stacking context
          <customer-select v-model="formData.customer" class="mb-4" />
          -->

          <base-input
            v-model="formData.startDate"
            type="date"
            name="startDate"
            :label="t('projectModal.startDate')"
            :placeholder="t('projectModal.startDate')"
            class="mb-4"
          />

          <base-input
            v-model="formData.endDate"
            type="date"
            name="endDate"
            :label="t('projectModal.endDate')"
            :placeholder="t('projectModal.endDate')"
            class="mb-4"
          />
        </form>

        <footer>
          <button type="submit" form="add-project-form" class="btn-primary">
            {{ t("projectModal.add") }}
          </button>
        </footer>
      </div>
    </template>
  </base-modal>
</template>

<script lang="ts">
import { Customer, ProjectPayload, ProjectType } from "@/api/types";
import { ActionTypes } from "@/store/actions";
import { toDateTimeStrUTC } from "@/utils/dateTimeStrUTC";
import { parse } from "date-fns/esm";
import { computed, defineComponent, reactive, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useToast } from "vue-toastification";
import { useStore } from "vuex";
import _BaseModalVue from "./_BaseModal.vue";
import ColorSelect from "./ColorSelect.vue";

interface InitialFormData {
  name: string;
  colorHex: string;
  customer?: Customer;
  startDate?: string;
  endDate?: string;
  projectType: ProjectType;
  estimatedHours?: number;
  rate?: number;
  budget?: number;
}

export default defineComponent({
  name: "AddProjectModal",
  components: {
    ColorSelect,
  },
  setup() {
    const modal = ref(_BaseModalVue);
    const store = useStore();
    const { t } = useI18n();
    const toast = useToast();

    const modalOpen = computed(() => store.state.addProjectModalOpen);

    const initialFormData: InitialFormData = {
      name: "",
      colorHex: "#000000",
      customer: undefined,
      startDate: undefined,
      endDate: undefined,
      projectType: ProjectType.TIME_AND_MATERIALS,
      estimatedHours: undefined,
      rate: undefined,
      budget: undefined,
    };

    const formData = reactive({ ...initialFormData });

    async function handleSave() {
      const data: ProjectPayload = {
        name: formData.name,
        color_hex: formData.colorHex,
        customerId: formData.customer?.id ?? null,
        start_date: formData.startDate
          ? toDateTimeStrUTC(
              parse(formData.startDate, "yyyy-MM-dd", new Date())
            )
          : undefined,
        end_date: formData.endDate
          ? toDateTimeStrUTC(parse(formData.endDate, "yyyy-MM-dd", new Date()))
          : undefined,
        project_type: formData.projectType,
        estimated_hours: formData.estimatedHours,
        rate: formData.rate,
        budget: formData.budget,
      };

      await store.dispatch(ActionTypes.CREATE_PROJECT, data);

      close();
      toast.success(t("projectModal.projectCreated"));
    }

    watch(modalOpen, (value) => {
      if (value === true) {
        modal.value.open();
      } else {
        modal.value.close();
      }
    });

    function resetFormData() {
      Object.keys(formData).forEach(
        //@ts-ignore
        (key) => (formData[key] = initialFormData[key])
      );
    }

    function close() {
      resetFormData();
      store.dispatch(ActionTypes.SET_ADD_PROJECT_MODAL_OPEN, false);
    }

    function handleCloseClick() {
      close();
    }

    return {
      t,
      modal,
      handleCloseClick,
      formData,
      handleSave,
    };
  },
});
</script>
