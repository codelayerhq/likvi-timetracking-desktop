---
to: "tests/unit/<%= h.changeCase.camel(name) %>.spec.ts"
---
import <%= h.changeCase.pascal(name) %> from "@/views/<%= name %>.vue";

describe("@views/<%= name %>.vue", () => {
  it("exports a valid component", () => {
    expect(<%= name %>).toBeTruthy();
  });
});
