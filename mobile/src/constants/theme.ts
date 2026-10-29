// Espelho de design/tokens.json para valores usados fora do className
// (props de navegação, placeholderTextColor, gradientes). Mantenha em sincronia.
export const colors = {
  bg: '#0A0D12',
  surface: '#151B23',
  surface2: '#1E2530',
  tabBar: '#0F141B',
  border: '#2E3744',
  text: '#F1F5F9',
  textSoft: '#C9D1DC',
  muted: '#9AA4B2',
  subtle: '#6B7586',
  accent: '#22D37A',
  accentSoft: '#4ADE95',
  accentInk: '#062814',
  accentTint: '#10301F',
  danger: '#EF4444'
} as const;

export type TierKey = 'cobre' | 'bronze' | 'prata' | 'ouro' | 'platina' | 'diamante' | 'esmeralda' | 'mestre';

export const tiers: Record<TierKey, { label: string; text: string; ink: string; gradient: [string, string, string] }> = {
  cobre: { label: 'Cobre', text: '#D2734A', ink: '#2A1006', gradient: ['#E08A5C', '#B5562E', '#7A3417'] },
  bronze: { label: 'Bronze', text: '#D9A962', ink: '#2E1D06', gradient: ['#F0CB8E', '#C9924A', '#8A5E25'] },
  prata: { label: 'Prata', text: '#C7CED8', ink: '#1F2630', gradient: ['#F4F6F9', '#C7CED8', '#8C96A3'] },
  ouro: { label: 'Ouro', text: '#F2C230', ink: '#3A2A00', gradient: ['#FFF0B3', '#F2C230', '#B8860B'] },
  platina: { label: 'Platina', text: '#7FD6CF', ink: '#0B2E2B', gradient: ['#E3FBF8', '#7FD6CF', '#3E9A93'] },
  diamante: { label: 'Diamante', text: '#7CB8FF', ink: '#0B2147', gradient: ['#E0F0FF', '#7CB8FF', '#3B74C9'] },
  esmeralda: { label: 'Esmeralda', text: '#34D399', ink: '#03291D', gradient: ['#A7F3D0', '#12B886', '#06664A'] },
  mestre: { label: 'Mestre', text: '#B794F6', ink: '#24104F', gradient: ['#E9DDFF', '#B794F6', '#6B46C1'] }
};

export const TIER_ORDER: TierKey[] = ['cobre', 'bronze', 'prata', 'ouro', 'platina', 'diamante', 'esmeralda', 'mestre'];

export function tierGradient(key: TierKey): string {
  const [light, base, dark] = tiers[key].gradient;
  return `linear-gradient(135deg, ${light} 0%, ${base} 45%, ${dark} 80%, ${light} 100%)`;
}
