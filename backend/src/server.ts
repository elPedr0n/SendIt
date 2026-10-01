import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { prisma } from './lib/prisma.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

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

app.listen(PORT, () => {
  console.log(`[SendIt API] Server is running on http://localhost:${PORT}`);
});

