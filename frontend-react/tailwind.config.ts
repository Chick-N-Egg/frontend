import type { Config } from 'tailwindcss';

// Palette source of truth: frontend/frontend/map.html's :root custom properties
// (the "lavanda" lilac-on-cream system), NOT the ink/gold naming used in
// prototype/*.html. When porting markup from prototype/, translate by HEX
// VALUE, not suffix position — the two naming schemes don't line up 1:1:
//
//   prototype/    hex        equivalent here
//   --cream       #FBF8FF -> bg
//   --cream2      #F2EFFF -> surface
//   --ink         #120D1E -> text
//   --ink2        #3D3358 -> text2
//   --gold        #7B6FDB -> accent
//   --gold2       #9B91E8 -> accent2
//   --gold3       #C4BCFF -> accent3
//   --gold4       #EAE7FF -> surface2   (NOT accent4! accent4 is #A78BFA, unrelated)
//   --bd          rgba(123,111,219,.22) -> borderTint (new token, no map.html equivalent)
//   --red         #C4401A -> warning
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#fbf8ff',
        surface: '#f2efff',
        surface2: '#eae7ff',
        border: '#dcd6f5',
        borderTint: 'rgba(123,111,219,0.22)',
        accent: '#7b6fdb',
        accent2: '#9b91e8',
        accent3: '#c4bcff',
        accent4: '#a78bfa',
        warning: '#c4401a',
        text: '#120d1e',
        text2: '#3d3358',
        text3: '#8f86ad',
      },
      fontFamily: {
        display: ['"Instrument Serif"', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        mono: ['"SF Mono"', 'Menlo', 'Consolas', 'monospace'],
      },
    },
  },
  plugins: [],
} satisfies Config;
