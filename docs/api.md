# 🚀 Documentación API

Esta API gestiona el inventario de hardware y el registro de alquileres, utilizando una arquitectura de **Rutas -> Controladores -> Servicios** con un middleware de manejo de errores centralizado y registro de actividad (logger).

**Base URL:** `http://localhost:3001/api`

---

## 💻 Hardware Endpoints

### 1. Get All Inventory

Retorna la lista completa de equipos, incluyendo modelos, especificaciones y disponibilidad.

- **URL:** `/hardware`
- **Method:** `GET`
- **Success Response:** `200 OK`

**Example Response:**
```json
[
  {
    "id": "1",
    "model": "MacBook Pro M2",
    "specs": "16GB RAM, 512GB SSD",
    "status": "available",
    "dailyRate": 45
  },
  {
    "id": "2",
    "model": "Dell XPS 15",
    "specs": "32GB RAM, 1TB SSD",
    "status": "rented",
    "dailyRate": 35
  }
]
```

### 2. Create Hardware

Añade un nuevo equipo al sistema. El id se genera automáticamente en el servidor.

- **URL:** /hardware
- **Method:** POST
- **Request Body:**
```json
{
  "model": "iPad Pro",
  "specs": "M4 Chip, 11-inch",
  "dailyRate": 25,
  "status": "available"
}
```
- **Success Responde:** `201 Created`

### 3. Update Status

Actualiza únicamente el estado de un equipo (p. ej., pasar de 'available' a 'maintenance').

- **URL:** /hardware/:id/status
- **Method:** PATCH
- **Request Body:**
```json
{
  "status": "maintenance"
}
```

- **Success Response:** 200 OK
- **Error Response:** 404 Not Found si el ID no existe.

## 🤝 Rentals Endpoints

### 1. Create Rental
Registra un nuevo alquiler. Al realizar esta acción, el sistema cambia automáticamente el estado del hardware vinculado a rented a través del HardwareService.

- **URL:** /rentals
- **Method:** POST
- **Request Body:**
```json
{
  "hardwareId": "1",
  "userId": "user_99",
  "startDate": "2024-05-20",
  "endDate": "2024-05-25",
  "totalPrice": 225
}
```
- **Success Response:** 201 Created
- **Error Response:** 400 Bad Request si el equipo no está disponible o no existe.

## 🛠️ Middleware & Architecture

- **Error Handling**
La API utiliza un manejador de errores global. Todas las respuestas de error siguen esta estructura:
```json
{
  "status": "error",
  "statusCode": 400,
  "message": "Descripción del error",
  "stack": "..." // Solo visible en entorno de desarrollo
}
```

- **Request Logger**
Cada petición se registra en la consola del servidor con el siguiente formato:

[METHOD] /url/path - STATUS (TIMEms)
Ejemplo: [GET] /api/hardware - 200 (1.450ms)