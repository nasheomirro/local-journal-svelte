/** @type {import('tailwindcss').Config} */
const colors = require('tailwindcss/colors');

module.exports = {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	darkMode: 'class',
	theme: {
		colors: {
			transparent: colors.transparent,
			orange: colors.orange,
			red: colors.red,
			stone: colors.stone,
			black: colors.black,
			white: colors.white
		},
		screens: {
			xs: '420px',
			sm: '640px',
			md: '768px',
			lg: '1024px'
		}
	},
	plugins: [require('tailwind-scrollbar')]
};
