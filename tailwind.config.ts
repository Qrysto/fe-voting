import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {},
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
    },
    container: {
      center: true,
      padding: '1rem',
    },
  },
  plugins: [],
};
export default config;
