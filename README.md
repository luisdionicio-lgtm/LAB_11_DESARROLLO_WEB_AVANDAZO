# Órbita · Laboratorio 11

[Ver aplicación en Vercel](https://lab-11-desarrollo-web-avandazo.vercel.app/dashboard) · [Repositorio](https://github.com/luisdionicio-lgtm/LAB_11_DESARROLLO_WEB_AVANDAZO)

Un espacio para organizar proyectos, personas y tareas. Esta entrega parte de los ejercicios de componentes y estilización del laboratorio y desarrolla la tarea con una identidad visual propia: azul profundo, acentos lima, fotografías de referencia e iconos Lucide.

## Contenido del laboratorio

- **Ejercicio 1:** `ejercicios/01-componentes-estilos` contiene el proyecto independiente de componentes y estilos. Para ejecutarlo, entra en esa carpeta y usa `npm ci` y `npm run dev`.
- **Ejercicio 2 y tarea:** la raíz contiene el proyecto Next.js con shadcn/ui y el dashboard Órbita. La configuración está en `components.json` y los componentes generados están en `src/components/ui`.
- **Evidencias e informe:** `docs/capturas/ejercicios` contiene las capturas de los ejercicios y `docs/informe/GLAB-S11-EAREVALO-2026-1-ORDENADO.docx` el informe ordenado entregado previamente. El informe todavía no incorpora las capturas finales de la tarea.

Cada proyecto tiene sus propias dependencias y archivo `package-lock.json`. Si ejecutas ambos al mismo tiempo, inicia el segundo en otro puerto, por ejemplo `npm run dev -- -p 3001`.

## Ejecutar Órbita

```bash
npm ci
npm run dev
```

Abre http://localhost:3000/dashboard. Para verificar la entrega:

```bash
npm run lint -- --max-warnings=0
npm test
npm run build
npm start
```

## Lo que puedes hacer

- Crear, consultar, editar y eliminar proyectos, miembros y tareas.
- Asignar personas a proyectos y responsables a tareas; consultar avances calculados desde las tareas.
- Buscar y filtrar tareas por proyecto, estado y prioridad, ordenar por fecha y recorrer páginas.
- Elegir fechas con Calendar, ver validaciones con Alert y estados de guardado con Spinner.
- Guardar preferencias de apariencia, movimiento y densidad; explorar el carrusel de proyectos.

Los datos iniciales son ficticios. Los cambios se conservan en `localStorage` del navegador: no existe un servidor de datos ni sincronización entre dispositivos. El resumen semanal es una preferencia de demostración y no envía correos. Las horas del resumen representan la suma de estimaciones de tareas completadas.

## Estructura

`src/components/orbita` contiene las pantallas y formularios; `src/components/ui`, los componentes shadcn; `src/lib`, los modelos, datos iniciales y persistencia; `public/images`, las imágenes locales.

Las capturas en `docs/capturas/ejercicios` corresponden a los ejercicios previos. No representan el rediseño final de Órbita. La comprobación visual del rediseño queda pendiente porque el control del navegador está deshabilitado en la sesión de entrega.

## Créditos

Next.js, React, Tailwind CSS, shadcn/ui, Radix, Embla Carousel, React Day Picker y Lucide. Fotografías de referencia de Unsplash, servidas localmente; fuentes originales en [docs/IMAGENES.md](docs/IMAGENES.md).
