import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        oswald: ['Oswald', 'sans-serif'],
        mont: ['Montserrat', 'sans-serif'],
      },
    },
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      white: 'rgb(255,255,255)',
      black: 'rgb(0,0,0)',
      blue: 'rgb(39,100,217)',
      darkBlue: 'rgb(39,32,71)',
      almostBlack: 'rgb(54,54,54)',
      gray: 'rgb(176,176,176)',
      lightGray: 'rgb(245,245,245)',
    },
  },
  plugins: [],
};
export default config;
