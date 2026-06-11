import { ReactNode } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  runOnJS,
  interpolate,
  Extrapolation,
} from 'react-native-reanimated';

/** Distancia (en px) que hay que deslizar para disparar la acción. */
const THRESHOLD = 90;

/**
 * Props del componente `SwipeableRow`.
 */
interface Props {
  /** Contenido de la fila (normalmente una tarjeta). */
  children: ReactNode;
  /** Acción a ejecutar cuando el usuario completa el deslizamiento. */
  onSwipe: () => void;
  /** Texto que aparece en el fondo revelado al deslizar. */
  actionLabel: string;
  /** Color de fondo de la zona de acción revelada. */
  actionColor: string;
  /** Ícono Ionicons mostrado en la zona de acción. */
  icon: React.ComponentProps<typeof Ionicons>['name'];
}

/**
 * Fila deslizable horizontalmente que revela una acción al arrastrar a la izquierda.
 *
 * Usa `react-native-gesture-handler` + Reanimated para mover el contenido en
 * tiempo real **en el hilo de UI nativo** (60 FPS, sin pasar por el hilo de JS).
 *
 * ### Comportamiento
 * - El usuario desliza la tarjeta hacia la izquierda.
 * - Si supera el umbral `THRESHOLD`, al soltar se ejecuta `onSwipe` y la
 *   tarjeta se desliza fuera de pantalla.
 * - Si no lo supera, la tarjeta vuelve a su posición con un rebote (`withSpring`).
 * - Detrás de la tarjeta se revela una zona de color con un ícono y etiqueta.
 *
 * `runOnJS` es necesario para llamar a `onSwipe` (función JS) desde el callback
 * del gesto, que se ejecuta en el hilo de UI.
 *
 * @param children    - Contenido de la fila.
 * @param onSwipe     - Callback al completar el deslizamiento.
 * @param actionLabel - Texto de la zona de acción.
 * @param actionColor - Color de fondo de la zona de acción.
 * @param icon        - Ícono de la zona de acción.
 */
export function SwipeableRow({ children, onSwipe, actionLabel, actionColor, icon }: Props) {
  const translateX = useSharedValue(0);

  // Mutar `translateX.value` es la API correcta de Reanimated para los "shared
  // values" dentro de un worklet de gesto. La regla react-hooks/immutability
  // (pensada para el React Compiler) no reconoce este patrón, por lo que se
  // desactiva de forma acotada solo en este bloque.
  /* eslint-disable react-hooks/immutability */
  const pan = Gesture.Pan()
    .activeOffsetX([-15, 15]) // solo activa el gesto en horizontal, no interfiere con el scroll vertical
    .onUpdate((e) => {
      // Solo permite deslizar hacia la izquierda (valores negativos)
      if (e.translationX < 0) {
        translateX.value = e.translationX;
      }
    })
    .onEnd(() => {
      if (translateX.value < -THRESHOLD) {
        // Superó el umbral: desliza fuera y ejecuta la acción
        translateX.value = withTiming(-500, { duration: 250 }, (finished) => {
          if (finished) runOnJS(onSwipe)();
        });
      } else {
        // No llegó: vuelve a su sitio con rebote
        translateX.value = withSpring(0);
      }
    });
  /* eslint-enable react-hooks/immutability */

  /** Estilo animado del contenido: se mueve horizontalmente según el gesto. */
  const cardStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  /** La zona de acción aparece gradualmente a medida que se desliza. */
  const actionStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      translateX.value,
      [-THRESHOLD, 0],
      [1, 0],
      Extrapolation.CLAMP
    ),
  }));

  return (
    <View style={s.container}>
      {/* Fondo revelado con la acción */}
      <Animated.View style={[s.action, { backgroundColor: actionColor }, actionStyle]}>
        <Ionicons name={icon} size={22} color="#fff" />
        <Text style={s.actionText}>{actionLabel}</Text>
      </Animated.View>

      {/* Contenido deslizable */}
      <GestureDetector gesture={pan}>
        <Animated.View style={cardStyle}>{children}</Animated.View>
      </GestureDetector>
    </View>
  );
}

const s = StyleSheet.create({
  container: { position: 'relative', justifyContent: 'center' },
  action: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: 120,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  actionText: { color: '#fff', fontSize: 12, fontWeight: '700' },
});
