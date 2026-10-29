import { Router } from 'express';
import { prisma } from '../lib/prisma.js';
import { asyncHandler, HttpError } from '../lib/http.js';
import { createUserSchema, updateUserSchema, userIdParamsSchema } from '../schemas/user.js';

export const usersRouter = Router();

usersRouter.post(
  '/',
  asyncHandler(async (req, res) => {
    const data = createUserSchema.parse(req.body);
    const user = await prisma.user.create({ data });
    res.status(201).json(user);
  })
);

usersRouter.get(
  '/:id',
  asyncHandler(async (req, res) => {
    const { id } = userIdParamsSchema.parse(req.params);
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) throw new HttpError(404, 'not_found', 'Usuário não encontrado');
    res.json(user);
  })
);

usersRouter.patch(
  '/:id',
  asyncHandler(async (req, res) => {
    const { id } = userIdParamsSchema.parse(req.params);
    const data = updateUserSchema.parse(req.body);
    const user = await prisma.user.update({ where: { id }, data });
    res.json(user);
  })
);
