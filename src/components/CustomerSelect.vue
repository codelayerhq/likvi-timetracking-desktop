<template>
  <div>
    <label
      for="customer-select"
      class="block text-sm font-medium leading-5 text-gray-700"
    >
      Customer
    </label>
    <input
      id="customer-select"
      ref="input"
      :value="displayValue"
      class="relative block w-full mt-1 rounded-md shadow-sm px-7 form-input sm:text-sm sm:leading-5"
      placeholder="Search for a customer"
      type="search"
      @search="handleSearchEvent"
    />
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
import CustomersService from "@/api/CustomersService";
import { Customer } from "@/api/types";
import { getCustomerName } from "@/utils/getCustomerName";

interface CustomerAutocompleteItem {
  label: string;
  value: Customer;
}

export default defineComponent({
  name: "CustomerSelect",
  props: {
    modelValue: {
      type: Object as PropType<Customer | null>,
      default: null,
    },
  },
  emits: ["update:modelValue"],
  setup(props, { emit }) {
    const input = ref() as Ref<HTMLInputElement>;
    const inputValue = ref();
    const displayValue = computed(() =>
      props.modelValue ? getCustomerName(props.modelValue) : ""
    );
    let autocompleteInstance: AutocompleteResult;

    function handleReset() {
      emit("update:modelValue", null);
      nextTick(() => input.value.focus());
    }

    function handleSearchEvent(evt: Event) {
      const target = evt.target as HTMLInputElement;

      // The user clicked the native input[type="search"] clear button
      if (target.value === "") {
        handleReset();
      }
    }

    onMounted(() => {
      autocompleteInstance = autocomplete<CustomerAutocompleteItem>({
        input: input.value,
        emptyMsg: "No customers found",
        minLength: 1,
        debounceWaitMs: 100,
        fetch: async (text, callback) => {
          const {
            data: { data: customers },
          } = await new CustomersService().search(text);

          const newData: CustomerAutocompleteItem[] = customers.map(
            (customer: Customer) => ({
              label: getCustomerName(customer),
              value: customer,
            })
          );

          callback(newData);
        },
        onSelect(item: CustomerAutocompleteItem) {
          emit("update:modelValue", item.value);
          inputValue.value = item.label;
        },
      });
    });

    onBeforeUnmount(() => {
      autocompleteInstance.destroy();
    });

    return {
      input,
      inputValue,
      displayValue,
      handleReset,
      handleSearchEvent,
    };
  },
});
</script>

<style>
#customer-select::-webkit-search-cancel-button {
  appearance: inherit;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23a0aec0' class='w-4 h-4' %3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M6 18L18 6M6 6l12 12' /%3E%3C/svg%3E");
  @apply w-4 h-4 opacity-100 cursor-pointer;
}

.autocomplete {
  @apply bg-white z-50 overflow-auto mt-2 border border-gray-300 rounded shadow-sm;
  max-height: 200px !important;
}

.autocomplete > div {
  @apply px-2 py-2;
}

.autocomplete .group {
  background: #eee;
}

.autocomplete > div:hover:not(.group) {
  @apply bg-gray-100 cursor-pointer;
}

.autocomplete > div.selected {
  @apply bg-gray-100;
}
</style>