# Documentación de Componentes - CommodaFlow

A continuación se detalla los componentes desarrollados para la plataforma de gestión y alquiler de hardware, organizados según su propósito y nivel de complejidad dentro de la arquitectura del proyecto.

---

## 1. Núcleo y Estado (Atoms)

### `StatusBadge.tsx`
* **Propósito:** Indicador visual del estado de disponibilidad de una pieza de hardware.
* **Props:** - `status`: Tipo `HardwareStatus` (`available`, `rented`, `maintenance`).

### `UserAvatar.tsx`
* **Propósito:** Representación visual del usuario en la interfaz.
* **Props:** - `user`: Objeto de tipo `User`.

---

## 2. Componentes de Hardware (Inventario)

### `HardwareCard.tsx`
* **Propósito:** Unidad básica de visualización en el catálogo.
* **Props:** - `item`: Objeto de tipo `Hardware`.
  - `onRent`: Función callback que recibe el ID del equipo.
* **Composición:** Utiliza el `StatusBadge` para mostrar la disponibilidad.
* **Interacción:** El botón "Alquilar" activa el flujo de reserva solo si el equipo está disponible.

### `HardwareForm.tsx`
* **Propósito:** Formulario para la creación o edición de activos de hardware.
* **Campos:** Modelo, Especificaciones técnicas, Tarifa diaria y Estado inicial.
* **Validación:** Asegura que los campos numéricos sean positivos y el modelo no esté vacío antes de emitir los datos mediante la interfaz `HardwareFormData`.

---

## 3. Gestión de Usuarios y Alquileres

### `Navbar.tsx`
* **Propósito:** Cabecera principal de navegación.
* **Componentes:** Incluye el logo de la marca, enlaces de navegación dinámica y el `UserAvatar`.
* **Comportamiento:** Implementa una lógica de visualización condicional: el enlace "Panel Admin" solo se muestra si el usuario tiene el rol `admin`.

### `RentalModal.tsx`
* **Propósito:** Orquestador de la transacción de alquiler.
* **Lógica Clave:** - Calcula en tiempo real el precio total multiplicando los días entre `startDate` y `endDate` por la `dailyRate` del equipo.
  - Utiliza el hook `useMemo` para optimizar el cálculo de fechas y evitar re-renderizados costosos.
  - Emite una notificación visual con la librería `sonner` al confirmar la acción.

### `RentalTable.tsx`
* **Propósito:** Vista de seguimiento de alquileres activos y pasados.
* **Visualización:** Estructura de tabla que muestra el modelo del equipo, el usuario responsable, la fecha de devolución y el estado del contrato (`active`, `returned`, `overdue`).

---

## 4. Páginas (Layouts & Logic)

### `InventoryPage.tsx`
* **Responsabilidad:** Página principal de exploración.
* **Gestión de Estado:** Controla la visibilidad del `RentalModal` y mantiene la referencia del hardware seleccionado para asegurar que el modal se cargue con la información correcta.

### `UserProfilePage.tsx`
* **Responsabilidad:** Centro de control del usuario autenticado.
* **Contenido:** Combina el `UserProfileCard` con el historial de la `RentalTable` para ofrecer una visión 360º de la actividad del usuario en la plataforma.

---

> **Nota técnica:** Todos los componentes están desarrollados bajo una política de **"Zero Any"**, utilizando las interfaces centralizadas en `src/types/`.