import BaseInput from "@/components/_BaseInput.vue";
import { mount } from "@vue/test-utils";

describe("@components/BaseInput.vue", () => {
  it("can set the props", () => {
    const wrapper = mount(BaseInput, {
      props: {
        name: "testName",
        label: "Test Label",
        modelValue: null,
      },
    });

    expect(wrapper.find("label").text()).toEqual("Test Label");
    expect(wrapper.find("input").attributes("id")).toEqual("testName");
  });

  it("sets the initial value", () => {
    const wrapper = mount(BaseInput, {
      props: {
        name: "Test",
        label: "Test",
        modelValue: "foo",
      },
    });

    expect(wrapper.find("input").element.value).toEqual("foo");
  });

  it("emits the right event on input", async () => {
    const wrapper = mount(BaseInput, {
      props: {
        name: "Test",
        label: "Test",
        modelValue: null,
      },
    });

    await wrapper.find("input").setValue("text");

    expect(wrapper.emitted()).toHaveProperty("update:modelValue");
    expect(wrapper.emitted()["update:modelValue"][0]).toEqual(["text"]);
    expect(wrapper.find("input").element.value).toEqual("text");
  });
});
