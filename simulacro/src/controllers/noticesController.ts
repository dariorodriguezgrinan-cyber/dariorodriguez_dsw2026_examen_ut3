import type { Request, Response, NextFunction } from 'express';
import * as noticesService from '../services/noticesService.js';
import { AppError } from '../errors/AppError.js';
import { ResourceNotFoundError } from '../errors/ResourceNotFoundError.js';

// GET /api/v1/notices -> Lista avisos con paginación y filtro opcional (?search= o ?q=)
export function list(req: Request, res: Response, next: NextFunction): void {
  try {
    const page = Number(req.query.page ?? 1);
    const limit = Number(req.query.limit ?? 2);
    const search = typeof req.query.search === 'string' ? req.query.search : undefined;

    // Comprueba que page y limit sean números enteros positivos (1 o más)
    if (
      !Number.isInteger(page) ||
      !Number.isInteger(limit) ||
      page < 1 ||
      limit < 1
    ) {
      throw new AppError(400, 'INVALID_PAGINATION', 'BAD_REQUEST');
    }

    res.status(200).json(noticesService.list(page, limit, search));
  } catch (err) {
    next(err);
  }
}

// GET /api/v1/notices/:noticeId -> Consulta un único aviso por su id
export function getById(req: Request, res: Response, next: NextFunction): void {
  try {
    const notice = noticesService.getById(String(req.params.noticeId));

    // Si el servicio devuelve undefined, el aviso no existe -> error 404
    if (!notice) {
      throw new ResourceNotFoundError(
        404,
        `Notice with id '${req.params.noticeId}' not found`,
        String(req.params.noticeId),
        'RESOURCE_NOT_FOUND',
      );
    }

    res.status(200).json({ data: notice });
  } catch (err) {
    next(err);
  }
}

// POST /api/v1/notices -> Valida los datos recibidos y crea un aviso nuevo
export function create(req: Request, res: Response, next: NextFunction): void {
  try {
    const { title, description } = req.body ?? {};

    // title es obligatorio y no puede estar vacío; description es opcional pero debe ser texto
    if (
      typeof title !== 'string' ||
      title.trim().length === 0 ||
      (description !== undefined && typeof description !== 'string')
    ) {
      throw new AppError(400, 'INVALID_NOTICE', 'BAD_REQUEST');
    }

    const notice = noticesService.create(
      title.trim(),
      description ?? '',
    );

    res.status(201).json({ data: notice });
  } catch (err) {
    next(err);
  }
}

// PATCH /api/v1/notices/:noticeId -> Modifica parcialmente un aviso existente
export function update(req: Request, res: Response, next: NextFunction): void {
  try {
    const { title, description } = req.body ?? {};

    // Si se envía title, debe ser texto no vacío; si se envía description, debe ser texto
    if (
      (title !== undefined &&
        (typeof title !== 'string' || title.trim().length === 0)) ||
      (description !== undefined && typeof description !== 'string')
    ) {
      throw new AppError(400, 'INVALID_NOTICE', 'BAD_REQUEST');
    }

    // Construimos el objeto changes solo con los campos enviados
    const changes = {
      title: title?.trim(),
      description: description?.trim(),
    };

    const notice = noticesService.update(String(req.params.noticeId), changes);

    // Si el servicio devuelve undefined, el id no existía -> error 404
    if (!notice) {
      throw new ResourceNotFoundError(
        404,
        `Notice with id '${req.params.noticeId}' not found`,
        String(req.params.noticeId),
        'RESOURCE_NOT_FOUND',
      );
    }

    res.status(200).json({ data: notice });
  } catch (err) {
    next(err);
  }
}