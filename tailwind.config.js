const { hairlineWidth } = require('nativewind/theme');

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        border: {
          light: 'hsl(46, 21%, 88%)',
          dark: 'hsl(144, 24%, 8%)',
        },
        input: {
          light: 'hsl(46, 21%, 88%)',
          dark: 'hsl(144, 24%, 8%)',
        },
        ring: {
          light: 'hsl(135, 54%, 40%)',
          dark: 'hsl(133, 60%, 44%)',
        },
        background: {
          light: 'hsl(45, 29%, 95%)',
          dark: 'hsl(164, 41%, 5%)',
        },
        foreground: {
          light: 'hsl(141, 61%, 11%)',
          dark: 'hsl(240, 4%, 93%)',
        },
        primary: {
          DEFAULT: 'hsl(135, 54%, 40%)',
          foreground: 'hsl(0, 0%, 100%)',
          dark: 'hsl(133, 60%, 44%)',
          'dark-foreground': 'hsl(164, 41%, 5%)',
        },
        secondary: {
          DEFAULT: 'hsl(42, 56%, 54%)',
          foreground: 'hsl(141, 61%, 11%)',
          'dark-foreground': 'hsl(240, 4%, 93%)',
        },
        muted: {
          DEFAULT: 'hsl(45, 20%, 90%)',
          foreground: 'hsl(120, 7%, 35%)',
          dark: 'hsl(144, 30%, 15%)',
          'dark-foreground': 'hsl(120, 6%, 63%)',
        },
        accent: {
          DEFAULT: 'hsl(161, 31%, 66%)',
          foreground: 'hsl(141, 61%, 11%)',
          dark: 'hsl(166, 40%, 64%)',
          'dark-foreground': 'hsl(164, 41%, 5%)',
        },
        card: {
          DEFAULT: 'hsl(0, 0%, 100%)',
          foreground: 'hsl(141, 61%, 11%)',
          dark: 'hsl(144, 42%, 9%)',
          'dark-foreground': 'hsl(240, 4%, 93%)',
        },
      },
      borderRadius: {
        lg: '16px',
        md: '12px',
        sm: '8px',
      },
      borderWidth: {
        hairline: hairlineWidth(),
      },
    },
  },
  plugins: [],
};
