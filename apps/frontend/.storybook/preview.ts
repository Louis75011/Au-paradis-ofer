import type { Preview } from "@storybook/react";
import "../app/globals.css"; // TW v4 : un seul fichier global qui fait @import "tailwindcss";

const preview: Preview = {
  parameters: {
    layout: "fullscreen",
    controls: {
      matchers: { color: /(background|color)$/i, date: /Date$/i }
    }
  },
  // a11y: {
  //     'todo' - show a11y violations in the test UI only
  //     'error' - fail CI on a11y violations
  //     'off' - skip a11y checks entirely
  //     test: 'todo'
  //   }
};

export default preview;