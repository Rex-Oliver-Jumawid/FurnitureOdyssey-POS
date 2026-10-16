import type { Config } from "tailwindcss";

/* Relative RGB keeps alpha utilities (bg-primary/10, border-primary/30)
 * linked to the same hex palette used by the marketing site.
 */
const color = (token: string) => `rgb(from var(--${token}) r g b / <alpha-value>)`;

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        background: color("background"),
        foreground: color("foreground"),
        muted: color("surface-muted"),
        "muted-foreground": color("muted-foreground"),
        border: color("border"),
        panel: color("panel"),
        primary: color("primary"),
        "primary-foreground": color("primary-foreground"),
        accent: color("accent"),
        "accent-foreground": color("accent-foreground"),
        "soft-accent": color("soft-accent"),
        success: color("success"),
        warning: color("warning"),
        danger: color("danger")
      },
      boxShadow: {
        line: "inset 0 -1px 0 var(--border)"
      }
    }
  },
  plugins: []
};

export default config;
