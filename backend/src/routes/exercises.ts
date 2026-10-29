import { Router } from 'express';
import { prisma } from '../lib/prisma.js';
import { asyncHandler } from '../lib/http.js';
import { createExerciseSchema, listExercisesQuerySchema } from '../schemas/exercise.js';

export const exercisesRouter = Router();

exercisesRouter.get(
  '/',
  asyncHandler(async (req, res) => {
    const { category, q } = listExercisesQuerySchema.parse(req.query);
    const exercises = await prisma.exerciseDict.findMany({
      where: {
        ...(category ? { category } : {}),
        ...(q ? { name: { contains: q, mode: 'insensitive' as const } } : {})
      },
      orderBy: [{ category: 'asc' }, { name: 'asc' }]
    });
    res.json(exercises);
  })
);

exercisesRouter.post(
  '/',
  asyncHandler(async (req, res) => {
    const data = createExerciseSchema.parse(req.body);
    const exercise = await prisma.exerciseDict.create({ data: { ...data, isCustom: true } });
    res.status(201).json(exercise);
  })
);
