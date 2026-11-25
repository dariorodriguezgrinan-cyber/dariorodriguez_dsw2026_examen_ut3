* ## 1. Prepara el proyecto

**Cómo se instala y arranca el proyecto:**
  - Desde la carpeta `simulacro/LasDivinasProyecto`, instalo las dependencias con `npm install` y arranco el servidor en modo desarrollo con `npm run dev`.
* **Dónde se configura el puerto y cómo llega al arranque:**
  - Se configura en el archivo `.env` donde pone `PORT=...`. El servidor lee ese valor y lo usa para arrancar.
* **Por qué se sube `.env.example` y se excluye `.env`:**
  - Porque `.env` contiene datos sensibles y secretos del backend. El `.env.example` sirve de plantilla con la estructura pero sin revelar los datos reales.

  ## 3. Error personalizado `ResourceNotFoundError`

- **Dónde se crea el error:** En `src/controllers/documentsController.ts` (dentro de la función `getById`), cuando no se encuentra el documento (`if (!document)`), se instancia y se lanza mediante `throw new ResourceNotFoundError(...)`.
- **Dónde se convierte en una respuesta HTTP:** En `src/middlewares/errorHandler.ts`, dentro del bloque `if (err instanceof ResourceNotFoundError)`, donde el manejador centralizado captura el error y responde con el estado HTTP `404` y la estructura JSON `{ message, resourceId }`.

## 4. Diferencia entre el recorrido de `ResourceNotFoundError` y un error inesperado (500)

- **Error controlado (`ResourceNotFoundError` / `AppError`):** Es un error **previsto** por la lógica de negocio. Se lanza conscientemente en el controlador (ej. cuando no existe un recurso o falla una validación). Lleva un código HTTP específico (404 o 400) y una estructura limpia y directa para el cliente (`message`, `resourceId` o `error`).
- **Error inesperado (`throw new Error(...)`):** Es un fallo **no previsto** (un bug, un fallo de sistema o base de datos). No se lanza con un estado HTTP intencionado, por lo que el manejador centralizado lo trata como un error `500` (Internal Server Error). Su respuesta cambia según el entorno: en `development` muestra la pila de ejecución y detalles técnicos, mientras que en `production` los oculta por seguridad mostrando un mensaje genérico.
  
  ## 9. Comportamiento en Producción vs Desarrollo

* **¿Cambiar `NODE_ENV` desactiva automáticamente el logger?**
  * **No.** El logger sigue funcionando a menos que pongas un `if (process.env.NODE_ENV !== 'production')` en el código para apagarlo.
* **¿Qué diferencias hay en la respuesta al error inesperado?**
  * **Development:** Muestra detalles técnicos, trazas y el mensaje real del error (`Fallo interno de prueba`) para ayudar a depurar.
  * **Production:** Muestra un mensaje genérico y seguro (`An unexpected error occurred`) para no filtrar información interna a posibles atacantes.
* **¿Qué diferencias hay en los registros del manejador de errores?**
  * En desarrollo se imprime la pila de ejecución completa (`stack trace`) en la consola del servidor; en producción solo se registra el evento de forma limpia o se oculta el detalle técnico.
* **¿Qué instrucciones explican esto?**
  * Los condicionales en el middleware de errores (`errorHandler.ts`) que comprueban `process.env.NODE_ENV === 'production'` para decidir qué datos enviar en el JSON de respuesta.

---
## 10. Diagnóstico de Fallos de Middleware

### ❌ Prueba 1: Mover `notFound` antes de los routers
* **Lo que esperaba:** Pensaba que las rutas normales seguirían funcionando igual.
* **Qué sucedió:** Cualquier petición a una ruta válida (ej. `/notices`) devolvía un error 404 inmediatamente.
* **Por qué pasó:** Express ejecuta los middlewares en orden secuencial. Si pones el `notFound` antes de las rutas, intercepta todas las peticiones y cree que ninguna existe.
* **Cómo se corrigió:** Dejar el middleware `notFound` al final de todo (justo antes del `errorHandler`).

### ❌ Prueba 2: Eliminar `next()` del Logger
* **Lo que esperaba:** Que la petición respondiera con normalidad pero sin registrarse.
* **Qué sucedió:** La petición se quedaba **cargando indefinidamente** (haciendo *timeout*) y nunca respondía al cliente.
* **Por qué pasó:** Al quitar `next()`, el logger interceptó la petición pero nunca la dejó pasar a la siguiente ruta o controlador.
* **Cómo se corrigió:** Añadir de nuevo `next()` dentro del logger para que la petición continúe su viaje.

---

## 11. Recorrido de las Peticiones (Flujo y Preguntas Clave)

### Casos de Petición:
1. **Consulta de documento existente:** Router ➔ Controlador (busca datos) ➔ Servicio ➔ Responde `200` (No pasa por `errorHandler`).
2. **Consulta de documento inexistente:** Controlador detecta que no está ➔ Lanza `ResourceNotFoundError` ➔ `next(err)` ➔ `errorHandler` responde `404`.
3. **Petición a URL inexistente:** Pasa por todas las rutas válidas sin coincidir ➔ Llega al middleware `notFound` ➔ `next(err)` ➔ `errorHandler` responde `404`.
4. **Creación con título inválido:** Controlador valida el `body` ➔ Lanza `AppError(400)` ➔ `next(err)` ➔ `errorHandler` responde `400`.
5. **Cuerpo JSON mal formado:** Express (body-parser) falla al parsear ➔ Lanza error de sintaxis automáticamente ➔ `errorHandler` responde `400`.
6. **Actualización con título vacío:** Controlador detecta fallo en validación ➔ Lanza `AppError(400)` ➔ `next(err)` (No modifica ningún campo de la base de datos).

### Preguntas clave del flujo:
* **¿Por qué este `notFound` no llama a `next()`?**
  Porque genera una respuesta directa de error (o pasa el error directamente al manejador de errores con `next(err)`).
* **Cuando un controlador llama a `next(err)`, ¿por qué no se ejecuta el `notFound` de abajo?**
  Porque `next(err)` salta directamente por encima de los middlewares normales y va directo al **primer middleware que tenga 4 parámetros** (el `errorHandler`).
* **¿Por qué el manejador de errores necesita 4 parámetros (`err, req, res, next`)?**
  Es el convenio estricto que utiliza Express para **reconocer** que una función es un middleware de errores y no un middleware normal.
* **¿Diferencia entre ruta inexistente y recurso inexistente?**
  * *Ruta inexistente:* La URL no existe en el servidor (ej. `/api/v1/inventado`). Lo atrapa el `notFound` (`404`).
  * *Recurso inexistente:* La URL es correcta, pero el ID buscado no está en la base de datos (ej. `/api/v1/notices/9999`). Lo gestiona el controlador lanzando `ResourceNotFoundError` (`404`).
* **¿Por qué el logger usa el evento `finish` para registrar el estado?**
  Porque `finish` se dispara **exactamente cuando la respuesta ya se ha enviado por completo**, lo que permite registrar con precisión el código de estado final (como el `200` o `404`) y el tiempo que tardó.
* **¿Para qué sirve `requestId`?**
  Identifica de forma única cada petición HTTP. Permite filtrar los registros (`logs`) en la consola para seguir el ciclo de vida exacto de una misma petición desde que entra hasta que responde.
* **¿Es obligatorio separar router, controlador y servicio?**
  No es obligatorio para que funcione, pero **aporta mantenibilidad, orden y escalabilidad**: separa las rutas (Express), la lógica HTTP (Controlador) y la manipulación de datos (Servicio).
* **¿Qué ocurre con los avisos al reiniciar el servidor?**
  Si se almacenan en un array o memoria RAM, **se borran y se pierden** al reiniciar. (Solo persisten si se guardan en una base de datos o archivo).

---
