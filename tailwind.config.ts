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
      colors: {},
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
