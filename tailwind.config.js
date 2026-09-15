export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui"],
      },
      colors: {
        ink: "#0b1020",
        accent: "#8b7cff",
        cyan: "#4dd8d2",
      },
      boxShadow: {
        glow: "0 0 60px rgba(139,124,255,.18)",
      },
    },
  },
  plugins: [],
};
