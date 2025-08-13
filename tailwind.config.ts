import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "1rem",
      screens: {
        "2xl": "1400px",
      },
    },
    screens: {
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1180px",
      "2xl": "1536px",
    },
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        tail: {
          a: "hsl(var(--tail-a))",
          b: "hsl(var(--tail-b))",
          c: "hsl(var(--tail-c))",
          d: "hsl(var(--tail-d))",
          e: "hsl(var(--tail-e))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        paragraph: ["var(--paragraph)"],
        heading: ["var(--heading)"],
      },
      fontSize: {
        extra_paragraph_heading: "clamp(20px,2.2vw,24px)",
        our_text_heading: "clamp(28px,2.4vw,36px)",
        pargrpah_heading: "clamp(24px,2.75vw,36px)",
        secondary_heading: "clamp(48px,7.2vw, 74px)",
        tertiary_heading: "clamp(28px, 4.2vw, 58px)",
        subtitle_heading: "clamp(16px,1.8vw,20px)",
        extra_subtitle_heading: "clamp(14px,1.6vw,18px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "slide-in-from-left-52": {
          from: { transform: "translateX(-13rem)" },
          to: { transform: "translateX(0)" },
        },
        "slide-in-from-right-52": {
          from: { transform: "translateX(13rem)", opacity: "0" },
          to: { transform: "translateX(0)", opacity: "1" },
        },
        "slide-out-to-left-52": {
          from: { transform: "translateX(0)", opacity: "1" },
          to: { transform: "translateX(-13rem)", opacity: "0" },
        },
        "slide-out-to-right-52": {
          from: { transform: "translateX(13rem)", opacity: "0" },
          to: { transform: "translateX(0)", opacity: "1" },
        },
        "slide-down": {
          from: { opacity: "0" },
          to: { transform: "1" },
        },
        "slide-up": {
          from: { transform: "1" },
          to: { transform: "0" },
        },
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        "fade-out": {
          from: { opacity: "1" },
          to: { opacity: "0" },
        },
        "rotate-180": {
          from: { transform: "rotate(-180deg)" },
          to: { transform: "rotate(0deg)" },
        },
        "scroll-one": {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(-100%)" },
        },
        backgroundScroll: {
          "0%": { backgroundPosition: "0% center" },
          "100%": { backgroundPosition: "100% center" },
        },
        scrollX: {
          "0%": { backgroundPosition: "0 0" },
          "100%": { backgroundPosition: "100% 0" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-20px)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "slide-in-from-left-52": "slide-in-from-left-52 0.3s ease-out",
        "slide-in-from-right-52": "slide-in-from-right-52 5s ease-out",
        "slide-out-to-left-52": "slide-out-to-left-52 0.3s ease-out",
        "slide-out-to-right-52": "slide-out-to-right-52 0.3s ease-out",
        "slide-down": "slide-down 0.3s ease-out",
        "slide-up": "slide-up 0.3s ease-out",
        "fade-in": "fade-in 0.2s ease-out",
        "fade-out": "fade-out 0.2s ease-out",
        "rotate-180": "rotate-180 200ms linear forwards infinite",
        "background-scroll": "backgroundScroll 4s linear infinite",
        "scroll-one": "scroll 30s linear infinite",
        "scroll-x": "scrollX 10s linear infinite",
        float: "float 3s ease-in-out infinite",
      },
    },
  },
  // plugins: [require("tailwindcss-animate")],
};
export default config;
