## Definición del Proyecto: CommodaFlow ##

### 1. Problema que intenta resolver ###

En el entorno de un centro de formación académica, el préstamo de hardware (portátiles, tablets, periférico) suele ser informal o se registra en archivos locales que no todos pueden consultar. Esto puede generar falta de trazabilidad y pérdida de tiempo.

CommodaFlow es una solución Fullstack que permite centralizar el inventario y gestionar el flujo de préstamos, asegurando que tanto alumnos como administradores sepan exactamente dónde está cada recurso.

### 2. Usuario objetivo ###

- **Estudiante (Frontend):** Consulta disponibilidad, solicita equipos y ve su historial.

- **Administrador (Backend/Gestión):** Gestiona el catálogo de productos y valida las devoluciones.

### 3. Técnologías a emplear ###

- **Frontend:** React con Vite, TypeScript y Tailwind CSS.

- **Backend:** API REST construida con Node.js y Express.

- **Organización:** Tablero Trello para metodología Kanban/Agile.

- **Tipado:** Interfaces de TypeScript compartidas/alineadas entre el cliente y el servidor para evitar errores de comunicación.

### 4. Funcionalidades Principales (MVP) ###

- **Catálogo Sincronizado:** El frontend consume una API (Node) que devuelve la lista de equipos.

- **Gestión de Estados de Red:** La aplicación mostrará indicadores visuales claros para:

    * Carga: Spinners mientras se obtienen los datos.
    * Éxito: Notificaciones cuando un préstamo se procesa correctamente.
    * Error: Mensajes descriptivos si la API falla o el equipo ya no está disponible.

- **Sistema de Préstamo:** Endpoint POST /loans para registrar quién se lleva qué equipo.

- **Contratos de Datos (Types):** Definición estricta de objetos Equipment, User y Loan.

### 5. Funcionalidades Opcionales ###

- **Filtros Avanzados:** Filtrar por categoría o disponibilidad sin recargar la página (estado local de React).

- **Dashboard de Admin:** Vista protegida para añadir o eliminar stock de la base de datos.

### 6. Mejoras Futuras ###

- **Logs de Auditoría:** Registro de cada movimiento para saber si un equipo volvió dañado.