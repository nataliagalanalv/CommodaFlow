# 📂 Organización del Proyecto: CommodaFlow

## 1. Metodología de Trabajo
Se ha adoptado un enfoque **Ágil simplificado**, centrado en la entrega de funcionalidades iterativas (Sprints cortos).

**Gestión de Tareas:** Se utiliza un tablero Kanban para visualizar el flujo de trabajo:
    - `Backlog`: Ideas y requisitos futuros.
    - `To Do`: Tareas priorizadas para el ciclo actual.
    - `In Progress`: Tareas en desarrollo activo.
    - `Testing/Review`: Verificación de tipos y pruebas de componentes.
    - `Done`: Funcionalidades desplegadas y documentadas.

## 2. Arquitectura y Estructura
La organización del código sigue un patrón de **Separación de Responsabilidades (SoC)** para facilitar el mantenimiento a largo plazo:

### Frontend (frontend/src/)
- **Atomicidad**: Componentes pequeños y reutilizables en `src/components/` (ej. DataTable).
- **Vistas**: Páginas completas en `src/pages/` que orquestan los componentes.
- **Single Source of Truth**: Tipado centralizado en `src/types/` para evitar discrepancias en los modelos de hardware.

### Backend (server/)
- **Estructura MVC**: Organización en rutas, controladores y servicios para desacoplar la lógica de negocio de la infraestructura de red.

## 3. Control de Versiones (Git)
Se sigue una convención estricta de mensajes de commit basada en **Conventional Commits**:
- `feat:` Nuevas funcionalidades.
- `fix:` Corrección de errores.
- `docs:` Cambios en la documentación.
- `refactor:` Mejoras en el código que no cambian la funcionalidad.

## 4. Roadmap de Desarrollo
1. **Fase 1**: Configuración de entorno y diseño de modelos de datos.
2. **Fase 2**: Desarrollo de componentes genéricos fuertemente tipados.
3. **Fase 3**: Implementación de navegación y vistas de catálogo de hardware.
4. **Fase 4**: Conexión con el servicio de datos y gestión de estados de alquiler.