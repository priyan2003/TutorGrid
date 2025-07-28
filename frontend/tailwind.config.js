/** @type {import('tailwindcss').Config} */
export const content = [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
];
export const theme = {
    extend: {
        fontSize: {
            'course-details-heading-small': ['26px', '36px'],
            'course-details-heading-large': ['32px', '44px'],
            'home-heading-small': ['28px', '34px'],
            'home-heading-large': ['48px', '56px'],
            default: ['16px', '21px'],
        },
        gridTemplateColumns: {
            'auto': 'repeat(auto-fit, minmax(200px, 1fr))',
        },
    },
};
export const plugins = [];
