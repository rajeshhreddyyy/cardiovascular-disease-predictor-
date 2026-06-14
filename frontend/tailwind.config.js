/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      boxShadow: {
        soft: "0 18px 45px rgba(2,6,23,0.10)"
      },
      backgroundImage: {
        glow: "radial-gradient(closest-side at 20% 20%, rgba(99,102,241,0.25), rgba(99,102,241,0) 60%)"
      },
      keyframes: {
        "ecg-slide": {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" }
        },
        "pulse-ripple": {
          "0%": { transform: "scale(0.9)", opacity: "0.35" },
          "70%": { transform: "scale(1.25)", opacity: "0" },
          "100%": { transform: "scale(1.25)", opacity: "0" }
        },
        "scan-line": {
          "0%": { transform: "translateX(-120%)", opacity: "0" },
          "20%": { opacity: "0.7" },
          "100%": { transform: "translateX(130%)", opacity: "0" }
        },
        "ai-gradient": {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" }
        }
      },
      animation: {
        "ecg-slide": "ecg-slide 8s linear infinite",
        "pulse-ripple": "pulse-ripple 2.6s ease-out infinite",
        "scan-line": "scan-line 1.5s ease-in-out infinite",
        "ai-gradient": "ai-gradient 12s ease-in-out infinite"
      }
    }
  },
  plugins: []
};

