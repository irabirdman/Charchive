import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  safelist: [
    // Gradient colors for form sections
    'from-blue-700/80', 'to-blue-600/60', 'hover:from-blue-700', 'hover:to-blue-600/80',
    'from-purple-700/80', 'to-purple-600/60', 'hover:from-purple-700', 'hover:to-purple-600/80',
    'from-green-700/80', 'to-green-600/60', 'hover:from-green-700', 'hover:to-green-600/80',
    'from-cyan-700/80', 'to-cyan-600/60', 'hover:from-cyan-700', 'hover:to-cyan-600/80',
    'from-pink-700/80', 'to-pink-600/60', 'hover:from-pink-700', 'hover:to-pink-600/80',
    'from-orange-700/80', 'to-orange-600/60', 'hover:from-orange-700', 'hover:to-orange-600/80',
    'from-indigo-700/80', 'to-indigo-600/60', 'hover:from-indigo-700', 'hover:to-indigo-600/80',
    'from-teal-700/80', 'to-teal-600/60', 'hover:from-teal-700', 'hover:to-teal-600/80',
    'from-gray-700/80', 'to-gray-600/60', 'hover:from-gray-700', 'hover:to-gray-600/80',
    'from-yellow-700/80', 'to-yellow-600/60', 'hover:from-yellow-700', 'hover:to-yellow-600/80',
    'from-sky-700/80', 'to-sky-600/60', 'hover:from-sky-700', 'hover:to-sky-600/80',
    'from-fuchsia-700/80', 'to-fuchsia-600/60', 'hover:from-fuchsia-700', 'hover:to-fuchsia-600/80',
    'from-lime-700/80', 'to-lime-600/60', 'hover:from-lime-700', 'hover:to-lime-600/80',
    'from-emerald-700/80', 'to-emerald-600/60', 'hover:from-emerald-700', 'hover:to-emerald-600/80',
    'from-violet-700/80', 'to-violet-600/60', 'hover:from-violet-700', 'hover:to-violet-600/80',
    'from-amber-700/80', 'to-amber-600/60', 'hover:from-amber-700', 'hover:to-amber-600/80',
    'from-slate-700/80', 'to-slate-600/60', 'hover:from-slate-700', 'hover:to-slate-600/80',
    'from-rose-700/80', 'to-rose-600/60', 'hover:from-rose-700', 'hover:to-rose-600/80',
    'from-red-700/80', 'to-red-600/60', 'hover:from-red-700', 'hover:to-red-600/80',
    // Border colors
    'border-blue-500/50', 'border-purple-500/50', 'border-green-500/50', 'border-cyan-500/50',
    'border-pink-500/50', 'border-orange-500/50', 'border-indigo-500/50', 'border-teal-500/50',
    'border-gray-500/50', 'border-yellow-500/50', 'border-sky-500/50', 'border-fuchsia-500/50',
    'border-lime-500/50', 'border-emerald-500/50', 'border-violet-500/50', 'border-amber-500/50',
    'border-slate-500/50', 'border-rose-500/50', 'border-red-500/50',
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
}
export default config
