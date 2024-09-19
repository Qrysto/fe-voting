import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      white: 'rgb(255, 255, 255)',
      black: 'rgb(0, 0, 0)',
      lightBlue: 'rgb(233, 239, 251)',
      blue: 'rgb(39, 100, 217)',
      darkBlue: 'rgb(39, 32, 71)',
      almostBlack: 'rgb(54, 54, 54)',
      gray: 'rgb(176, 176, 176)',
      lightGray: 'rgb(245, 245, 245)',
      almostWhite: 'rgb(250, 250, 250)',
      lighterGreen: 'rgb(229, 250, 213)',
      lightGreen: 'rgb(104, 245, 39)',
      green: 'rgb(95, 216, 38)',
      red: 'rgb(188, 2, 25)',
      orange: 'rgb(254, 166, 33)',
      purple: 'rgb(128, 0, 128)',
      brown: 'rgb(139,69,19)',
    },
    container: {
      center: true,
      padding: '1rem',
    },
  },
  plugins: [require('tailwindcss-animate')],
};
export default config;
