# Clonar y explorar el proyecto — Actividad 1

> Plantilla para la Actividad 1. Copia este fichero a tu repositorio de equipo
> como `team-docs/week-02/01-clone-and-explore.md` y rellena
> cada sección.

## Team

`Las Divinas`

## Para qué sirve esta actividad

Esta semana **no escribís backend**: ejecutáis y probáis uno que ya existe
en `topics/topic-02-UT1-running-project-bruno-basics/code/backend/`. El
primer paso de cualquier trabajo con un proyecto ajeno es siempre el mismo:
clonarlo, o abrir la carpeta dentro de la copia local del repositorio del
curso (donde vive el demo de referencia), y leer sus ficheros
**antes** de ejecutar nada.

## Pasos

1. Si tu equipo no tiene ya una copia local del repositorio del curso,
   clónala (sirve para leer el material y ejecutar el demo de referencia).
2. Abre en VS Code la carpeta
   `topics/topic-02-UT1-running-project-bruno-basics/code/backend/`.
3. Localiza y abre estos tres ficheros (sin ejecutar nada todavía):
   - `package.json`
   - `.env.example`
   - `src/server.ts`
4. Responde por escrito, en tus propias palabras, a las tres preguntas de
   la siguiente sección.

## Apuntes: qué mirar en cada fichero

- **`package.json`** — la sección `"scripts"` lista los comandos que puedes
  ejecutar con `npm run <nombre>`. Es la primera parada en cualquier
  proyecto Node.js desconocido: te dice **qué** se puede hacer con él sin
  necesidad de leer el código fuente.
- **`.env.example`** — es la plantilla **pública** de variables de entorno.
  Se versiona en Git a propósito, para que cualquiera sepa qué variables
  necesita definir. El fichero real `.env` (con tus valores) **NO** se
  versiona nunca (piensa que subirlo al repositorio es como revelar tus contraseñas) — y por eso está en `.gitignore`.
- **`src/server.ts`** — el único fichero de código fuente del demo. No hace
  falta entender cada línea todavía: fíjate en qué rutas HTTP define
  (`app.get(...)`) y en qué variable de entorno lee (`process.env.PORT`).

## Preguntas

1. **¿Qué comandos de `npm run` existen en `package.json` y qué crees que
   hace cada uno, a partir de su nombre?**

   ```text
**npm run typecheck** Comprueba si hay errores a la hora de que vayas a hacer un commit.

**npm run build** Prepara y compila el servidor para la ejecucion.

**npm run dev**	Inicia el servidor del backend.
   ```

2. **¿Qué variable de entorno espera el proyecto según `.env.example`?
   ¿Por qué crees que `.env.example` sí está en el repositorio pero `.env`
   no?**

   ```

   Espera PORT, env example es como una plantilla, env puede tener datos sensibles.
   ```

3. **Según `src/server.ts`, ¿qué dos rutas HTTP responde el servidor?**

   ```
   GET /health
   GET /api/hello
   ``` 

---

**Criterio de aceptación**: las tres preguntas respondidas correctamente,
en las palabras del equipo (no copiadas literalmente del README).
