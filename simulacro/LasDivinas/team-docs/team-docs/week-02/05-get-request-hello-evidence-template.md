# Enviar GET /hello con parámetro de consulta — Actividad 5

## Para qué sirve esta actividad

`GET /hello` acepta un **parámetro de consulta** (*query parameter*)
llamado `name`. Esta actividad practica el efecto de cambiar ese parámetro
sobre la respuesta, y compara la petición **con** y **sin** parámetro.

## Pasos

1. En Bruno, abre la petición `02-hello-default` (sin parámetro `name`) y
   pulsa **Send**.
   **Mi respuesta ha sido** 

{
  "message": "Hola, mundo!"
}
2. Abre la petición `03-hello-with-name` (con `name=Ada` en la pestaña
   **Params**) y pulsa **Send**.

   **Mi respuesta ha sido**

{
  "message": "Hola, Ada!"
}
3. En `03-hello-with-name`, cambia el valor de `name` por el nombre de tu
   equipo en la pestaña **Params** y vuelve a pulsar **Send**.

   **Mi respuesta ha sido**

{
  "message": "Hola, Las Divinas!"
}

### Explica en una frase

¿Qué ocurre en el servidor cuando `name` no está presente en la URL, según
lo que observas en la respuesta?

```text
Utiliza como un nombre predeterminado que tiene que es mundo entonces si no se pone nada saluda a mundo.
```
