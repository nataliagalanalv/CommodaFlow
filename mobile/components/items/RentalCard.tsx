import { View, Text, StyleSheet, TouchableOpacity, useColorScheme } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Rental } from '../../types';
import { Colors, Typography, Spacing, Radius, StatusColors } from '../../constants/theme';

/**
 * Props del componente `RentalCard`.
 */
interface Props {
  /** Alquiler a mostrar. */
  item: Rental;
  /** Callback invocado al pulsar la tarjeta. */
  onPress: () => void;
}

/**
 * Etiquetas legibles en español para cada estado de alquiler.
 * Se muestran en el badge de estado de la cabecera de la tarjeta.
 */
const STATUS_LABEL: Record<string, string> = {
  RENTED: 'Activo',
  RETURNED: 'Devuelto',
  OVERDUE: 'Vencido',
  PENDING: 'Pendiente',
  COMPLETED: 'Completado',
};

/**
 * Calcula los días que restan hasta la fecha de fin del alquiler.
 *
 * Un resultado negativo indica que el plazo ya ha vencido.
 *
 * @param endDate - Fecha de fin del alquiler en formato ISO.
 * @returns Número de días restantes (negativo si vencido).
 */
function daysRemaining(endDate: string): number {
  const diff = new Date(endDate).getTime() - Date.now();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

/**
 * Tarjeta de alquiler para la pantalla de historial de la aplicación móvil.
 *
 * Muestra en estructura vertical:
 * - **Cabecera** — ícono de documento + modelo del equipo + badge de estado.
 * - **Cuerpo** — usuario que realizó el alquiler y rango de fechas.
 * - **Pie** — coste total y, si el alquiler está activo (`RENTED`), los días
 *   restantes (en rojo si ya venció).
 *
 * El color del badge de estado se extrae de `StatusColors` con el color
 * secundario del tema como fallback.
 *
 * El indicador de días restantes solo se muestra cuando `isActive` es `true`
 * (es decir, `status === 'RENTED'`), ya que para el historial no tiene sentido
 * mostrar un countdown de alquileres finalizados.
 *
 * @param item    - Alquiler a renderizar.
 * @param onPress - Acción al pulsar la tarjeta.
 */
export function RentalCard({ item, onPress }: Props) {
  const scheme = useColorScheme();
  const theme = Colors[scheme ?? 'light'];
  const statusColor = StatusColors[item.status] ?? theme.textSecondary;
  const days = daysRemaining(item.endDate);
  const isActive = item.status === 'RENTED';

  return (
    <TouchableOpacity style={[s.card, { backgroundColor: theme.card, borderColor: theme.border }]} onPress={onPress} activeOpacity={0.7}>
      <View style={s.header}>
        <View style={s.titleRow}>
          <Ionicons name="document-text-outline" size={18} color={theme.primary} />
          <Text style={[s.model, { color: theme.text }]} numberOfLines={1}>
            {item.hardware?.model ?? 'Equipo desconocido'}
          </Text>
        </View>
        <View style={[s.badge, { backgroundColor: statusColor + '20' }]}>
          <Text style={[s.badgeText, { color: statusColor }]}>{STATUS_LABEL[item.status]}</Text>
        </View>
      </View>

      <View style={s.body}>
        <View style={s.infoRow}>
          <Ionicons name="person-outline" size={14} color={theme.textSecondary} />
          <Text style={[s.info, { color: theme.textSecondary }]}>{item.user?.name ?? '-'}</Text>
        </View>
        <View style={s.infoRow}>
          <Ionicons name="calendar-outline" size={14} color={theme.textSecondary} />
          <Text style={[s.info, { color: theme.textSecondary }]}>
            {new Date(item.startDate).toLocaleDateString('es-ES')} → {new Date(item.endDate).toLocaleDateString('es-ES')}
          </Text>
        </View>
      </View>

      <View style={s.footer}>
        <Text style={[s.cost, { color: theme.primary }]}>{item.totalCost.toFixed(2)}€</Text>
        {isActive && (
          <Text style={[s.days, { color: days < 0 ? theme.danger : theme.textSecondary }]}>
            {days < 0 ? `Vencido hace ${Math.abs(days)}d` : `${days}d restantes`}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
}

const s = StyleSheet.create({
  card: { borderRadius: Radius.md, borderWidth: 1, padding: Spacing.md, marginHorizontal: Spacing.lg, marginVertical: Spacing.xs, gap: Spacing.sm },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.xs, flex: 1 },
  model: { fontSize: Typography.md, fontWeight: '600', flex: 1 },
  badge: { paddingHorizontal: Spacing.sm, paddingVertical: 2, borderRadius: Radius.full },
  badgeText: { fontSize: Typography.xs, fontWeight: '600' },
  body: { gap: Spacing.xs },
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.xs },
  info: { fontSize: Typography.xs },
  footer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cost: { fontSize: Typography.sm, fontWeight: '700' },
  days: { fontSize: Typography.xs },
});
