---
to: "tests/unit/<%= h.changeCase.kebab(name).toLowerCase().slice(0, 5) === 'base-' ? '_' : '' %><%= h.changeCase.camel(name) %>.spec.ts"
---
<%
  let fileName = name
  if (h.changeCase.kebab(name).toLowerCase().slice(0, 5) === 'base-') {
    fileName = '_' + fileName
  }
%>import <%= name %> from "@/components/<%= fileName %>.vue";

describe("@components/<%= name %>.vue", () => {
  it("exports a valid component", () => {
    expect(<%= name %>).toBeTruthy();
  });
});
