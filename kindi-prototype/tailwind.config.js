/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1A1E23',
        secondary: '#2A2F36',
        accent: '#3E7BFA',
        success: '#2ECC71',
        warning: '#F39C12',
        error: '#E74C3C',
        neutral: {
          dark: '#8A9199',
          medium: '#C4C9D4',
          light: '#E1E5EB',
        },
        'background-primary': 'var(--background-primary)',
        'background-secondary': 'var(--background-secondary)',
        'background-tertiary': 'var(--background-tertiary)',
        'text-primary': 'var(--text-primary)',
        'text-secondary': 'var(--text-secondary)',
        'text-tertiary': 'var(--text-tertiary)',
        'border-color': 'var(--border-color)',
      },
      fontFamily: {
        primary: ['Inter', 'sans-serif'],
        secondary: ['Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      fontSize: {
        'h1': '24px',
        'h2': '20px',
        'h3': '16px',
        'body': '14px',
        'small': '12px',
      },
      lineHeight: {
        'h1': '1.2',
        'h2': '1.25',
        'h3': '1.3',
        'body': '1.5',
        'small': '1.4',
      },
      spacing: {
        '4': '4px',
        '8': '8px',
        '16': '16px',
        '24': '24px',
        '32': '32px',
        '48': '48px',
        '64': '64px',
      },
    },
  },
  plugins: [],
}
