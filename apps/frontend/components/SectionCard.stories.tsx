import type { Meta, StoryObj } from "@storybook/nextjs"; 
import SectionCard from "./SectionCard";

const meta: Meta<typeof SectionCard> = {
  component: SectionCard,
  title: "UI/SectionCard",
};
export default meta;

type Story = StoryObj<typeof SectionCard>;

export const Base: Story = {
  args: {
    title: "Exemple de carte",
    children: "Contenu de démonstration.",
  },
};
