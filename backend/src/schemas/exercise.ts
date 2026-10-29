import { z } from 'zod';

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

export const TRACKING_TYPES = ['reps_weight', 'time', 'distance'] as const;

export const createExerciseSchema = z.object({
  name: z.string().trim().min(1).max(60),
  category: z.enum(EXERCISE_CATEGORIES),
  trackingType: z.enum(TRACKING_TYPES).default('reps_weight')
});

export const listExercisesQuerySchema = z.object({
  category: z.enum(EXERCISE_CATEGORIES).optional(),
  q: z.string().trim().max(60).optional()
});

export type CreateExerciseInput = z.infer<typeof createExerciseSchema>;
