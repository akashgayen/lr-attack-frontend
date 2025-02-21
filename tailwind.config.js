/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      backgroundImage: {
        "custom-img": "url('https://www.mdpi.com/energies/energies-12-00725/article_deploy/html/images/energies-12-00725-g001-550.jpg')",
      }
    },
  },
  plugins: [],
};
