/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        primary: "rgba(var(--primary-color), <alpha-value>)",
        secondary: "rgba(var(--secondary-color), <alpha-value>)",
        accent: "rgba(var(--accent-color), <alpha-value>)",
        primaryText: "rgba(var(--primary-text-color), <alpha-value>)",
        secondaryText: "rgba(var(--secondary-text-color), <alpha-value>)",
        backgroundColor: "rgba(var(--background-color), <alpha-value>)",
        cardBackgroundColor: "rgba(var(--card-background-color), <alpha-value>)",
        borderColor: "rgba(var(--border-color), <alpha-value>)",
        hoverColor: "rgba(var(--hover-color), <alpha-value>)",
        selectedColor: "rgba(var(--selected-color), <alpha-value>)",
        disabledColor: "rgba(var(--disabled-color), <alpha-value>)",
        errorColor: "rgba(var(--error-color), <alpha-value>)",
        successColor: "rgba(var(--success-color), <alpha-value>)",
        warningColor: "rgba(var(--warning-color), <alpha-value>)",
        infoColor: "rgba(var(--info-color), <alpha-value>)",
      },
      fontFamily: {
        lato: ["Lato", "sans-serif"],
        montserrat: ["Montserrat", "sans-serif"],
        robotoCondensed: ["Roboto Condensed", "sans-serif"],
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}