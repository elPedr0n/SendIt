import { request } from '@/services/api';
import type { CreateUserInput, UpdateUserInput, User } from '@/types/api';

export const usersService = {
  create: (input: CreateUserInput) => request<User>('/users', { method: 'POST', body: input }),
  get: (id: string) => request<User>(`/users/${id}`),
  update: (id: string, input: UpdateUserInput) => request<User>(`/users/${id}`, { method: 'PATCH', body: input })
};
