import { View, Text, StyleSheet, TouchableOpacity, useColorScheme } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { Hardware } from '../../types';
import { Colors, Typography, Spacing, Radius, CategoryColors, StatusColors } from '../../constants/theme';

/**
 * Props del componente `HardwareCard`.
 */
interface Props {
  /** Equipo a mostrar. */
  item: Hardware;
  /**
   * Callback opcional invocado al pulsar la tarjeta.
   * En la pantalla de inventario solo se pasa si el equipo está disponible,
   * por lo que los equipos no disponibles resultan no interactivos.
   */
  onPress?: () => void;
  /**
   * Índice del elemento en la lista. Se usa para escalonar la animación de
   * entrada (cada tarjeta aparece con un pequeño retraso respecto a la anterior).
   */
  index?: number;
}

/**
 * Mapa de categoría → nombre del ícono Ionicons.
 * Se usa para representar visualmente el tipo de equipo en el contenedor de ícono.
 */
const CATEGORY_ICON: Record<string, React.ComponentProps<typeof Ionicons>['name']> = {
  LAPTOP: 'laptop-outline',
  TABLET: 'tablet-portrait-outline',
  PERIPHERAL: 'hardware-chip-outline',
};

/**
 * Etiquetas legibles en español para cada estado de hardware.
 * Se muestran en el badge inferior derecho de la tarjeta.
 */
const STATUS_LABEL: Record<string, string> = {
  AVAILABLE: 'Disponible',
  RENTED: 'Alquilado',
  MAINTENANCE: 'Mantenimiento',
};

/**
 * Tarjeta de hardware para la pantalla de inventario.
 *
 * Muestra en una fila horizontal:
 * - **Ícono de categoría** con fondo semitransparente del color de la categoría
 *   (extraído de `CategoryColors`).
 * - **Nombre del modelo** (truncado a una línea).
 * - **Especificaciones técnicas** (máx. 2 líneas).
 * - **Precio diario** alineado a la izquierda del pie.
 * - **Badge de estado** alineado a la derecha del pie, con fondo semitransparente
 *   del color del estado (extraído de `StatusColors`).
 *
 * El color del ícono y del badge se obtienen de `CategoryColors` y `StatusColors`
 * respectivamente, con el color primario del tema como fallback.
 *
 * ### Animación de entrada
 * La tarjeta entra con un efecto `FadeInDown` (aparece desvaneciéndose y
 * deslizándose desde abajo) escalonado según su `index`, dando una sensación
 * fluida al cargar la lista. La animación corre en el hilo de UI nativo
 * gracias a Reanimated.
 *
 * @param item    - Equipo a renderizar.
 * @param onPress - Acción al pulsar la tarjeta (normalmente abre el modal de alquiler).
 * @param index   - Posición en la lista, usada para escalonar la animación.
 */
export function HardwareCard({ item, onPress, index = 0 }: Props) {
  const scheme = useColorScheme();
  const theme = Colors[scheme ?? 'light'];
  const categoryColor = CategoryColors[item.category] ?? theme.primary;
  const statusColor = StatusColors[item.status] ?? theme.textSecondary;

  return (
    <Animated.View entering={FadeInDown.delay(Math.min(index, 10) * 50).springify().damping(18)}>
      <TouchableOpacity style={[s.card, { backgroundColor: theme.card, borderColor: theme.border }]} onPress={onPress} activeOpacity={0.7}>
        <View style={[s.iconContainer, { backgroundColor: categoryColor + '20' }]}>
          <Ionicons name={CATEGORY_ICON[item.category] ?? 'cube-outline'} size={28} color={categoryColor} />
        </View>

        <View style={s.content}>
          <Text style={[s.model, { color: theme.text }]} numberOfLines={1}>{item.model}</Text>
          <Text style={[s.specs, { color: theme.textSecondary }]} numberOfLines={2}>{item.specs}</Text>
          <View style={s.footer}>
            <Text style={[s.price, { color: theme.primary }]}>{item.dailyRate}€/día</Text>
            <View style={[s.badge, { backgroundColor: statusColor + '20' }]}>
              <Text style={[s.badgeText, { color: statusColor }]}>{STATUS_LABEL[item.status]}</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

const s = StyleSheet.create({
  card: {
    flexDirection: 'row', borderRadius: Radius.md, borderWidth: 1,
    padding: Spacing.md, marginHorizontal: Spacing.lg, marginVertical: Spacing.xs, gap: Spacing.md,
  },
  iconContainer: { width: 52, height: 52, borderRadius: Radius.sm, alignItems: 'center', justifyContent: 'center' },
  content: { flex: 1, gap: Spacing.xs },
  model: { fontSize: Typography.md, fontWeight: '600' },
  specs: { fontSize: Typography.xs },
  footer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: Spacing.xs },
  price: { fontSize: Typography.sm, fontWeight: '700' },
  badge: { paddingHorizontal: Spacing.sm, paddingVertical: 2, borderRadius: Radius.full },
  badgeText: { fontSize: Typography.xs, fontWeight: '600' },
});
