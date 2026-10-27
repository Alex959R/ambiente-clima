# Bitacora de prompts - Alex Rosero

Herramienta usada: Claude (Claude Code, modelo Claude Opus 5.5)
Regla del proyecto: la IA no escribe ni corrige codigo del backend; solo explica conceptos
con ejemplos genericos y senala errores. Todo el codigo lo escribo yo.

---

## 2026-10-22 - Planeacion y configuracion inicial
- Prompt: "ayudame a organizar el plan de mejoramiento paso a paso"
- Respuesta: explico el tema Ambiente y clima, Git Flow (main/develop/feature),
  estructura del repositorio, entorno virtual y dependencias.
- Que hice: segui los pasos y ejecute yo los comandos. Cree repo, ramas, venv y
  proyecto Django. PR #1.

## 2026-10-23 - App ambiente y modelos
- Prompt: "explicame como crear la app y los modelos"
- Respuesta: explico startapp, settings (DRF, CORS, Swagger, idioma) y relaciones
  ForeignKey con un ejemplo generico Libro/Autor.
- Que hice: escribi los 4 modelos (Zona, Medicion, Alerta, Recomendacion), migraciones
  y admin. PR #2.

## 2026-10-24 - Inicio de serializers
- Prompt: "continuemos con el siguiente paso"
- Respuesta: la IA creo el archivo serializers.py por su cuenta.
- Que hice: lo descarte porque rompe la regla del backend. Se borro el archivo y la rama,
  y le pedi que solo me explicara.

## 2026-10-24 / 2026-10-26 - Serializers
- Prompt: "reviza" (varias veces, revisando mi serializers.py)
- Respuesta: explico que es un serializer (traduce modelos a JSON y valida datos),
  como usar source para mostrar el nombre de la zona, y senalo mis errores:
  imports sobrantes, nombre de archivo y clase mal escritos, read_only fuera del
  parentesis, source mal armado y campo dentro de class Meta.
- Que hice: corregi yo cada error y probe con datos reales en manage.py shell.
  Termine los 4 serializers.

## 2026-10-26 - Resumen de avance
- Prompt: "reviza y recopila lo que hemos echo y lo que nos falta"
- Respuesta: lista de lo hecho y lo pendiente segun el PDF (vistas, urls, Swagger,
  validaciones, .env, proxy de IA, README).
- Que hice: lo use para organizar los siguientes pasos.

## 2026-10-26 - Bitacora
- Prompt: "enviame un resumen corto de lo que hemos echo"
- Respuesta: formato de bitacora con las entradas anteriores.
- Que hice: lo adapte y lo pegue en este archivo.