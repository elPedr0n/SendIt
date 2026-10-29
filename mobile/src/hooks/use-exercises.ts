import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { exercisesService } from '@/services/exercises';
import type { CreateExerciseInput } from '@/types/api';

const exercisesKey = ['exercises'] as const;

// O catálogo é pequeno: carrega tudo e filtra no aparelho (busca instantânea).
export function useExercises() {
  return useQuery({ queryKey: exercisesKey, queryFn: exercisesService.list });
}

export function useCreateExercise() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateExerciseInput) => exercisesService.create(input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: exercisesKey })
  });
}
