module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        myred: {
          dark: "#A30000",
        },
        myorange: {
          DEFAULT: "#F36B1C",
        },
        myblue: {
          darkest: "#0E1C36",
          dark: "#18366A",
          DEFAULT: "#1F4587",
          light: "#98D2EB",
          lightest: "#BCDDF5",
        },
      },
      boxShadow: {
        emerge: "0px 5px 15px rgba(0, 0, 0, 0.35)",
        thin: "0px 1px 2px 0px rgba(60, 64, 67, 0.3), 0px 1px 3px 1px rgba(60, 64, 67, 0.15)",
        DEFAULT: "0px 0px 16px rgba(17, 17, 26, 0.2);",
      },
    },
  },
  plugins: [],
};
