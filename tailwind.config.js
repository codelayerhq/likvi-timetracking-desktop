module.exports = {
  future: {
    removeDeprecatedGapUtilities: true,
    purgeLayersByDefault: true,
  },
  purge: {
    content: ["./src/**/*.html", "./src/**/*.vue", "./src/**/*.jsx"],
    options: {
      whitelist: [
        "hover:bg-gray-500",
        "bg-gray-600",
        "focus:border-gray-700",
        "active:bg-gray-700",
        "focus:shadow-outline-gray-700",
      ],
    },
  },
  theme: {
    extend: {
      colors: {
        brand: "#F24C27",
        "brand-light": "#F56F52",
        "brand-dark": "#D8320D",
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
