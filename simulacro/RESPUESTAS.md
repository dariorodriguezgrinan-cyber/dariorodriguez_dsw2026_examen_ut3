Cómo se instala y arranca tu proyecto.
-Desde la carpeta simulacro/LasDivinasProyecto , instalo las dependencias con npm install y arranco el servidor en modo desarrollo con npm run dev.

Dónde se configura el puerto y cómo llega ese valor hasta el arranque del servidor.
-Se configura en el .env donde pone PORT=. El servidor lee ese valor y lo usa para arrancar.

Por qué se sube a GitHub el .env.example y se excluye .env.
-Porque .env contiene datos importantes para la seguridad y secretos del backend entonces se hace un ejemplo donde contiene los datos del .env pero sin revear los propios.

## Punto 3 — Error personalizado `ResourceNotFoundError`

- **Dónde se crea el error:** En `src/controllers/documentsController.ts` (función `getById`), cuando no se encuentra el documento se lanza `throw new ResourceNotFoundError(...)` (clase definida en `src/errors/ResourceNotFoundError.ts`) y el `catch` lo envía al siguiente middleware con `next(err)`.
- **Dónde se convierte en respuesta HTTP:** En `src/middlewares/errorHandler.ts`, dentro de `if (err instanceof ResourceNotFoundError)`, donde se responde con estado `404` y el JSON `{ message, resourceId }`.
- **Comprobación:** Al pedir `GET /api/v1/admin/documents/1234` devuelve `404` con el JSON esperado y en la consola del servidor no salta ningún error `500`.