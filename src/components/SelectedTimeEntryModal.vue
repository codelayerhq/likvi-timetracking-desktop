<template>
  <base-modal
    ref="modal"
    class="bottom-0 w-full px-8 py-6 bg-gray-50"
    style="height: 95vh"
    apply-transform-styles
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
    </template>

    <div class="flex flex-col justify-between h-full">
      <form
        v-if="hasSelectedTimeEntry"
        id="selected-time-entry-form"
        @submit.prevent="handleSave"
      >
        <h2 class="mb-6 font-semibold text-gray-800">
          {{ t("activeTimeEntryModal.details") }}
        </h2>

        <base-input
          v-model="formData.description"
          type="text"
          name="description"
          :label="t('activeTimeEntryModal.description')"
          :placeholder="t('activeTimeEntryModal.description')"
          class="mb-4"
        />

        <div class="flex items-end mb-4 space-x-2">
          <project-select v-model="formData.project" class="w-full" />
          <button
            type="button"
            class="w-8 h-12 btn-icon"
            @click="handleAddProject"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
          </button>
        </div>

        <customer-select v-model="formData.customer" class="mb-4" />

        <base-radio
          v-model="formData.billable"
          name="billable"
          :label="t('activeTimeEntryModal.billable')"
          class="mb-4"
          :options="[
            { label: t('activeTimeEntryModal.billable'), value: true },
            { label: t('activeTimeEntryModal.notBillable'), value: false },
          ]"
        />

        <base-input
          v-model="formData.startedAt"
          type="datetime-local"
          name="startedAt"
          :label="t('activeTimeEntryModal.startedAt')"
          :placeholder="t('activeTimeEntryModal.startedAt')"
          class="mb-4"
          :max="startedAtMax"
          required
        />

        <base-input
          v-model="formData.stoppedAt"
          type="datetime-local"
          name="StoppedAt"
          :label="t('activeTimeEntryModal.stoppedAt')"
          :placeholder="t('activeTimeEntryModal.stoppedAt')"
        />
      </form>

      <footer>
        <button
          type="submit"
          form="selected-time-entry-form"
          class="btn-primary"
        >
          {{ t("activeTimeEntryModal.save") }}
        </button>
      </footer>
    </div>
  </base-modal>
</template>

<script lang="ts">
import { defineComponent, watch, ref, reactive, computed } from "vue";
import useSelectedTimeEntry from "@/composables/useSelectedTimeEntry";
import { Customer, Project, TimeEntry, TimeEntryPayload } from "@/api/types";
import { format, parse, subMinutes } from "date-fns";
import _BaseModalVue from "./_BaseModal.vue";
import store from "@/store";
import { DateTimeStrUTC, toDateTimeStrUTC } from "@/utils/dateTimeStrUTC";
import { ActionTypes } from "@/store/actions";
import { parseISO } from "date-fns";
import ProjectSelect from "@/components/ProjectSelect.vue";
import CustomerSelect from "@/components/CustomerSelect.vue";
import { useI18n } from "vue-i18n";

interface InitialFormData {
  description: string | null;
  projectId: number | null;
  customerId: number | null;
  billable: string | boolean | null;
  startedAt: string | null;
  stoppedAt: string | null;
  project: Project | null;
  customer: Customer | null;
}

export default defineComponent({
  name: "SelectedTimeEntryModal",
  components: {
    ProjectSelect,
    CustomerSelect,
  },
  setup() {
    const modal = ref(_BaseModalVue);
    const {
      selectedTimeEntry,
      hasSelectedTimeEntry,
      setSelectedTimeEntry,
    } = useSelectedTimeEntry();

    const initialFormData: InitialFormData = {
      description: null,
      projectId: null,
      customerId: null,
      billable: false,
      startedAt: null,
      stoppedAt: null,
      project: null,
      customer: null,
    };

    const formData = reactive(initialFormData);

    function hydrateForm(timeEntry: TimeEntry | null) {
      if (timeEntry !== null) {
        formData.description = timeEntry.description;
        formData.projectId = timeEntry.project_id;
        formData.customerId = timeEntry.customer_id;
        formData.billable = timeEntry.billable;
        formData.startedAt =
          timeEntry.started_at !== null
            ? //@ts-ignore Because of the strictly typed time string we can not append without the compiler warning us
              //Append "Z" to interpret as UTC
              toDateTimeInputString(timeEntry.started_at.date + "Z")
            : null;
        formData.stoppedAt =
          timeEntry.stopped_at !== null
            ? //@ts-ignore Because of the strictly typed time string we can not append without the compiler warning us
              //Append "Z" to interpret as UTC
              toDateTimeInputString(timeEntry.stopped_at.date + "Z")
            : null;
        formData.project = selectedTimeEntry.value?.project
          ? { ...selectedTimeEntry.value.project.data }
          : null;
        formData.customer = selectedTimeEntry.value?.customer
          ? { ...selectedTimeEntry.value.customer.data }
          : null;
      }
    }

    const startedAtMax = computed(() =>
      formData.stoppedAt
        ? format(
            subMinutes(
              parse(formData.stoppedAt, "yyyy-MM-dd'T'HH:mm", new Date()),
              1
            ),
            "yyyy-MM-dd'T'HH:mm"
          )
        : null
    );

    function handleCloseClick() {
      setSelectedTimeEntry(null);
    }

    async function handleSave() {
      const data: TimeEntryPayload = {
        description: formData.description,
        project_id: formData.project?.id ?? null,
        customer_id: formData.customer?.id ?? null,
        billable: formData.billable === "true",
        started_at: formData.startedAt
          ? toDateTimeStrUTC(
              parse(formData.startedAt, "yyyy-MM-dd'T'HH:mm", new Date())
            )
          : undefined,
        stopped_at: formData.stoppedAt
          ? toDateTimeStrUTC(
              parse(formData.stoppedAt, "yyyy-MM-dd'T'HH:mm", new Date())
            )
          : undefined,
      };

      await store.dispatch(ActionTypes.UPDATE_SELECTED_TIME_ENTRY, data);
      store.dispatch(ActionTypes.FETCH_DATA);

      setSelectedTimeEntry(null);
    }

    function toDateTimeInputString(date: DateTimeStrUTC): string {
      return format(parseISO(date), "yyyy-MM-dd'T'HH:mm");
    }

    function handleAddProject() {
      store.dispatch(ActionTypes.SET_ADD_PROJECT_MODAL_OPEN, true);
    }

    watch(hasSelectedTimeEntry, function (hasSelectedTimeEntry) {
      if (hasSelectedTimeEntry && modal.value.getOpenState() !== true) {
        modal.value.open();
        hydrateForm(selectedTimeEntry.value);
      } else {
        modal.value.close();
      }
    });

    return {
      ...useI18n(),
      modal,
      handleCloseClick,
      selectedTimeEntry,
      hasSelectedTimeEntry,
      formData,
      handleSave,
      startedAtMax,
      handleAddProject,
    };
  },
});
</script>
