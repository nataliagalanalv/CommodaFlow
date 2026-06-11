# Diagrama de arquitectura

El diagrama del sistema se dibuja en [Excalidraw](https://excalidraw.com) y se
exporta como imagen a esta carpeta:

```
docs/arquitectura/diagrama.png
```

Una vez exportado, ya está referenciado desde el README principal.

---

## Qué dibujar (actores del sistema)

> Nota: CommodaFlow **no** incluye almacenamiento de imágenes (AWS S3) ni cámara/GPS.
> El diagrama refleja únicamente los componentes que realmente usa el proyecto.

| Actor | Etiqueta sugerida | Tecnología |
|-------|-------------------|------------|
| Cliente móvil | App Móvil | Expo / React Native |
| Cliente web | App Web | Next.js |
| Backend / API | API REST | Next.js (Route Handlers) en Vercel |
| Identidad | Firebase Authentication | Firebase |
| Base de datos | Base de datos | PostgreSQL en Neon |
| Notificaciones | Notificaciones locales | Expo Notifications (en el dispositivo) |

## Flechas y relaciones a representar

1. **App Móvil → API REST** (peticiones HTTP con el token en la cabecera).
2. **App Web → API REST** (peticiones HTTP; la sesión va en una cookie).
3. **App Móvil y App Web → Firebase Auth** (login/registro: el cliente obtiene un ID token).
4. **API REST → Firebase Admin SDK** (el servidor verifica el ID token).
5. **API REST → Neon (PostgreSQL)** (lectura/escritura de inventario y alquileres, vía Prisma).
6. **App Móvil → Expo Notifications** (programa recordatorios locales en el propio dispositivo).

## Idea de disposición

```
   [App Web]            [App Móvil]
       \                   /  \
        \   (1)(2) HTTP   /    \ (6) notificaciones locales
         \               /      └──► [Expo Notifications]
          ▼             ▼
        ┌───────────────────────┐
        │   API REST (Next.js)  │
        │      en Vercel        │
        └───┬───────────────┬───┘
        (4) │               │ (5)
            ▼               ▼
   [Firebase Auth]     [Neon · PostgreSQL]
   (identidad)         (datos de negocio)

   (3) App Web y App Móvil también hablan directamente
       con Firebase Auth para login/registro.
```

## Consejos de exportación

- En Excalidraw: **Menú → Export image → PNG**, con fondo (no transparente) para que
  se vea bien en GitHub.
- Guarda también el archivo editable (`.excalidraw`) en esta carpeta por si necesitas
  retocarlo más adelante.
