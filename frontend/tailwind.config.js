/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#4F46E5",
        secondary: "#6B7280",
        success: "#10B981",
        danger: "#EF4444",
        warning: "#F59E0B",
        info: "#3B82F6",
      },
    },
  },
  plugins: [],
};
