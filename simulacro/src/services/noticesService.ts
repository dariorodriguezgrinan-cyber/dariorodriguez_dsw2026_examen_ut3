import { randomUUID } from 'node:crypto';
import { ResourceNotFoundError } from '../errors/ResourceNotFoundError.js';

export interface Notice {
  id: string;
  title: string;
  description: string;
  createdAt: string;
}

// Campos opcionales que pueden llegar en una modificación parcial (PATCH)
export interface NoticeChanges {
  title?: string;
  description?: string;
}

// Array privado en memoria con 5 avisos iniciales
const notices: Notice[] = [
  {
    id: 'aaaa1111-1111-4111-8111-111111111111',
    title: 'Apertura de matrícula ordinaria',
    description: 'El plazo de matrícula estará abierto del 1 al 15 de julio.',
    createdAt: '2026-09-01T08:00:00.000Z',
  },
  {
    id: 'bbbb2222-2222-4222-8222-222222222222',
    title: 'Documentación requerida para matrícula',
    description: 'Es obligatorio aportar DNI y certificado académico.',
    createdAt: '2026-09-02T09:00:00.000Z',
  },
  {
    id: 'cccc3333-3333-4333-8333-333333333333',
    title: 'Plazo extraordinario de matrícula',
    description: 'Dirigido al alumnado con materias pendientes en septiembre.',
    createdAt: '2026-09-03T10:00:00.000Z',
  },
  {
    id: 'dddd4444-4444-4444-8444-444444444444',
    title: 'Calendario de exámenes finales',
    description: 'Publicadas las fechas de evaluación ordinaria en secretaría.',
    createdAt: '2026-09-04T11:00:00.000Z',
  },
  {
    id: 'eeee5555-5555-4555-8555-555555555555',
    title: 'Reunión informativa de inicio de curso',
    description: 'Bienvenida al alumnado en el salón de actos a las 10:00.',
    createdAt: '2026-09-05T12:00:00.000Z',
  },
];

// Lista los avisos aplicando filtro opcional por título y paginación
export function list(page: number, limit: number, search?: string) {
  let result = notices;

  // Si se recibió un término de búsqueda no vacío, filtramos por título
  if (search && search.trim() !== '') {
    const term = search.trim().toLowerCase();
    result = notices.filter((notice) =>
      notice.title.toLowerCase().includes(term),
    );
  }

  const start = (page - 1) * limit;

  return {
    data: result.slice(start, start + limit),
    pagination: {
      page,
      limit,
      total: result.length,
    },
  };
}

// Busca un aviso por su id; devuelve undefined si no existe
export function getById(id: string): Notice | undefined {
  return notices.find((notice) => notice.id === id);
}

// Crea un aviso nuevo con id y fecha automáticos y lo guarda en el array
export function create(title: string, description: string): Notice {
  const notice: Notice = {
    id: randomUUID(),
    title,
    description,
    createdAt: new Date().toISOString(),
  };

  notices.push(notice);

  return notice;
}

// Modifica parcialmente un aviso existente según los campos recibidos en changes
export function update(
  id: string,
  changes: NoticeChanges,
): Notice {
  const notice = getById(id);

  // Si el aviso no existe, lanzamos el ResourceNotFoundError con sus parametros del constructor
  if (!notice) {
    throw new ResourceNotFoundError (404, "El aviso no existe", id);
  }

  // Solo actualizamos title si viene definido en changes
  if (changes.title !== undefined) {
    notice.title = changes.title;
  }

  // Solo actualizamos description si viene definido en changes
  if (changes.description !== undefined) {
    notice.description = changes.description;
  }

  return notice;
}