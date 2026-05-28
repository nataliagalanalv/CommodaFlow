import { useCallback, useState, useMemo } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { View, Text, TextInput, StyleSheet, useColorScheme, TouchableOpacity, ScrollView } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { HardwareCard } from '../../components/items/HardwareCard';
import { RentalModal } from '../../components/RentalModal';
import { useHardwareStore } from '../../store/hardwareStore';
import { useAuthStore } from '../../store/authStore';
import { Colors, Theme, Typography, Spacing, Radius } from '../../constants/theme';
import { API_URL } from '../../constants/api';
import { Hardware, HardwareStatus, HardwareCategory } from '../../types';

type PriceRange = 'all' | 'under25' | '25-50' | '50-100' | 'over100';

const STATUS_OPTIONS: { value: HardwareStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'Todos' },
  { value: 'AVAILABLE', label: 'Disponible' },
  { value: 'RENTED', label: 'Alquilado' },
  { value: 'MAINTENANCE', label: 'Mantenimiento' },
];

const CATEGORY_OPTIONS: { value: HardwareCategory | 'all'; label: string }[] = [
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

function matchesPrice(rate: number, range: PriceRange): boolean {
  if (range === 'all') return true;
  if (range === 'under25') return rate < 25;
  if (range === '25-50') return rate >= 25 && rate <= 50;
  if (range === '50-100') return rate > 50 && rate <= 100;
  return rate > 100;
}

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
            <Text style={[s.chipText, { color: active ? '#fff' : theme.textSecondary }]}>{opt.label}</Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

export default function InventarioScreen() {
  const scheme = useColorScheme();
  const theme = Colors[scheme ?? 'light'];

  const { items, setItems, setLoading, setError, isLoading, error } = useHardwareStore();
  const token = useAuthStore((s) => s.token);
  const user = useAuthStore((s) => s.user);

  const [search, setSearch] = useState('');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [selectedHardware, setSelectedHardware] = useState<Hardware | null>(null);
  const [statusFilter, setStatusFilter] = useState<HardwareStatus | 'all'>('all');
  const [categoryFilter, setCategoryFilter] = useState<HardwareCategory | 'all'>('all');
  const [priceFilter, setPriceFilter] = useState<PriceRange>('all');

  const activeFilterCount = [statusFilter, categoryFilter, priceFilter].filter(f => f !== 'all').length;

  const fetchHardware = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/api/hardware`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Error al cargar el inventario');
      const data: Hardware[] = await res.json();
      setItems(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error de red');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useFocusEffect(useCallback(() => { fetchHardware(); }, [fetchHardware]));

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return items.filter((h) => {
      const matchSearch = !q || h.model.toLowerCase().includes(q) || h.specs.toLowerCase().includes(q);
      const matchStatus = statusFilter === 'all' || h.status === statusFilter;
      const matchCat = categoryFilter === 'all' || h.category === categoryFilter;
      const matchPrice = matchesPrice(h.dailyRate, priceFilter);
      return matchSearch && matchStatus && matchCat && matchPrice;
    });
  }, [items, search, statusFilter, categoryFilter, priceFilter]);

  return (
    <SafeAreaView style={[s.container, { backgroundColor: theme.background }]} edges={['top']}>
      <View style={[s.header, { backgroundColor: theme.surface, borderBottomColor: theme.border }]}>
        <Text style={[s.title, { color: theme.text }]}>Inventario</Text>
        <Text style={[s.count, { color: theme.textSecondary }]}>{filtered.length} equipos</Text>
      </View>

      {/* Barra de búsqueda + botón filtros */}
      <View style={[s.searchRow, { backgroundColor: theme.surface, borderBottomColor: filtersOpen ? 'transparent' : theme.border }]}>
        <Ionicons name="search-outline" size={18} color={theme.textSecondary} />
        <TextInput
          style={[s.searchInput, { color: theme.text }]}
          placeholder="Buscar modelo o especificaciones..."
          placeholderTextColor={theme.textSecondary}
          value={search}
          onChangeText={setSearch}
        />
        {search.length > 0 && (
          <TouchableOpacity onPress={() => setSearch('')}>
            <Ionicons name="close-circle" size={18} color={theme.textSecondary} />
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={[s.filterBtn, { backgroundColor: activeFilterCount > 0 ? theme.primary : theme.primaryLight }]}
          onPress={() => setFiltersOpen(!filtersOpen)}
        >
          <Ionicons name="options-outline" size={16} color={activeFilterCount > 0 ? '#fff' : theme.primary} />
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

      {/* Panel de filtros desplegable */}
      {filtersOpen && (
        <View style={[s.filtersContainer, { backgroundColor: theme.surface, borderBottomColor: theme.border }]}>
          <Text style={[s.filterLabel, { color: theme.textSecondary }]}>Estado</Text>
          <FilterChips options={STATUS_OPTIONS} selected={statusFilter} onSelect={setStatusFilter} theme={theme} />
          <Text style={[s.filterLabel, { color: theme.textSecondary }]}>Categoría</Text>
          <FilterChips options={CATEGORY_OPTIONS} selected={categoryFilter} onSelect={setCategoryFilter} theme={theme} />
          <Text style={[s.filterLabel, { color: theme.textSecondary }]}>Precio/día</Text>
          <FilterChips options={PRICE_OPTIONS} selected={priceFilter} onSelect={setPriceFilter} theme={theme} />
          <TouchableOpacity
            onPress={() => { setStatusFilter('all'); setCategoryFilter('all'); setPriceFilter('all'); }}
            style={s.clearBtn}
          >
            <Text style={[s.clearBtnText, { color: theme.danger }]}>Limpiar filtros</Text>
          </TouchableOpacity>
        </View>
      )}

      {error && (
        <View style={[s.errorBanner, { backgroundColor: theme.danger + '20' }]}>
          <Text style={{ color: theme.danger, fontSize: Typography.sm }}>{error}</Text>
          <TouchableOpacity onPress={fetchHardware}>
            <Text style={{ color: theme.danger, fontWeight: '700', fontSize: Typography.sm }}>Reintentar</Text>
          </TouchableOpacity>
        </View>
      )}

      <FlashList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
            <HardwareCard
              item={item}
              onPress={() => item.status === 'AVAILABLE' ? setSelectedHardware(item) : null}
            />
          )}
        contentContainerStyle={{ paddingVertical: Spacing.sm }}
        onRefresh={fetchHardware}
        refreshing={isLoading}
        ListEmptyComponent={
          <View style={s.empty}>
            <Ionicons name="laptop-outline" size={56} color={theme.textSecondary} />
            <Text style={[s.emptyText, { color: theme.textSecondary }]}>
              {search || statusFilter !== 'all' || categoryFilter !== 'all' || priceFilter !== 'all'
                ? 'Sin resultados con estos filtros'
                : 'No hay equipos registrados'}
            </Text>
          </View>
        }
      />
      <RentalModal
        item={selectedHardware}
        onClose={() => setSelectedHardware(null)}
        onSuccess={fetchHardware}
        userId={user?.id ?? ''}
        token={token ?? ''}
      />
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: Spacing.lg, paddingVertical: Spacing.md, borderBottomWidth: 1 },
  title: { fontSize: Typography['2xl'], fontWeight: '700' },
  count: { fontSize: Typography.sm },
  searchRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: Spacing.lg, paddingVertical: Spacing.sm, gap: Spacing.sm, borderBottomWidth: 1 },
  searchInput: { flex: 1, fontSize: Typography.md },
  filterBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: Spacing.sm, paddingVertical: 6, borderRadius: Radius.full },
  filterBadge: { fontSize: Typography.xs, color: '#fff', fontWeight: '700' },
  filtersContainer: { paddingHorizontal: Spacing.lg, paddingTop: Spacing.sm, paddingBottom: Spacing.md, borderBottomWidth: 1, gap: 4 },
  filterLabel: { fontSize: Typography.xs, fontWeight: '600', marginTop: 4, color: '#64748B' },
  chipsRow: { flexDirection: 'row', gap: Spacing.xs, paddingVertical: 4 },
  chip: { paddingHorizontal: Spacing.md, paddingVertical: 5, borderRadius: Radius.full },
  chipText: { fontSize: Typography.xs, fontWeight: '500' },
  clearBtn: { alignSelf: 'flex-end', marginTop: Spacing.xs },
  clearBtnText: { fontSize: Typography.xs, fontWeight: '600' },
  errorBanner: { flexDirection: 'row', justifyContent: 'space-between', padding: Spacing.md, marginHorizontal: Spacing.lg, marginTop: Spacing.sm, borderRadius: Radius.sm },
  empty: { alignItems: 'center', justifyContent: 'center', paddingTop: 80, gap: Spacing.md },
  emptyText: { fontSize: Typography.md, textAlign: 'center' },
});
