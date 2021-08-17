import { Customer } from "@/api/types";

export function getCustomerName(customer: Customer): string {
  if (customer.type === "company") {
    return customer.name;
  } else if (customer.type === "person") {
    return [customer.first_name, customer.last_name].join(" ").trim();
  } else if (customer.type === "contact_person") {
    return [customer.first_name, customer.last_name].join(" ").trim();
  }

  return "";
}
