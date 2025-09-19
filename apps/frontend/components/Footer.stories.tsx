// apps/frontend/components/Footer.stories.tsx
import type { Meta, StoryObj } from "@storybook/nextjs";
import Footer from "./Footer";

const meta: Meta<typeof Footer> = {
  title: "Site/Footer",
  component: Footer,
  parameters: {
    layout: "fullscreen",
  },
};
export default meta;

type Story = StoryObj<typeof Footer>;

export const Default: Story = {
  render: () => (
    <div className="bg-neutral-100 min-h-screen flex flex-col justify-end">
      <Footer />
    </div>
  ),
};
