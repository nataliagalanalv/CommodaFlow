import { useCallback, useState, useMemo } from 'react';
import { useFocusEffect } from 'expo-router';
import {
  View, Text, TextInput, StyleSheet, useColorScheme,
  TouchableOpacity, Alert, ScrollView, ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRentalStore } from '../../store/rentalStore';
import { useAuthStore } from '../../store/authStore';
import { Colors, Theme, Typography, Spacing, Radius, StatusColors, CategoryColors } from '../../constants/theme';
import { API_URL } from '../../constants/api';
import { Rental, RentalStatus } from '../../types';

// ── Tipos de filtro ────────────────────────────────────────────────────────────

type PriceRange = 'all' | 'under25' | '25-50' | '50-100' | 'over100';
type HistoryStatus = RentalStatus | 'all';
type CategoryFilter = 'LAPTOP' | 'TABLET' | 'PERIPHERAL' | 'all';

// ── Opciones de filtro ─────────────────────────────────────────────────────────

const HISTORY_STATUS_OPTIONS: { value: HistoryStatus; label: string }[] = [
  { value: 'all', label: 'Todos' },
  { value: 'RETURNED', label: 'Devuelto' },
  { value: 'OVERDUE', label: 'Vencido' },
  { value: 'COMPLETED', label: 'Completado' },
];

const CATEGORY_OPTIONS: { value: CategoryFilter; label: string }[] = [
  { value: 'all', label: 'Todos' },
  { value: 'LAPTOP', label: 'Portátil' },
  { value: 'TABLET', label: 'Tablet' },
  { value: 'PERIPHERAL', label: 'Periférico' },
];

const PRICE_OPTIONS: { value: PriceRange; label: string }[] = [
  { value: 'all', label: 'Todos' },
  { value: 'under25', label: '<25€' },
  { value: '25-50', label: '25-50€' },
  { value: '50-100', label: '50-100€' },
  { value: 'over100', label: '>100€' },
];

// ── Helpers ────────────────────────────────────────────────────────────────────

const STATUS_LABEL: Record<string, string> = {
  RENTED: 'Activo', RETURNED: 'Devuelto', OVERDUE: 'Vencido',
  PENDING: 'Pendiente', COMPLETED: 'Completado',
};

const CATEGORY_ICON: Record<string, React.ComponentProps<typeof Ionicons>['name']> = {
  LAPTOP: 'laptop-outline',
  TABLET: 'tablet-portrait-outline',
  PERIPHERAL: 'hardware-chip-outline',
};

function matchesPrice(rate: number, range: PriceRange): boolean {
  if (range === 'all') return true;
  if (range === 'under25') return rate < 25;
  if (range === '25-50') return rate >= 25 && rate <= 50;
  if (range === '50-100') return rate > 50 && rate <= 100;
  return rate > 100;
}

// ── FilterChips (idéntico al de inventario) ────────────────────────────────────

function FilterChips<T extends string>({
  options, selected, onSelect, theme,
}: { options: { value: T; label: string }[]; selected: T; onSelect: (v: T) => void; theme: Theme }) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.chipsRow}>
      {options.map((opt) => {
        const active = selected === opt.value;
        return (
          <TouchableOpacity
            key={opt.value}
            style={[s.chip, active
              ? { backgroundColor: theme.primary }
              : { backgroundColor: theme.surface, borderColor: theme.border, borderWidth: 1 }]}
            onPress={() => onSelect(opt.value)}
          >
            <Text style={[s.chipText, { color: active ? '#fff' : theme.textSecondary }]}>
              {opt.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

// ── Tarjeta alquiler activo ────────────────────────────────────────────────────

function ActiveCard({ rental, onReturn, theme }: {
  rental: Rental; onReturn: (id: string) => void; theme: Theme;
}) {
  const cat = rental.hardware?.category ?? '';
  const categoryIcon = CATEGORY_ICON[cat] ?? 'cube-outline';
  const categoryColor = CategoryColors[cat as keyof typeof CategoryColors] ?? theme.primary;

  const daysLeft = rental.endDate
    ? Math.ceil((new Date(rental.endDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    : null;

  const dayColor = daysLeft === null
    ? theme.textSecondary
    : daysLeft < 0 ? theme.danger
    : daysLeft <= 2 ? theme.warning
    : theme.textSecondary;

  const dayLabel = daysLeft === null
    ? ''
    : daysLeft < 0 ? `Vencido hace ${Math.abs(daysLeft)}d`
    : daysLeft === 0 ? 'Vence hoy'
    : `Vence en ${daysLeft}d`;

  return (
    <View style={[ac.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
      <View style={[ac.icon, { backgroundColor: categoryColor + '20' }]}>
        <Ionicons name={categoryIcon} size={22} color={categoryColor} />
      </View>

      <View style={{ flex: 1 }}>
        <Text style={[ac.model, { color: theme.text }]} numberOfLines={1}>
          {rental.hardware?.model ?? 'Equipo'}
        </Text>
        <Text style={[ac.dates, { color: theme.textSecondary }]}>
          {new Date(rental.startDate).toLocaleDateString('es-ES')}
          {' → '}
          {new Date(rental.endDate).toLocaleDateString('es-ES')}
        </Text>
        {dayLabel ? (
          <Text style={[ac.daysLeft, { color: dayColor }]}>{dayLabel}</Text>
        ) : null}
      </View>

      <TouchableOpacity
        style={[ac.btn, { backgroundColor: theme.primary }]}
        onPress={() => onReturn(rental.id)}
      >
        <Text style={ac.btnText}>Devolver</Text>
      </TouchableOpacity>
    </View>
  );
}

// ── Tarjeta historial ──────────────────────────────────────────────────────────

function HistoryCard({ rental, theme }: { rental: Rental; theme: Theme }) {
  const statusColor = StatusColors[rental.status] ?? theme.textSecondary;
  const cat = rental.hardware?.category ?? '';
  const categoryIcon = CATEGORY_ICON[cat] ?? 'cube-outline';
  const categoryColor = CategoryColors[cat as keyof typeof CategoryColors] ?? theme.primary;

  return (
    <View style={[hc.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
      <View style={hc.top}>
        <View style={[hc.icon, { backgroundColor: categoryColor + '15' }]}>
          <Ionicons name={categoryIcon} size={18} color={categoryColor} />
        </View>
        <Text style={[hc.model, { color: theme.text }]} numberOfLines={1}>
          {rental.hardware?.model ?? 'Equipo'}
        </Text>
        <View style={[hc.badge, { backgroundColor: statusColor + '20' }]}>
          <Text style={[hc.badgeText, { color: statusColor }]}>{STATUS_LABEL[rental.status]}</Text>
        </View>
      </View>
      <View style={hc.meta}>
        <Text style={[hc.info, { color: theme.textSecondary }]}>
          {new Date(rental.startDate).toLocaleDateString('es-ES')}
          {' → '}
          {new Date(rental.endDate).toLocaleDateString('es-ES')}
        </Text>
        <Text style={[hc.cost, { color: theme.primary }]}>
          {(rental.totalCost ?? 0).toFixed(2)}€
        </Text>
      </View>
    </View>
  );
}

// ── Pantalla principal ─────────────────────────────────────────────────────────

export default function AlquileresScreen() {
  const scheme = useColorScheme();
  const theme = Colors[scheme ?? 'light'];

  const { items, setItems, setLoading, setError, isLoading, error } = useRentalStore();
  const token = useAuthStore((s) => s.token);
  const user = useAuthStore((s) => s.user);

  const [search, setSearch] = useState('');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<HistoryStatus>('all');
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('all');
  const [priceFilter, setPriceFilter] = useState<PriceRange>('all');

  const activeFilterCount = [statusFilter, categoryFilter, priceFilter].filter(f => f !== 'all').length;

  // ── Fetch ────────────────────────────────────────────────────────────────────

  const fetchRentals = useCallback(async () => {
    if (!user?.id) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/api/rentals?userId=${user.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Error al cargar alquileres');
      const data: Rental[] = await res.json();
      setItems(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error de red');
    } finally {
      setLoading(false);
    }
  }, [token, user?.id]);

  useFocusEffect(useCallback(() => { fetchRentals(); }, [fetchRentals]));

  // ── Devolución ───────────────────────────────────────────────────────────────

  async function handleReturn(rentalId: string) {
    Alert.alert('Registrar devolución', '¿Confirmas la devolución del equipo?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Confirmar',
        onPress: async () => {
          try {
            const res = await fetch(`${API_URL}/api/rentals/${rentalId}/return`, {
              method: 'PATCH',
              headers: { Authorization: `Bearer ${token}` },
            });
            if (!res.ok) throw new Error();
            await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            fetchRentals(); // recarga para mover de activos → historial
          } catch {
            Alert.alert('Error', 'No se pudo registrar la devolución');
          }
        },
      },
    ]);
  }

  // ── Datos derivados ──────────────────────────────────────────────────────────

  const activeRentals = useMemo(
    () => items.filter((r) => r.status === 'RENTED'),
    [items]
  );

  const historyRentals = useMemo(() => {
    const q = search.toLowerCase();
    return items
      .filter((r) => r.status !== 'RENTED')
      .filter((r) => {
        const matchSearch = !q || (r.hardware?.model ?? '').toLowerCase().includes(q);
        const matchStatus = statusFilter === 'all' || r.status === statusFilter;
        const matchCategory = categoryFilter === 'all' || r.hardware?.category === categoryFilter;
        const matchPrice = matchesPrice(r.hardware?.dailyRate ?? 0, priceFilter);
        return matchSearch && matchStatus && matchCategory && matchPrice;
      });
  }, [items, search, statusFilter, categoryFilter, priceFilter]);

  // ── Render ───────────────────────────────────────────────────────────────────

  return (
    <SafeAreaView style={[s.container, { backgroundColor: theme.background }]} edges={['top']}>

      {/* Header */}
      <View style={[s.header, { backgroundColor: theme.surface, borderBottomColor: theme.border }]}>
        <View>
          <Text style={[s.title, { color: theme.text }]}>Mi Actividad</Text>
          <Text style={[s.subtitle, { color: theme.textSecondary }]}>
            {activeRentals.length} activo{activeRentals.length !== 1 ? 's' : ''}
          </Text>
        </View>
        {isLoading && <ActivityIndicator size="small" color={theme.primary} />}
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: Spacing['2xl'] }}>

        {/* ── Sección: Alquileres en curso ─────────────────────────────────── */}
        <View style={s.section}>
          <View style={s.sectionHeader}>
            <View style={[s.dot, { backgroundColor: theme.success }]} />
            <Text style={[s.sectionTitle, { color: theme.textSecondary }]}>
              ALQUILERES EN CURSO ({activeRentals.length})
            </Text>
          </View>

          {isLoading && activeRentals.length === 0 ? (
            <View style={[s.emptyBox, { backgroundColor: theme.surface, borderColor: theme.border }]}>
              <ActivityIndicator color={theme.primary} />
            </View>
          ) : activeRentals.length > 0 ? (
            activeRentals.map((r) => (
              <ActiveCard key={r.id} rental={r} onReturn={handleReturn} theme={theme} />
            ))
          ) : (
            <View style={[s.emptyBox, { backgroundColor: theme.surface, borderColor: theme.border }]}>
              <Ionicons name="checkmark-circle-outline" size={32} color={theme.textSecondary} />
              <Text style={[s.emptyText, { color: theme.textSecondary }]}>
                No tienes alquileres activos
              </Text>
            </View>
          )}
        </View>

        {/* Divisor */}
        <View style={[s.divider, { backgroundColor: theme.border }]} />

        {/* ── Sección: Historial ───────────────────────────────────────────── */}
        <View style={s.section}>

          {/* Cabecera historial + botón filtros */}
          <View style={s.historyHeader}>
            <Text style={[s.sectionTitle, { color: theme.textSecondary }]}>
              HISTORIAL ({historyRentals.length})
            </Text>
            <TouchableOpacity
              style={[s.filterBtn, {
                backgroundColor: activeFilterCount > 0 ? theme.primary : theme.primaryLight,
              }]}
              onPress={() => setFiltersOpen(!filtersOpen)}
            >
              <Ionicons
                name="options-outline"
                size={16}
                color={activeFilterCount > 0 ? '#fff' : theme.primary}
              />
              {activeFilterCount > 0 && (
                <Text style={s.filterBadge}>{activeFilterCount}</Text>
              )}
              <Ionicons
                name={filtersOpen ? 'chevron-up' : 'chevron-down'}
                size={14}
                color={activeFilterCount > 0 ? '#fff' : theme.primary}
              />
            </TouchableOpacity>
          </View>

          {/* Barra de búsqueda */}
          <View style={[s.searchRow, { backgroundColor: theme.surface, borderColor: theme.border }]}>
            <Ionicons name="search-outline" size={16} color={theme.textSecondary} />
            <TextInput
              style={[s.searchInput, { color: theme.text }]}
              placeholder="Buscar por equipo..."
              placeholderTextColor={theme.textSecondary}
              value={search}
              onChangeText={setSearch}
            />
            {search.length > 0 && (
              <TouchableOpacity onPress={() => setSearch('')}>
                <Ionicons name="close-circle" size={16} color={theme.textSecondary} />
              </TouchableOpacity>
            )}
          </View>

          {/* Panel de filtros desplegable */}
          {filtersOpen && (
            <View style={[s.filtersPanel, { backgroundColor: theme.surface, borderColor: theme.border }]}>
              <Text style={[s.filterLabel, { color: theme.textSecondary }]}>Estado</Text>
              <FilterChips
                options={HISTORY_STATUS_OPTIONS}
                selected={statusFilter}
                onSelect={setStatusFilter}
                theme={theme}
              />
              <Text style={[s.filterLabel, { color: theme.textSecondary }]}>Categoría</Text>
              <FilterChips
                options={CATEGORY_OPTIONS}
                selected={categoryFilter}
                onSelect={setCategoryFilter}
                theme={theme}
              />
              <Text style={[s.filterLabel, { color: theme.textSecondary }]}>Precio/día</Text>
              <FilterChips
                options={PRICE_OPTIONS}
                selected={priceFilter}
                onSelect={setPriceFilter}
                theme={theme}
              />
              <TouchableOpacity
                onPress={() => {
                  setStatusFilter('all');
                  setCategoryFilter('all');
                  setPriceFilter('all');
                }}
                style={s.clearBtn}
              >
                <Text style={[s.clearBtnText, { color: theme.danger }]}>Limpiar filtros</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Error */}
          {error && (
            <View style={[s.errorBanner, { backgroundColor: theme.danger + '20' }]}>
              <Text style={{ color: theme.danger, fontSize: Typography.sm, flex: 1 }}>{error}</Text>
              <TouchableOpacity onPress={fetchRentals}>
                <Text style={{ color: theme.danger, fontWeight: '700', fontSize: Typography.sm }}>
                  Reintentar
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Lista historial */}
          {historyRentals.length === 0 ? (
            <View style={[s.emptyBox, { backgroundColor: theme.surface, borderColor: theme.border }]}>
              <Ionicons name="receipt-outline" size={32} color={theme.textSecondary} />
              <Text style={[s.emptyText, { color: theme.textSecondary }]}>
                {search || activeFilterCount > 0
                  ? 'Sin resultados con estos filtros'
                  : 'No hay registros en el historial'}
              </Text>
            </View>
          ) : (
            historyRentals.map((r) => <HistoryCard key={r.id} rental={r} theme={theme} />)
          )}

        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// ── Estilos tarjeta activa ─────────────────────────────────────────────────────

const ac = StyleSheet.create({
  card: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.sm,
    borderRadius: Radius.md, borderWidth: 1,
    padding: Spacing.md, marginBottom: Spacing.sm,
  },
  icon: {
    width: 46, height: 46, borderRadius: Radius.sm,
    alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  model: { fontSize: Typography.sm, fontWeight: '700' },
  dates: { fontSize: Typography.xs, marginTop: 2 },
  daysLeft: { fontSize: Typography.xs, fontWeight: '700', marginTop: 2 },
  btn: { paddingHorizontal: Spacing.md, paddingVertical: Spacing.xs, borderRadius: Radius.md, flexShrink: 0 },
  btnText: { color: '#fff', fontSize: Typography.xs, fontWeight: '700' },
});

// ── Estilos tarjeta historial ──────────────────────────────────────────────────

const hc = StyleSheet.create({
  card: { borderRadius: Radius.md, borderWidth: 1, padding: Spacing.md, marginBottom: Spacing.sm },
  top: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  icon: {
    width: 32, height: 32, borderRadius: Radius.sm,
    alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  model: { fontSize: Typography.sm, fontWeight: '600', flex: 1 },
  badge: { paddingHorizontal: Spacing.sm, paddingVertical: 2, borderRadius: Radius.full },
  badgeText: { fontSize: Typography.xs, fontWeight: '600' },
  meta: { flexDirection: 'row', justifyContent: 'space-between', marginTop: Spacing.sm },
  info: { fontSize: Typography.xs },
  cost: { fontSize: Typography.xs, fontWeight: '700' },
});

// ── Estilos pantalla ───────────────────────────────────────────────────────────

const s = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: Spacing.lg, paddingVertical: Spacing.md, borderBottomWidth: 1,
  },
  title: { fontSize: Typography['2xl'], fontWeight: '700' },
  subtitle: { fontSize: Typography.xs, marginTop: 2 },
  section: { paddingHorizontal: Spacing.lg, paddingTop: Spacing.lg },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: Spacing.xs, marginBottom: Spacing.md },
  sectionTitle: { fontSize: Typography.xs, fontWeight: '700', letterSpacing: 1.2 },
  dot: { width: 8, height: 8, borderRadius: 4 },
  divider: { height: 1, marginHorizontal: Spacing.lg, marginTop: Spacing.lg },
  emptyBox: {
    borderRadius: Radius.md, borderWidth: 1, borderStyle: 'dashed',
    padding: Spacing.xl, alignItems: 'center', gap: Spacing.sm,
  },
  emptyText: { fontSize: Typography.sm, textAlign: 'center' },
  // Historial header
  historyHeader: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: Spacing.md,
  },
  filterBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    paddingHorizontal: Spacing.sm, paddingVertical: 6, borderRadius: Radius.full,
  },
  filterBadge: { fontSize: Typography.xs, color: '#fff', fontWeight: '700' },
  // Búsqueda
  searchRow: {
    flexDirection: 'row', alignItems: 'center', borderRadius: Radius.md, borderWidth: 1,
    paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm,
    gap: Spacing.sm, marginBottom: Spacing.sm,
  },
  searchInput: { flex: 1, fontSize: Typography.sm },
  // Panel filtros
  filtersPanel: {
    borderRadius: Radius.md, borderWidth: 1,
    paddingHorizontal: Spacing.md, paddingTop: Spacing.sm,
    paddingBottom: Spacing.md, marginBottom: Spacing.sm, gap: 4,
  },
  filterLabel: { fontSize: Typography.xs, fontWeight: '600', marginTop: 4 },
  chipsRow: { flexDirection: 'row', gap: Spacing.xs, paddingVertical: 4 },
  chip: { paddingHorizontal: Spacing.md, paddingVertical: 5, borderRadius: Radius.full },
  chipText: { fontSize: Typography.xs, fontWeight: '500' },
  clearBtn: { alignSelf: 'flex-end', marginTop: Spacing.xs },
  clearBtnText: { fontSize: Typography.xs, fontWeight: '600' },
  // Error
  errorBanner: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    padding: Spacing.md, borderRadius: Radius.sm, marginBottom: Spacing.md,
  },
});
