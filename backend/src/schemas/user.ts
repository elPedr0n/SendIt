import { z } from 'zod';

const bodyweightKg = z.number().min(30).max(300);
const weeklyGoal = z.number().int().min(1).max(7);

export const userIdParamsSchema = z.object({ id: z.string().min(1) });

export const createUserSchema = z.object({
  name: z.string().trim().min(1).max(60),
  bodyweightKg: bodyweightKg.optional(),
  weeklyGoal: weeklyGoal.optional()
});

export const updateUserSchema = z
  .object({
    name: z.string().trim().min(1).max(60),
    bodyweightKg: bodyweightKg.nullable(),
    weeklyGoal
  })
  .partial()
  .refine((data) => Object.keys(data).length > 0, { message: 'Nenhum campo para atualizar' });

export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
