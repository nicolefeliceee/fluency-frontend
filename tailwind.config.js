/** @type {import('tailwindcss').Config} */

module.exports = {
  content: [
    "./src/**/*.{html,js}",
    'node_modules/preline/dist/*.js'
  ],
  theme: {
    fontFamily: {
      sans: ["Poppins", "sans-serif"],
      serif: ["Lora", "serif"]
    },
    extend: {
      colors: {
        background: 'rgb(var(--color-background))',
        blue: {
          100: 'rgb(var(--color-blue-100))',
          80: 'rgb(var(--color-blue-80))',
          60: 'rgb(var(--color-blue-60))'
        },
        yellow: {
          80: 'rgb(var(--color-yellow-80))',
          60: 'rgb(var(--color-yellow-60))'
        },
        primary: {
          red: 'rgb(var(--color-primary-red))',
          green: 'rgb(var(--color-primary-green))'
        },
        font: {
          black: 'rgb(var(--color-font-black))',
          darkGrey: 'rgb(var(--color-font-dark-grey))',
          lightGrey: 'rgb(var(--color-font-light-grey))',
          white: 'rgb(var(--color-font-white))'
        },
        colorful: {
          pink: 'rgb(var(--color-colorful-pink))',
          blue: 'rgb(var(--color-colorful-blue))',
          green: 'rgb(var(--color-colorful-green))',
          orange: 'rgb(var(--color-colorful-orange))',
          purple: 'rgb(var(--color-colorful-purple))',
          red: 'rgb(var(--color-colorful-red))'
        },
        pastel: {
          1: 'rgb(var(--color-pastel-1))',
          2: 'rgb(var(--color-pastel-2))',
          3: 'rgb(var(--color-pastel-3))',
          4: 'rgb(var(--color-pastel-4))',
          5: 'rgb(var(--color-pastel-5))',
          6: 'rgb(var(--color-pastel-6))',
          7: 'rgb(var(--color-pastel-7))',
          8: 'rgb(var(--color-pastel-8))',
          9: 'rgb(var(--color-pastel-9))',
          10: 'rgb(var(--color-pastel-10))',
          11: 'rgb(var(--color-pastel-11))',
          12: 'rgb(var(--color-pastel-12))',
        }
      }
    },
    fontSize: {
      'title': '3.6rem',
      'header1': '2.3rem',
      'header2': '1.8rem',
      'header3': '1.4rem',
      'header4': '1.15rem',
      'header5': '1rem',
      'header6': '0.9rem',
      'body': '0.9rem',
      'smalltext': '0.7rem'
    }
  },
  plugins: [
    require('preline/plugin'),
  ],
}

