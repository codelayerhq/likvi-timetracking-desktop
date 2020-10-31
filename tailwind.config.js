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
        "hover:bg-brand-secondary-light",
        "bg-brand-secondary",
        "focus:border-brand-secondary-dark",
        "active:bg-brand-secondary-dark",
        "focus:shadow-outline-brand-secondary-dark",
      ],
    },
  },
  theme: {
    extend: {
      colors: {
        brand: "#F24C27",
        "brand-light": "#F56F52",
        "brand-dark": "#D8320D",
        "brand-secondary": "#030140",
        "brand-secondary-light": "#0F0D5D",
        "brand-secondary-dark": "#03022D",
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
