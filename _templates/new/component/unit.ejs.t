---
to: "tests/unit/<%= h.changeCase.camel(name) %>.spec.ts"
---
import <%= h.changeCase.pascal(name) %> from "@/components/<%= name %>.vue";

describe("@components/<%= name %>.vue", () => {
  it("exports a valid component", () => {
    expect(<%= name %>).toBeTruthy();
  });
});
