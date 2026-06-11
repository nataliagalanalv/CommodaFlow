# Architecture Decision Records (ADRs)

Un **ADR** (Architecture Decision Record) es un documento corto que registra una
decisión técnica importante: el contexto en el que se tomó, la opción elegida,
las alternativas descartadas y sus consecuencias.

Sirven para que cualquier persona que llegue al proyecto entienda **por qué**
está construido así, en lugar de tener que adivinarlo leyendo el código.

## Índice de decisiones

| Nº | Decisión | Estado |
|----|----------|--------|
| [0001](0001-expo-managed-vs-cli.md) | Expo Managed Workflow en lugar de React Native CLI | Aceptada |
| [0002](0002-zustand-vs-redux-context.md) | Zustand en lugar de Redux o Context API | Aceptada |
| [0003](0003-firebase-auth-y-neon.md) | Firebase Auth + PostgreSQL (Neon) en lugar de todo en Firebase | Aceptada |

## Formato

Cada ADR sigue la misma estructura:

- **Contexto** — la situación y el problema a resolver.
- **Decisión** — qué se eligió.
- **Alternativas consideradas** — qué otras opciones se valoraron y por qué se descartaron.
- **Consecuencias** — ventajas e inconvenientes de la decisión.
