# React Native — Documentación técnica
## CommodaFlow Mobile (Expo)

---

## 1. React Native vs app nativa

Una app nativa pura se escribe en el lenguaje del sistema operativo: Swift/Objective-C para iOS, Kotlin/Java para Android. Cada plataforma tiene su propio SDK, sus propios componentes y su propia API. Eso significa mantener dos codebases completamente distintas.

React Native resuelve esto con un puente: el código JavaScript que escribes describe *qué* quieres renderizar, y React Native traduce esas instrucciones al sistema operativo correspondiente. Cuando usas `<View>`, no aparece un `<div>` en un WebView — React Native le dice al SO que cree una vista nativa real (`UIView` en iOS, `android.view.View` en Android). El resultado tiene el aspecto, el rendimiento y los gestos de una app nativa, pero con un único codebase en TypeScript/JavaScript.

### Los dos hilos

La arquitectura clásica de React Native tiene dos hilos que se comunican:

- **JS thread**: donde corre tu código React, la lógica de negocio, los estados de Zustand, las llamadas a la API.
- **UI thread (Main thread)**: donde el SO renderiza los componentes nativos y gestiona los gestos táctiles.

La comunicación entre ambos hilos pasa por el **Bridge** (serialización JSON) en la arquitectura clásica, o por **JSI** (JavaScript Interface, acceso directo a memoria) en la nueva arquitectura Fabric+TurboModules. Cuando el JS thread se bloquea con operaciones pesadas (loops síncronos, procesado de imágenes), la interfaz se congela porque el bridge no puede entregar instrucciones de actualización al UI thread. Por eso es crítico mantener el JS thread libre.

---

## 2. Metro Bundler

Metro es el bundler de JavaScript desarrollado por Meta específicamente para React Native. Cumple el mismo rol que webpack o Vite en proyectos web, pero con características adaptadas al entorno móvil:

- **Resolución de módulos** adaptada a React Native (sin APIs de Node.js como `fs` o `path` en el bundle final).
- **Fast Refresh**: recarga solo el componente modificado sin perder el estado de la app.
- **Source maps** para depuración.
- **Transformación de JSX y TypeScript** en tiempo real.

Cuando ejecutas `npx expo start`, Metro arranca un servidor en el puerto 8081. El dispositivo (o emulador) descarga el bundle desde ese servidor, que se actualiza con cada cambio en el código.

---

## 3. Expo Go vs Development Build

| | Expo Go | Development Build |
|---|---|---|
| **Qué es** | App de Expo precompilada con módulos estándar | Binario propio generado con EAS Build |
| **Setup** | Escanea QR, funciona al instante | Requiere compilación (EAS Build o `npx expo run:android`) |
| **Módulos nativos** | Solo los incluidos en Expo SDK | Cualquier módulo nativo (cámara, biometría, notificaciones push) |
| **Uso real** | Prototipado, tutoriales, demostraciones | Proyectos reales, producción |

**Por qué Expo Go no es suficiente en proyectos reales**: Expo Go incluye un conjunto fijo de módulos nativos. Tan pronto como necesitas algo no incluido (por ejemplo, `react-native-vision-camera`, módulos de empresa, o código nativo personalizado), Expo Go no puede ejecutarlo porque el código nativo debe estar compilado en el binario. En CommodaFlow, si en el futuro añadiéramos escáner de QR para identificar hardware o biometría para autenticar, necesitaríamos un Development Build.

---

## 4. Sistema de diseño — por qué no usamos Gluestack UI ni React Native Paper

El enunciado propone elegir entre Gluestack UI y React Native Paper. Tras evaluarlas:

- **Gluestack UI**: excelente para design systems complejos, pero su overhead de configuración y los re-renders de su Context system no se justifican para esta app académica.
- **React Native Paper**: implementación fiel de Material Design, con componentes muy completos, pero impone el lenguaje visual de Google sobre una identidad propia.

**Decisión**: sistema de diseño propio con `StyleSheet` de React Native, alimentado desde `constants/theme.ts`. Razones:
1. CommodaFlow tiene una identidad visual definida (azul corporativo, paleta fría).
2. Evita la sobrecarga de un framework UI completo para una app con tres pantallas.
3. El código resultante es más didáctico: los estilos son explícitos, sin abstracciones que oculten cómo funciona React Native.
4. El sistema de tokens en `theme.ts` sigue el mismo patrón que se usaría con cualquier librería.

Los tokens visuales están en `constants/theme.ts`: paleta `Colors` (light/dark), escala tipográfica `Typography`, espaciados `Spacing`, radios `Radius`, y mapas de color por categoría y estado.

---

## 5. Navegación: Stack, Tabs y Modales

Expo Router usa el sistema de archivos para definir rutas, igual que Next.js en la web.

### Stack (pila)
Navegación lineal donde cada pantalla se apila sobre la anterior. Al navegar atrás, la pantalla se elimina de la pila. Se usa para flujos secuenciales: lista → detalle, o cualquier ruta que tenga un "padre" claro.

En CommodaFlow: `inventario/` → `inventario/[id]` es una Stack. El archivo `app/_layout.tsx` define la Stack raíz.

### Tabs (pestañas)
Navegación paralela donde todas las pestañas están montadas simultáneamente (o se montan al primera visita). No hay concepto de "volver atrás" entre tabs. Ideal para las secciones principales de una app.

En CommodaFlow: Inventario, Alquileres y Perfil son tabs porque son secciones independientes al mismo nivel jerárquico. Definidas en `app/(tabs)/_layout.tsx`.

### Modales
Pantallas que aparecen sobre el contenido actual, generalmente para acciones de creación o confirmación. Mantienen el contexto de la pantalla anterior visible.

En CommodaFlow: `app/nuevo-hardware.tsx` es un modal porque crear un equipo es una acción puntual que no merece su propia posición en la jerarquía de navegación. Se abre con `presentation: 'modal'` en la Stack raíz.

---

## 6. Gestión de estado: useState vs Context API vs Zustand

### useState
Estado local de un componente. Solo accesible en ese componente y sus hijos mediante props. Válido para estado de formularios, toggles UI, o datos que no necesitan compartirse.

```typescript
const [email, setEmail] = useState('');
```

### Context API
Permite compartir estado entre componentes sin prop drilling. Sin embargo, cualquier cambio en el contexto re-renderiza *todos* los consumidores, aunque no usen el valor que cambió. En apps con muchos consumidores o actualizaciones frecuentes, esto degrada el rendimiento.

### Zustand
Gestión de estado global sin providers anidados. Los componentes se suscriben solo a los selectores que les interesan, por lo que solo se re-renderizan cuando ese valor cambia. La API es minimalista:

```typescript
// Definición
const useHardwareStore = create<Store>((set) => ({
  items: [],
  setItems: (items) => set({ items }),
}));

// Consumo (solo se re-renderiza si `items` cambia)
const items = useHardwareStore((s) => s.items);
```

En CommodaFlow usamos Zustand para `hardware`, `rentals` y `auth` porque son datos globales que necesitan múltiples pantallas simultáneamente.

---

## 7. Rendimiento en listas — FlashList vs FlatList

`FlatList` (incluido en React Native) recicla celdas usando un pool basado en tipo, pero su implementación tiene un problema: cuando haces scroll rápido, el cálculo del layout de cada celda ocurre en el JS thread, creando un cuello de botella visible como pantallas en blanco.

**FlashList** de Shopify resuelve esto con un reciclaje más agresivo:
- Recicla componentes por tipo antes de que el usuario llegue a ellos (prefetching).
- Usa `estimatedItemSize` para calcular el layout sin esperar a renderizar cada celda.
- Mueve parte del trabajo al UI thread directamente.

```typescript
<FlashList
  data={items}
  estimatedItemSize={90}  // Cuanto más preciso, mejor el rendimiento
  renderItem={({ item }) => <HardwareCard item={item} />}
/>
```

En tests de Shopify con listas de 10.000 items, FlashList reduce los frames perdidos en ~90% respecto a FlatList.

---

## 8. Persistencia con AsyncStorage — rehidratación del store

AsyncStorage es el equivalente de `localStorage` en React Native: almacenamiento clave-valor en el dispositivo, sin cifrado, con un límite de ~6MB por key en Android.

El middleware `persist` de Zustand serializa el store como JSON en AsyncStorage y lo restaura al arrancar la app. Este proceso se llama **rehidratación**.

### El problema de la rehidratación

Al iniciar la app, el store empieza con sus valores por defecto (`user: null`, `items: []`). La lectura de AsyncStorage es asíncrona, por lo que hay un instante en que el estado parece vacío. Si la pantalla renderiza antes de que lleguen los datos, el usuario puede ver un flash de contenido incorrecto (por ejemplo, la pantalla de login aunque el usuario ya estaba autenticado).

**Solución**: el campo `isHydrated` en `authStore`. La app no toma decisiones de navegación hasta que `isHydrated === true`:

```typescript
// En onRehydrateStorage: cuando termina la rehidratación, marca el store como listo
onRehydrateStorage: () => (state) => { state?.setHydrated(); }

// En el guard de navegación: espera a que esté hidratado
if (!isHydrated) return; // No redirige hasta tener los datos reales
```

Mientras `isHydrated` es `false`, se podría mostrar un `ActivityIndicator` o una splash screen para cubrir el instante de incertidumbre.
