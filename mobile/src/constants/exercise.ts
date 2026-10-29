// Espelho de backend/src/schemas/exercise.ts.
export const EXERCISE_CATEGORIES = [
  'Peito',
  'Costas',
  'Pernas',
  'Ombros',
  'Braços',
  'Core',
  'Escalada',
  'Cardio'
] as const;

export type ExerciseCategory = (typeof EXERCISE_CATEGORIES)[number];

export const TRACKING_TYPES = [
  { id: 'reps_weight', label: 'Reps + peso', hint: 'Séries, repetições e kg · conta para 1RM e PR' },
  { id: 'time', label: 'Tempo', hint: 'Prancha, escalada, alongamento' },
  { id: 'distance', label: 'Distância', hint: 'Corrida, remo, natação' }
] as const;

export type TrackingType = (typeof TRACKING_TYPES)[number]['id'];

export function trackingTypeLabel(id: TrackingType): string {
  return TRACKING_TYPES.find((t) => t.id === id)?.label ?? id;
}
