/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,tsx,ts}"],
  theme: {
    extend: {
      screens: {
        xs: "20px", // Adjust the value based on your needs
      },
      colors: {
        biyaBlue: "#002855",
        biyaBlack: "#2e2e2e",
        biyaGray: "#828282",
        inputBorder: "#dfe6ec",
        inputBg: "#f8fbfd",
        biyaLightBlue: "#4fadea",
      },
      boxShadow: {
        "form-bx-sh": "0px 4px 4px 0px rgba(0, 0, 0, 0.25)",
      },
    },
  },
  plugins: [],
};
