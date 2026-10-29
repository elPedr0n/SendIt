import express, { Request, Response } from 'express';
import cors from 'cors';
import { prisma } from './lib/prisma.js';
import { usersRouter } from './routes/users.js';
import { exercisesRouter } from './routes/exercises.js';
import { errorHandler, notFoundHandler } from './middleware/error-handler.js';

export const app = express();

app.use(cors());
app.use(express.json());

app.get('/health', async (_req: Request, res: Response) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({
      status: 'ok',
      app: 'SendIt API',
      database: 'connected',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      app: 'SendIt API',
      database: 'disconnected',
      error: String(error),
      timestamp: new Date().toISOString()
    });
  }
});

app.use('/users', usersRouter);
app.use('/exercises', exercisesRouter);

app.use(notFoundHandler);
app.use(errorHandler);
