import { View, Text, StyleSheet, TouchableOpacity, useColorScheme } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Hardware } from '../../types';
import { Colors, Typography, Spacing, Radius, CategoryColors, StatusColors } from '../../constants/theme';

interface Props {
  item: Hardware;
  onPress?: () => void;
}

const CATEGORY_ICON: Record<string, React.ComponentProps<typeof Ionicons>['name']> = {
  LAPTOP: 'laptop-outline',
  TABLET: 'tablet-portrait-outline',
  PERIPHERAL: 'hardware-chip-outline',
};

const STATUS_LABEL: Record<string, string> = {
  AVAILABLE: 'Disponible',
  RENTED: 'Alquilado',
  MAINTENANCE: 'Mantenimiento',
};

export function HardwareCard({ item, onPress }: Props) {
  const scheme = useColorScheme();
  const theme = Colors[scheme ?? 'light'];
  const categoryColor = CategoryColors[item.category] ?? theme.primary;
  const statusColor = StatusColors[item.status] ?? theme.textSecondary;

  return (
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
