# 🏗️ Diseño de Arquitectura: CommodaFlow (Versión 2.0)

## 1. Seguridad y Autenticación

- **Gestión de Tokens:** Se reconoce que localStorage es vulnerable a ataques XSS. Para este proyecto, se opta por localStorage por simplicidad técnica, asumiendo el riesgo de forma consciente y documentada. En un entorno productivo, se implementarían httpOnly Cookies gestionadas por el servidor para mitigar el acceso de scripts maliciosos al JWT.
- **Protección de Rutas:** Un componente ProtectedRoute envolverá las vistas sensibles, verificando la existencia del token antes de renderizar.

## 2. Gestión de Estado y Datos

- **Estado Global (Context API)**: Se limita estrictamente a AuthContext.
- **Estado de Sesión (CartContext):** La "cesta" de hardware se gestiona como estado de sesión efímero. Se implementa una lógica de vaciado automático tras la confirmación exitosa del alquiler para evitar inconsistencias.
- **Sincronización de Servidor (React Query):** Se elige React Query sobre useEffect para la gestión de datos asíncronos. Esto nos permite centralizar el manejo de:
    * Caché y revalidación automática.
    * Estados nativos de isLoading, isError y data.

## 3. Arquitectura del Backend (4 Capas)

Para garantizar la separación de responsabilidades y facilitar el testing, el backend se divide en:
- **Routes:** Definición de endpoints y mapeo de verbos HTTP.
- **Controllers:** Validación de la petición (inputs) y orquestación de la respuesta.
- **Services:** Lógica de negocio (ej. calcular disponibilidad o fechas de entrega).
- **Repository:** Abstracción total del acceso a datos. Es la única capa que interactúa con el MockDB (o base de datos futura).

## 4. Diseño de la API RESTful

| Recurso | Verbo | Endpoint | Propósito |
| :--- | :--- | :--- | :--- |
| **Hardware** | `GET` | `/hardware` | Obtener el catálogo completo de activos. |
| **Hardware** | `GET` | `/hardware/:id` | Obtener la ficha técnica detallada de un equipo específico. |
| **Hardware** | `POST` | `/hardware` | Registrar un nuevo activo en el sistema (Solo Admin). |
| **Hardware** | `PATCH` | `/hardware/:id` | Actualización parcial (ej. cambiar disponibilidad o estado). |
| **Hardware** | `PUT` | `/hardware/:id` | Actualización completa de las especificaciones del equipo. |
| **Rentals** | `POST` | `/rentals` | Crear y confirmar un nuevo contrato de alquiler. |


## 5. Capa de Cliente API Tipada (src/api/)

Se implementa una capa de servicios en el frontend que centraliza las peticiones mediante funciones fuertemente tipadas

Esto permite que los componentes/hooks consuman funciones (getHardware()) y no strings ('/api/v1/hardware'), facilitando el refactorizado.

## 6. Formulario y Validación de Datos

En lugar de usar Partial<T>, se define la interfaz HardwareFormData. Esto permitirá separar el modelo de la base de datos (que incluye IDs, fechas de creación, etc.) de los datos que el usuario realmente debe rellenar. Esto validará campos requeridos de forma estricta antes de enviarlos al Service.

### 🔄 Diagrama de Flujo de Datos (Arquitectura por Capas)

```mermaid
sequenceDiagram
    participant UI as UI (React)
    participant Client as API Client (Axios/Fetch)
    participant Ctrl as Controller
    participant Serv as Service
    participant Repo as Repository
    participant DB as MockDB/Storage

    UI->>Client: 1. El usuario pulsa "Alquilar"
    Client->>Ctrl: 2. postRental(data)
    Ctrl->>Serv: 3. Valida campos y pasa al servicio
    Note over Serv: Lógica de Negocio
    Serv->>Repo: 4. Comprueba disponibilidad
    Repo->>DB: 5. Consulta estado actual
    DB-->>Repo: Hardware disponible
    Repo->>DB: 6. Actualiza estado y guarda contrato
    Repo-->>Serv: Confirmación de guardado
    Serv-->>Ctrl: Respuesta procesada
    Ctrl-->>Client: HTTP 201 Created
    Client-->>UI: 7. Muestra mensaje de éxito

    ```