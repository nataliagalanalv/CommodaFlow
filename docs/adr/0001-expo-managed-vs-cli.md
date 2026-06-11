# ADR 0001 — Expo Managed Workflow en lugar de React Native CLI

**Estado:** Aceptada
**Fecha:** 2026

## Contexto

Para la aplicación móvil de CommodaFlow había que elegir cómo construir un proyecto
React Native. Existen dos enfoques principales:

- **React Native CLI (bare workflow):** se trabaja directamente con los proyectos
  nativos de Android (Gradle/Kotlin) e iOS (Xcode/Swift). Da control total, pero
  exige conocer y mantener la configuración nativa, y compilar en local (para iOS
  hace falta un Mac).
- **Expo Managed Workflow:** Expo gestiona la parte nativa por ti. Accedes a las
  funciones del dispositivo (notificaciones, gestos, cámara…) mediante librerías
  de Expo, y compilas en la nube con EAS Build.

El proyecto se desarrolla en **Windows**, sin acceso a un Mac, y el objetivo del
ciclo es entregar una app multiplataforma funcional, no dominar la configuración
nativa de bajo nivel.

## Decisión

Usar **Expo Managed Workflow** con **EAS Build** para generar los binarios.

## Alternativas consideradas

- **React Native CLI (bare):** descartada porque obliga a gestionar manualmente la
  configuración nativa de Android e iOS, y compilar iOS requiere un Mac, del que no
  se dispone. Añade complejidad que no aporta valor al objetivo del proyecto.

## Consecuencias

**Positivas**
- Desarrollo mucho más rápido: no hay que tocar código nativo.
- Acceso sencillo a funciones del dispositivo mediante librerías de Expo
  (`expo-notifications`, `react-native-gesture-handler`, etc.).
- Compilación en la nube con EAS, sin necesidad de un Mac para iOS.
- Mismo flujo de trabajo en cualquier sistema operativo.

**Negativas**
- Menos control de bajo nivel sobre la capa nativa (asumible para este proyecto).
- Al introducir librerías con código nativo, **Expo Go deja de servir** y hay que
  generar un **Development Build** con EAS. Es un paso adicional, pero solo se
  repite cuando se añade una librería nativa nueva.
- Dependencia de la cola de compilación del plan gratuito de EAS (tiempos de espera).

## Notas

Esta decisión condicionó la Fase 9: al añadir Reanimated, Gesture Handler y
Notificaciones (todas con código nativo), fue necesario crear el Development Build
con EAS y dejar de usar Expo Go, tal como anticipa este ADR.
