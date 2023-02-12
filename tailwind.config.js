const withMT = require("@material-tailwind/react/utils/withMT");

module.exports = withMT({
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        marker: ["PermanentMarker", "sans-serif"],
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
});
