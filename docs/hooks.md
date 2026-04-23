# Documentación de Hooks

Se describe la implementación de la lógica reactiva en la aplicación, detallando el uso de los Hooks estándar de React y la creación de Hooks personalizados para la gestión del inventario.

---

## 1. Hooks Estándar de React

En **CommodaFlow**, utilizamos los Hooks para transformar componentes estáticos en interfaces dinámicas y eficientes.

### `useState` (Gestión de Estado)
* **Uso:** Manejo del término de búsqueda (`searchTerm`), la lista de equipos (`items`) y los estados de carga (`isLoading`).
* **Por qué:** Permite que la aplicación "recuerde" la interacción del usuario. Sin `useState`, el texto escrito en el buscador se perdería en cada renderizado.

### `useEffect` (Efectos Secundarios)
* **Uso:** Simulación de llamadas a la API y carga inicial de datos desde `mockData`.
* **Por qué:** Se encarga de tareas que ocurren "fuera" del flujo de renderizado. En este caso, asegura que los datos se carguen una sola vez cuando el componente se monta en el DOM.

### `useMemo` (Optimización de Cálculos)
* **Uso:** Filtrado de la lista de hardware basado en el texto de búsqueda.
* **Por qué:** El filtrado es una operación que recorre todo el array de equipos. `useMemo` memoriza el resultado y solo vuelve a filtrar si el usuario cambia el texto de búsqueda o si la lista original de equipos se actualiza. Esto evita tirones (lags) en la interfaz.

### `useCallback` (Estabilidad de Funciones)
* **Uso:** Función `handleSearch` que se pasa al componente `SearchBar`.
* **Por qué:** En React, las funciones se crean de nuevo en cada renderizado. `useCallback` mantiene la misma instancia de la función entre renderizados, lo que evita que componentes hijos optimizados se vuelvan a dibujar innecesariamente.

---

## 2. Hooks Personalizados (Custom Hooks)

Siguiendo el principio de **Separación de Responsabilidades**, hemos encapsulado la lógica compleja en un Hook reutilizable.

### `useInventory`
Ubicación: `src/hooks/useInventory.ts`

Este Hook actúa como el "cerebro" del catálogo de hardware. Sus responsabilidades incluyen:
1.  **Sincronización:** Orquestar la carga de datos inicial.
2.  **Filtrado:** Procesar la lógica de búsqueda en tiempo real.
3.  **Abstracción:** Permitir que la página (`InventoryPage`) no sepa de dónde vienen los datos, solo cómo mostrarlos.

---

## 3. Flujo de Datos

1. El usuario escribe en la SearchBar.
2. handleSearch (memorizada con useCallback) actualiza el estado searchTerm.
3. useMemo detecta el cambio en searchTerm y recalcula la lista filtrada.
4. La interfaz se actualiza automáticamente mostrando solo los equipos que coinciden.

Nota de Rendimiento: Esta estructura está preparada para manejar cientos de activos de hardware sin degradar la experiencia de usuario gracias a la memorización selectiva.