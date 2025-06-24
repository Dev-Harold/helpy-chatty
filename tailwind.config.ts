import type { Config } from "tailwindcss";

export default {
  content: ["./src/app/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      screens: {
        'custom-breakpoint': '760px',
      },
    },
  },
  plugins: [],
} satisfies Config;
