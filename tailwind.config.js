export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui"],
      },
      colors: {
        ink: "#0b1020",
        accent: "#0C8EFF",
        cyan: "#4dd8d2",
      },
      boxShadow: {
        glow: "0 0 60px rgba(12,142,255,.18)",
      },
    },
  },
  plugins: [],
};
