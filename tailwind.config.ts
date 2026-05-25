import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        serif: ["var(--font-serif)", "serif"]
      },
      boxShadow: {
        soft: "0 18px 60px rgb(15 23 42 / 0.08)"
      },
      transitionTimingFunction: {
        fluid: "cubic-bezier(0.16, 1, 0.3, 1)"
      }
    }
  },
  plugins: []
};

export default config;
