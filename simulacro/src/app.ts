import express from 'express';
import type { Application } from 'express';

import { documentsRouter } from './routes/documents.js'; // ← NUEVO
import { noticesRouter } from './routes/notices.js';
import { healthRouter } from './routes/health.js';
import { questionsRouter } from './routes/questions.js';
import { notFound } from './middlewares/notFound.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { requestId } from './middlewares/requestId.js';
import { logger } from './middlewares/logger.js';

export function createApp(): Application {
  const app = express();

  app.use(requestId);
  app.use(logger);

  app.use(express.json()); // antes de las rutas: si no, req.body es undefined

  // Ruta temporal para probar el error inesperado
app.get('/test-error', (req, res) => {
  throw new Error('Fallo interno de prueba');
});
  app.use('/health', healthRouter);
  app.use('/api/v1/admin/documents', documentsRouter); 
  app.use('/api/v1/questions', questionsRouter);
  app.use('/api/v1/notices', noticesRouter);

  app.use(notFound); // ← NUEVO
  app.use(errorHandler); // ← NUEVO

  return app;
}