module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        myred: {
          dark: "#A30000"
        },
        myorange: {
          DEFAULT: "#F36B1C"
        },
        myblue: {
          darkest: "#0E1C36",
          dark: "#18366A",
          DEFAULT: "#1F4587",
          light: "#98D2EB",
          lightest: "#BCDDF5"
        }
      }
    },
  },
  plugins: [],
}
