Cómo se instala y arranca tu proyecto.
-Desde la carpeta simulacro/LasDivinasProyecto , instalo las dependencias con npm install y arranco el servidor en modo desarrollo con npm run dev.

Dónde se configura el puerto y cómo llega ese valor hasta el arranque del servidor.
-Se configura en el .env donde pone PORT=. El servidor lee ese valor y lo usa para arrancar.

Por qué se sube a GitHub el .env.example y se excluye .env.
-Porque .env contiene datos importantes para la seguridad y secretos del backend entonces se hace un ejemplo donde contiene los datos del .env pero sin revear los propios.
