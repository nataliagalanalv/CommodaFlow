# ADR 0002 — Zustand en lugar de Redux o Context API

**Estado:** Aceptada
**Fecha:** 2026

## Contexto

La aplicación móvil necesita compartir estado entre varias pantallas sin pasarlo
manualmente de componente en componente (lo que se conoce como *prop drilling*).
En concreto hay que compartir:

- El **usuario autenticado** y su token de sesión.
- El **inventario** de hardware cargado de la API.
- El **historial de alquileres** del usuario.

Además, la sesión debe **persistir** al cerrar y reabrir la app.

Las opciones habituales en el ecosistema React son tres:

- **Context API** (incluida en React).
- **Redux** (con Redux Toolkit).
- **Zustand** (librería ligera de gestión de estado).

## Decisión

Usar **Zustand** con su middleware `persist` sobre **AsyncStorage**.

## Alternativas consideradas

- **Context API:** válida para estado simple, pero provoca *re-renders* de todos los
  componentes consumidores cuando cambia cualquier parte del contexto, y se vuelve
  incómoda cuando hay varios contextos (auth, inventario, alquileres). Habría que
  montar la persistencia manualmente.
- **Redux (Redux Toolkit):** muy potente y estándar en proyectos grandes, pero
  introduce bastante código repetitivo (actions, reducers, store, providers) que
  resulta desproporcionado para el tamaño de esta aplicación.

## Decisión razonada

Zustand ofrece el punto intermedio ideal para este proyecto:

- API mínima: un *store* se define con una sola función `create`.
- No necesita envolver la app en *providers*.
- Solo se re-renderizan los componentes que leen exactamente el dato que cambió.
- Su middleware `persist` integra la persistencia en AsyncStorage en pocas líneas,
  resolviendo el requisito de mantener la sesión entre reinicios.

```ts
export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({ /* estado y acciones */ }),
    { name: 'commoda-auth-storage',
      storage: createJSONStorage(() => AsyncStorage) }
  )
);
```

## Consecuencias

**Positivas**
- Mucho menos código repetitivo que Redux.
- Persistencia de sesión casi gratuita gracias a `persist`.
- Fácil de testear: los *stores* se prueban llamando a sus acciones, sin renderizar UI.

**Negativas**
- Menos herramientas de depuración avanzadas que el ecosistema de Redux (DevTools,
  middlewares complejos). No es una limitación para el alcance de este proyecto.
- Para un proyecto que creciera mucho en complejidad de estado, convendría
  reevaluar Redux Toolkit.
