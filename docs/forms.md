# Formularios e Interacción

En esta sección se detalla la implementación de formularios controlados y la lógica de validación de datos en el frontend.

---

## 1. Patrón de Componentes Controlados

Todos los formularios de la aplicación siguen el patrón de **Componentes Controlados**. El estado de los inputs reside en React (`useState`) y no en el DOM, lo que permite:

- Validación inmediata al escribir.
- Formateo de datos (ej. convertir strings a números) antes del envío.
- Deshabilitar botones de guardado si los datos son inválidos.

---

## 2. Formulario de Alta de Hardware (`HardwareForm.tsx`)

Este formulario se encarga de registrar nuevos equipos en el sistema.

### Implementación Técnica:
- **Estado Único:** Se utiliza un objeto `formData` para agrupar todos los campos, optimizando el número de funciones de actualización.
- **Tipado Estricto:** Se utiliza la interfaz `HardwareFormData` para asegurar que el modelo, el tipo y la tarifa diaria cumplan con el esquema esperado.
- **Callback de Salida:** Expone una prop `onSubmit` que devuelve los datos limpios al componente padre (normalmente la página de Inventario).

---

## 3. Formulario de Solicitud de Alquiler (`RentalModal.tsx`)

Este formulario gestiona la creación de transacciones de alquiler vinculando un usuario con un equipo.

### Lógica de Cálculo Dinámico (`useMemo`):
Para el cálculo del precio total, utilizamos el hook `useMemo`. Esto permite recalcular el coste de forma eficiente solo cuando cambian las fechas de inicio o fin.

```typescript
const totalPrice = useMemo(() => {
  if (!startDate || !endDate) return 0;
  const days = calcularDiferenciaDias(startDate, endDate);
  return days > 0 ? days * item.dailyRate : 0;
}, [startDate, endDate, item.dailyRate]);

```

**Validaciones Críticas:**
- Cronología: No se permite que la fecha de fin sea anterior o igual a la de inicio.
- Integración con Auth: El formulario recupera el userId automáticamente del AuthContext para "firmar" la solicitud, evitando que el usuario tenga que introducir sus datos manualmente.

## 4. Feedback al Usuario

Utilizamos la librería Sonner para proporcionar notificaciones visuales (Toasts):
- toast.success(): Tras un envío exitoso.
- toast.error(): Cuando las validaciones de negocio (fechas erróneas o campos vacíos) fallan.

