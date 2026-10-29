import { NextFunction, Request, Response } from 'express';
import { Prisma } from '@prisma/client';
import { ZodError } from 'zod';
import { HttpError } from '../lib/http.js';

export function notFoundHandler(_req: Request, res: Response) {
  res.status(404).json({ error: { code: 'not_found', message: 'Rota não encontrada' } });
}

export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  if (err instanceof ZodError) {
    const { fieldErrors, formErrors } = err.flatten();
    res.status(400).json({
      error: {
        code: 'validation_error',
        message: formErrors[0] ?? 'Dados inválidos',
        fields: fieldErrors
      }
    });
    return;
  }

  if (err instanceof HttpError) {
    res.status(err.status).json({ error: { code: err.code, message: err.message } });
    return;
  }

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === 'P2025') {
      res.status(404).json({ error: { code: 'not_found', message: 'Registro não encontrado' } });
      return;
    }
    if (err.code === 'P2002') {
      res.status(409).json({ error: { code: 'conflict', message: 'Já existe um registro com esse valor' } });
      return;
    }
  }

  // JSON malformado no body (lançado pelo express.json)
  if (err instanceof SyntaxError && 'body' in err) {
    res.status(400).json({ error: { code: 'invalid_json', message: 'JSON inválido' } });
    return;
  }

  console.error('[SendIt API]', err);
  res.status(500).json({ error: { code: 'internal_error', message: 'Erro interno' } });
}
