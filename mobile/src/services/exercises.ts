import { request } from '@/services/api';
import type { CreateExerciseInput, Exercise } from '@/types/api';

export const exercisesService = {
  list: () => request<Exercise[]>('/exercises'),
  create: (input: CreateExerciseInput) => request<Exercise>('/exercises', { method: 'POST', body: input })
};
