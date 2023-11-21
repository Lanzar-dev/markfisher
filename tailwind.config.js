/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,tsx,ts}"],
  theme: {
    extend: {
      screens: {
        xs: "20px", // Adjust the value based on your needs
        sm: "600px",
      },
      colors: {
        biyaBlue: "#002855",
        biyaBlack: "#2e2e2e",
        biyaGray: "#828282",
        inputBorder: "#dfe6ec",
        inputBg: "#f8fbfd",
        biyaLightBlue: "#4fadea",
        sideFormBg: "#f8fbfd",
        sideFormBorder: "#dfe6ec",
        biyaCircle: "rgba(4, 157, 254, 0.1)",
        lightBlack: "rgba(0, 0, 0, 0.5)",
        white2: "#f4f7fa",
        biyaRed: "#e72f3d",
        tabCol1: "#212b36",
        white3: "#e6f5ff",
      },
      boxShadow: {
        "form-bx-sh": "0px 4px 4px 0px rgba(0, 0, 0, 0.25)",
      },
    },
  },
  plugins: [],
};
