/** @type {import('tailwindcss').Config} */
const { nextui } = require("@nextui-org/react");
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    screens: {
      xxs: "375px",
      xs: "540px",
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px',
    },
    fontFamily: {
      sans: ['var(--font-lato)'],
    },
    container: {
      center: true,
      padding: {
        DEFAULT: '12px',
        sm: '1rem',
        lg: '45px',
        xl: '5rem',
        '2xl': '13rem',
      },

    },
    extend: {
      colors: {
        'dark': '#3c4858',
        'black': '#161c2d',
        'dark-footer': '#192132',
        'logo-golden': "#eabf4e",
      },

      boxShadow: {
        sm: '0 2px 4px 0 rgb(60 72 88 / 0.15)',
        DEFAULT: '0 0 3px rgb(60 72 88 / 0.15)',
        md: '0 5px 13px rgb(60 72 88 / 0.20)',
        lg: '0 10px 25px -3px rgb(60 72 88 / 0.15)',
        xl: '0 20px 25px -5px rgb(60 72 88 / 0.1), 0 8px 10px -6px rgb(60 72 88 / 0.1)',
        '2xl': '0 25px 50px -12px rgb(60 72 88 / 0.25)',
        inner: 'inset 0 2px 4px 0 rgb(60 72 88 / 0.05)',
        testi: '2px 2px 2px -1px rgb(60 72 88 / 0.15)',
      },

      spacing: {
        0.75: '0.1875rem',
        3.25: '0.8125rem'
      },
      zIndex: {
        1: '1',
        2: '2',
        3: '3',
        999: '999',
      },
    },
  },
  darkMode: "class",
  plugins: [nextui({
    themes: {
      light: {
        colors: {
          background: "#FFFFFF", // or DEFAULT
          foreground: "#11181C", // or 50 to 900 DEFAULT
          secondary: {
            //... 50 to 900
            foreground: "#FFFFFF",
            DEFAULT: "#E8713C",
          },
          primary: {
            //... 50 to 900
            foreground: "#FFFFFF",
            DEFAULT: "#05686E",
          },
          // ... rest of the colors
        },
      }
    }
  })],
}
