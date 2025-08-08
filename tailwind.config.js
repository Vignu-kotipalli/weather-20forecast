/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}", "./src/**/*.html", "./src/**/*.ts"],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          "Inter",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
      },
      colors: {
        weather: {
          clear: "#3B82F6",
          clouds: "#6B7280",
          rain: "#4B5563",
          thunderstorm: "#1F2937",
          snow: "#E5E7EB",
          mist: "#9CA3AF",
        },
      },
      animation: {
        "fade-in": "fadeIn 0.6s ease-out",
        "slide-up": "slideUp 0.6s ease-out",
        "slide-in": "slideIn 0.4s ease-out",
        "bounce-slow": "bounceSlow 3s ease-in-out infinite",
        "pulse-slow": "pulse 3s ease-in-out infinite",
      },
      backdropBlur: {
        xs: "2px",
        sm: "4px",
        md: "12px",
        lg: "16px",
        xl: "24px",
      },
      boxShadow: {
        glass: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
        "glass-sm": "0 2px 16px 0 rgba(31, 38, 135, 0.37)",
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
