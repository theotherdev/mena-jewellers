/** @type {import('tailwindcss').Config} */
import plugin from 'tailwindcss/plugin'

export default {
  content: [
    './layout/**/*.liquid',
    './sections/**/*.liquid',
    './snippets/**/*.liquid',
    './blocks/**/*.liquid',
    './templates/**/*.{liquid,json}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--color-background)',
        foreground: 'var(--color-foreground)',
      },
      fontFamily: {
        primary: 'var(--font-primary--family)',
      },
      fontSize: {
        'xs': '0.75rem',
        'base': '12px',
      },
      lineHeight: {
        'tight': '114%',
        'normal': '1.5',
      },
      spacing: {
        'page-margin': 'var(--page-margin)',
        '2.5': '10px',
        '5': '20px',
      },
      maxWidth: {
        'page': 'var(--page-width)',
      },
      gap: {
        '2.5': '10px',
        '5': '20px',
      },
    },
  },
  plugins: [
    plugin(function({ addVariant }) {
      addVariant('child', '& > *')
      addVariant('child-hover', '& > *:hover')
    }),
  ],
}
