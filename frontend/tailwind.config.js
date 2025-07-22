/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#2563eb', // blue-600
          dark: '#1e40af',   // blue-800
        },
        accent: {
          DEFAULT: '#6366f1', // indigo-500
          dark: '#a21caf',    // purple-700
        },
        background: '#f1f5f9', // slate-100
        surface: '#fff',
        success: '#22c55e',
        danger: '#ef4444',
        text: '#1e293b',
      },
      boxShadow: {
        glass: '0 8px 32px 0 rgba(31, 38, 135, 0.18)',
      },
      backdropBlur: {
        xs: '2px',
      },
      fontFamily: {
        sans: ['Inter', 'Poppins', 'ui-sans-serif', 'system-ui'],
      },
    },
  },
  plugins: [],
}; 