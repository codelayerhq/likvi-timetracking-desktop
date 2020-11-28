import BaseRadio from "@/components/_BaseRadio.vue";
import { mount } from "@vue/test-utils";

describe("@components/BaseRadio.vue", () => {
  const wrapper = mount(BaseRadio, {
    props: {
      name: "testName",
      label: "Test Label",
      modelValue: "bar",
      options: [
        { label: "foo", value: "foo" },
        { label: "bar", value: "bar" },
        { label: "baz", value: "baz" },
      ],
    },
  });

  it("renders the radio buttons", () => {
    expect(wrapper.findAll("input").length).toEqual(3);
  });

  it("can set the props", () => {
    expect(wrapper.find("span").text()).toEqual("Test Label");
    expect(
      wrapper.findAll("input").map((input) => input.attributes("name"))
    ).toEqual(["testName", "testName", "testName"]);
  });

  it("sets checks the right radio button from the inital value", () => {
    const checkedInput = wrapper
      .findAll("input")
      .find((input) => input.element.value === "bar");
    expect(checkedInput).toBeTruthy();
    expect(checkedInput?.element.checked).toBe(true);
  });
});
