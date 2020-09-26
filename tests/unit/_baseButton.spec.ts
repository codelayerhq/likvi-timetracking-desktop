import BaseButton from "@/components/_BaseButton.vue";
import { mount } from "@vue/test-utils";

describe("@components/BaseButton.vue", () => {
  it("can set the label of the button", () => {
    const wrapper = mount(BaseButton, {
      props: {
        label: "Test",
      },
    });

    expect(wrapper.text()).toContain("Test");
  });

  it("can set the color of the button", () => {
    const wrapper = mount(BaseButton, {
      props: {
        color: "red",
      },
    });

    const expexted = [
      "hover:bg-red-500",
      "bg-red-600",
      "focus:border-red-700",
      "active:bg-red-700",
      "focus:shadow-outline-red-500",
    ];

    expect(wrapper.classes()).toEqual(expect.arrayContaining(expexted));
  });
});
