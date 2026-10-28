# Bitacora de prompts - Andres Vidal

Herramienta usada: Antigravity (Google DeepMind)
Rol en el proyecto: Desarrollo del Frontend en React + TypeScript y conexion con la API REST de Django.

---

## 2026-10-27 - Inicializacion del proyecto Frontend
- Prompt: "configurar el proyecto de frontend con React, TypeScript y Vite para el monitoreo ambiental"
- Respuesta: creo la estructura modular en `frontend/`, sistema de diseño en CSS, tipos de TypeScript sincronizados con los modelos de Django (`Zona`, `Medicion`, `Alerta`, `Recomendacion`), y servicios base con mocks.
- Que hice: revise la arquitectura, configure los componentes iniciales del modulo de Zonas y guarde el avance en el commit inicial `feat: proyecto de react-`.

## 2026-10-27 - Sincronizacion de ramas (Git Flow)
- Prompt: "necesito traer todo el backend que esta en la rama de develop, pero yo trabajare en una rama diferente llamada frontend-ambiente-clima, entonces ayudame a traer todo lo del develop a la rama frontend-ambiente-clima sin que después hayan fallos"
- Respuesta: analizo el arbol de commits, ejecuto `git fetch` y realizo el merge limpio de `develop` hacia `frontend-ambiente-clima`. Explico los endpoints disponibles en Django (Zonas, Mediciones, Alertas, Recomendaciones y Swagger).
- Que hice: verifique que no hubiera colisiones entre `backend/` y `frontend/` y confirme que el backend quedara integrado en mi rama de trabajo.

## 2026-10-27 - Desbloqueo de APIs reales y configuracion de CORS
- Prompt: "ve y ajusta los nuevos cambios a el archivo, ademas de ejecutar o arrancar el back y el front para visualizar lo realizado"
- Respuesta: modifico `api.ts` reemplazando los mocks por peticiones `fetch` reales a Django REST Framework, anadio la funcion `extractResults` para soportar la paginacion (`results: [...]`), configuro el puerto 3000 de Vite en `CORS_ALLOWED_ORIGINS` dentro de `settings.py` de Django y arranco ambos servidores.
- Que hice: probe el CRUD de Zonas en `http://localhost:3000` interactuando contra la base de datos real SQLite de Django.

## 2026-10-27 / 2026-10-28 - Construccion de modulos restantes
- Prompt: "ayudame a crear las paginas faltantes, para que solo quede faltando lo de la IA"
- Respuesta: desarrollo los componentes y vistas completas:
  - `MedicionesPage`: tarjetas por tipo de sensor (temperatura, aire, lluvia, ruido), filtros por zona y modal de registro.
  - `AlertasPage`: semaforo de criticidad por severidad, accion rapida para resolver alertas (`PATCH`) y modal de emision.
  - `RecomendacionesPage`: directrices comunitarias con distincion visual entre operadas por humanos y generadas por IA.
  - Integracion global en `App.tsx` enrutando las 4 pestañas de la aplicacion.
- Que hice: valide la navegacion en caliente con Vite, verifique los estados de carga y errores, y asegure la compatibilidad con TypeScript.

## 2026-10-28 - Commits modulares y publicacion a GitHub
- Prompt: "crea comentarios al repositorio, 1 cuando se creo el proyecto, depues de la creacion de las paginas un comentario por cada pagina" y posterior confirmacion para `git push`.
- Respuesta: organizo el staging y realizo 4 commits semanticos (conexion de API, Mediciones, Alertas y Recomendaciones), y subio la rama al repositorio remoto (`origin/frontend-ambiente-clima`).
- Que hice: confirme que la rama y el historial de commits aparecieran correctamente en GitHub y que el arbol de trabajo quedara limpio.

## 2026-10-28 - Definicion del contrato del Proxy de IA
- Prompt: definicion del contrato acordado para el proxy (`POST /api/mediciones/{id}/recomendacion-ia/` con body vacio, retorno 201 de `Recomendacion`, y codigos 404 y 503).
- Respuesta: analizo la propuesta destacando su apego a las convenciones de DRF (`@action`), la seguridad de las claves de Gemini en el backend y la simplicidad para el cliente.
- Que hice: incorpore el metodo `generarRecomendacionIA` en el servicio y anadi el boton de generacion con IA directamente en cada tarjeta de medicion.
