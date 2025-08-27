import type { Meta, StoryObj } from "@storybook/react";
import HeroCarousel from "./HeroCarousel";

const meta: Meta<typeof HeroCarousel> = {
  title: "Layout/HeroCarousel",
  component: HeroCarousel,
  parameters: { layout: "fullscreen" }
};
export default meta;

export const Fullscreen: StoryObj = {};
