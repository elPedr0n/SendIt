// Cores e paleta de patentes vêm de design/tokens.json (fonte única do visual).
const tokens = require('../design/tokens.json');

const c = tokens.color;
const tierColors = Object.fromEntries(
  Object.entries(tokens.tier).map(([key, tier]) => [key, { DEFAULT: tier.base, text: tier.text, ink: tier.ink }])
);

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        bg: c.bg,
        surface: { DEFAULT: c.surface, 2: c['surface-2'] },
        tabbar: c['tab-bar'],
        line: c.border,
        ink: { DEFAULT: c.text, soft: c['text-soft'] },
        muted: c.muted,
        subtle: c.subtle,
        accent: { DEFAULT: c.accent, soft: c['accent-soft'], ink: c['accent-ink'], tint: c['accent-tint'] },
        danger: c.danger,
        tier: tierColors
      },
      fontFamily: {
        display: ['BarlowCondensed_700Bold'],
        body: ['Outfit_400Regular'],
        'body-medium': ['Outfit_500Medium'],
        'body-semibold': ['Outfit_600SemiBold'],
        'body-bold': ['Outfit_700Bold']
      },
      borderRadius: {
        card: `${tokens.radius.card}px`,
        button: `${tokens.radius.button}px`,
        control: `${tokens.radius.control}px`
      }
    },
  },
  plugins: [],
}
