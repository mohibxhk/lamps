/** @type {import('tailwindcss').Config} */
module.exports = {
    blocklist: ["overline"],
    darkMode: ["class"],
    content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      fontFamily: {
        // Apple (apple.com) typography stack — SF Pro on Apple devices,
        // Helvetica Neue / Arial elsewhere, exactly as apple.com behaves.
        serif: ['"SF Pro Display"', '-apple-system', 'BlinkMacSystemFont', '"Helvetica Neue"', 'Helvetica', 'Arial', 'sans-serif'],
        sans: ['"SF Pro Text"', '-apple-system', 'BlinkMacSystemFont', '"Helvetica Neue"', 'Helvetica', 'Arial', 'sans-serif'],
        mono: ['"SF Pro Text"', '-apple-system', 'BlinkMacSystemFont', '"Helvetica Neue"', 'Helvetica', 'Arial', 'sans-serif'],
      },
      colors: {
        paper: '#F8F8F6',
        stone: '#EFEFEA',
        canvas: '#EAEAE5',
        ink: '#111110',
        soot: '#333330',
        mute: '#666660',
        line: '#E2E2DC',
        hairline: '#C8C8C0',
        night: '#121211',
        nightline: '#2A2A28',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)'
      },
      keyframes: {
        'accordion-down': { from: { height: '0' }, to: { height: 'var(--radix-accordion-content-height)' } },
        'accordion-up': { from: { height: 'var(--radix-accordion-content-height)' }, to: { height: '0' } },
        marquee: { from: { transform: 'translateX(0)' }, to: { transform: 'translateX(-50%)' } },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        marquee: 'marquee 38s linear infinite',
      }
    }
  },
  plugins: [require("tailwindcss-animate")],
};
