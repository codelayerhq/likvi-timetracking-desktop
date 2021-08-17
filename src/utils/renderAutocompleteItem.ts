import { Customer, Project, TimeEntry } from "@/api/types";
import { i18n } from "@/main";

export interface TimeEntryAutocompleteItem {
  type: "time-entry";
  label: string;
  value: TimeEntry;
}

export interface ProjectAutocompleteItem {
  type: "project";
  label: string;
  value: Project;
}

export interface CustomerAutocompleteItem {
  type: "customer";
  label: string;
  value: Customer;
}

export type AutocompleteItem =
  | CustomerAutocompleteItem
  | ProjectAutocompleteItem
  | TimeEntryAutocompleteItem;

export function renderAutocompleteTimeEntryEntry(
  item: TimeEntryAutocompleteItem
): HTMLDivElement | undefined {
  const wrapper = document.createElement("div");
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  const circle = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "circle"
  );
  const timeEntrySpan = document.createElement("span");
  const projectWrapper = document.createElement("div");
  const projectSpan = document.createElement("span");
  const projectName =
    item.value?.project?.data.name ||
    i18n.global.t("projectIndicator.noProject");
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

  ["flex", "items-center", "text-xs", "select-none"].forEach((eleClass) =>
    projectWrapper.classList.add(eleClass)
  );
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
}

export function renderAutocompleteCustomerEntry(
  item: CustomerAutocompleteItem
): HTMLDivElement | undefined {
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

  ["flex", "items-center", "text-xs", "select-none"].forEach((eleClass) =>
    customerWrapper.classList.add(eleClass)
  );

  customerSpan.textContent = customerName as string | null;
  customerSpan.classList.add("block");

  wrapper.appendChild(customerSpan);
  wrapper.appendChild(customerWrapper);

  return wrapper;
}

export function renderAutocompleteProjectEntry(
  item: ProjectAutocompleteItem
): HTMLDivElement | undefined {
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

  ["flex", "items-center", "text-xs", "select-none"].forEach((eleClass) =>
    projectWrapper.classList.add(eleClass)
  );

  projectSpan.textContent = projectName as string | null;
  projectSpan.classList.add("block");

  wrapper.appendChild(projectSpan);
  wrapper.appendChild(projectWrapper);

  return wrapper;
}
