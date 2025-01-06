import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
    },
    container:{
      center: true,
      padding: '1.5rem',
      screens: {
        '2xl' : '1360'
      }
    }
  },
  plugins: [require('@tailwindcss/forms')],
} satisfies Config;
