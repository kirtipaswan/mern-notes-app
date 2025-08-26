/** @type {import('tailwindcss').Config} */
export default {
  content: ["index.html", "./src/**/*.{js,jsx,ts,tsx}", "./src/**/*.{html,js}"],
  theme: {
    extend: {
      colors: {
        // Primary: A calming blue or modern purple for key actions/branding
        primary: "#4F46E5", // A deep, inviting indigo
        'primary-dark': "#4338CA", // Slightly darker for hover states
        'primary-light': "#C7D2FE", // A very light shade for subtle accents

        // Secondary: A complementary accent color (e.g., for tags or special elements)
        secondary: "#EF863E", // Your existing orange - can keep or adjust

        // Neutrals: Crucial for readability and overall calm
        'background-light': "#F8FAFC", // A very subtle off-white for the main page background (lighter than f5f7fa)
        'text-dark': "#1F2937", // Dark gray for primary text
        'text-muted': "#6B7280", // Lighter gray for secondary text/dates
        'border-light': "#E5E7EB", // Light gray for borders
      },
      // Animations (already discussed, but reiterating its importance for interactivity)
      keyframes: {
        fadeIn: {
          '0%': { opacity: 0, transform: 'translateY(10px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        pulse: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: .5 },
        },
      },
      animation: {
        fadeIn: 'fadeIn 0.5s ease-out forwards',
        pulse: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
};
