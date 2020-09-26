import BaseIconButton from "@/components/_BaseIconButton.vue";
import { mount } from "@vue/test-utils";

describe("@components/BaseIconButton.vue", () => {
  it("can set the button content", () => {
    const wrapper = mount(BaseIconButton, {
      slots: {
        default: "<span>Test</span>",
      },
    });

    expect(wrapper.html()).toContain("<span>Test</span>");
  });
});
