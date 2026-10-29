import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { usersService } from '@/services/users';
import { useSession } from '@/providers/session-provider';
import type { CreateUserInput, UpdateUserInput } from '@/types/api';

const userKey = (id: string | null) => ['user', id] as const;

export function useCurrentUser() {
  const { userId } = useSession();
  return useQuery({
    queryKey: userKey(userId),
    queryFn: () => usersService.get(userId!),
    enabled: !!userId
  });
}

export function useCreateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateUserInput) => usersService.create(input),
    onSuccess: (user) => queryClient.setQueryData(userKey(user.id), user)
  });
}

export function useUpdateUser() {
  const { userId } = useSession();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: UpdateUserInput) => usersService.update(userId!, input),
    onSuccess: (user) => queryClient.setQueryData(userKey(user.id), user)
  });
}
