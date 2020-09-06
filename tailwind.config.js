module.exports = {
  purge: [],
  theme: {
    extend: {
      colors: {
        brand: "#ff5e62",
        "brand-light": "#ff777a",
        "brand-dark": "#ff353a",
      },
      gridTemplateRows: {
        layout: "250px 1fr 80px",
      },
      animation: {
        "slide-in-up": "slide-in-up 0.1s ease-in",
      },
      keyframes: {
        "slide-in-up": {
          "0%": {
            transform: "translate3d(0, 100%, 0)",
            visibility: "visible",
          },
          "100%": {
            transform: "translate3d(0, 0, 0)",
          },
        },
      },
    },
  },
  variants: {},
  plugins: [require("@tailwindcss/custom-forms")],
};
