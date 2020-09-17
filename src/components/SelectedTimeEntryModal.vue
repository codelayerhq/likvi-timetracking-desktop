<template>
  <base-modal
    ref="modal"
    class="bottom-0 w-full px-8 py-6"
    style="height: 95vh"
  >
    <template #header>
      <header class="absolute top-0 right-0 mt-4 mr-4">
        <base-icon-button class="block ml-auto" @click="handleCloseClick">
          <svg viewBox="0 0 20 20" fill="currentColor" class="w-6 h-6 x">
            <path
              fill-rule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clip-rule="evenodd"
            ></path>
          </svg>
        </base-icon-button>
      </header>
    </template>

    <div class="flex flex-col justify-between h-full">
      <form
        v-if="hasSelectedTimeEntry"
        id="selected-time-entry-form"
        @submit.prevent="handleSave"
      >
        <h2 class="mb-6 font-semibold text-gray-800">Details</h2>

        <base-input
          v-model="formData.description"
          name="description"
          label="Description"
          placeholder="Description"
          class="mb-4"
        />

        <base-select
          v-model="formData.projectId"
          name="project"
          label="Project"
          placeholder="Project"
          class="mb-4"
          :options="[{ label: 'foo', value: 'bar' }]"
        />

        <base-select
          v-model="formData.customerId"
          name="project"
          label="Customer"
          placeholder="Customer"
          class="mb-4"
          :options="[{ label: 'foo', value: 'bar' }]"
        />

        <base-radio
          v-model="formData.billable"
          name="billable"
          label="Billable"
          class="mb-4"
          :options="[
            { label: 'Billable', value: true },
            { label: 'Not billable', value: false },
          ]"
        />

        <base-input
          v-model="formData.startedAt"
          type="datetime-local"
          name="startedAt"
          label="Started at"
          placeholder="Started at"
          class="mb-4"
          :max="startedAtMax"
          required
        />

        <base-input
          v-model="formData.stoppedAt"
          type="datetime-local"
          name="StoppedAt"
          label="Stopped at"
          placeholder="Stopped at"
        />
      </form>

      <footer>
        <base-button type="submit" form="selected-time-entry-form">
          Save
        </base-button>
      </footer>
    </div>
  </base-modal>
</template>

<script lang="ts">
import { defineComponent, watch, ref, reactive, computed } from "vue";
import useSelectedTimeEntry from "@/composables/useSelectedTimeEntry";
import { TimeEntry } from "@/api/types";
import { format, parse, subMinutes } from "date-fns";
import _BaseModalVue from "./_BaseModal.vue";
import store from "@/store";
import { DateTimeStrUTC, toDateTimeStrUTC } from "@/utils/dateTimeStrUTC";
import { ActionTypes } from "@/store/actions";
import { parseISO } from "date-fns/esm/fp";

interface InitialFormData {
  description: string | null;
  projectId: number | null;
  customerId: number | null;
  billable: boolean | null;
  startedAt: string | null;
  stoppedAt: string | null;
}

export default defineComponent({
  name: "SelectedTimeEntryModal",
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
      const data = {
        description: formData.description,
        project_id: formData.projectId,
        customer_id: formData.customerId,
        billable: formData.billable,
        started_at: formData.startedAt
          ? toDateTimeStrUTC(
              parse(formData.startedAt, "yyyy-MM-dd'T'HH:mm", new Date())
            )
          : null,
        stopped_at: formData.stoppedAt
          ? toDateTimeStrUTC(
              parse(formData.stoppedAt, "yyyy-MM-dd'T'HH:mm", new Date())
            )
          : null,
      };

      await store.dispatch(ActionTypes.UPDATE_SELECTED_TIME_ENTRY, data);
      store.dispatch(ActionTypes.FETCH_TIME_ENTRIES);
      store.dispatch(ActionTypes.FETCH_STATISTICS);
    }

    function toDateTimeInputString(date: DateTimeStrUTC): string {
      return format(parseISO(date), "yyyy-MM-dd'T'HH:mm");
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
      modal,
      handleCloseClick,
      selectedTimeEntry,
      hasSelectedTimeEntry,
      formData,
      handleSave,
      startedAtMax,
    };
  },
});
</script>
