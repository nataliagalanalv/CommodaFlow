import { useState, useMemo } from 'react';
import {
  Modal, View, Text, TouchableOpacity, StyleSheet,
  ActivityIndicator, Alert, useColorScheme, Platform, ScrollView,
} from 'react-native';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Hardware } from '../types';
import { Colors, Theme, Typography, Spacing, Radius } from '../constants/theme';
import { API_URL } from '../constants/api';

/**
 * Props del componente `RentalModal`.
 */
interface Props {
  /** Equipo seleccionado para alquilar. Si es `null`, el modal permanece oculto. */
  item: Hardware | null;
  /** Callback invocado para cerrar el modal (pulsar "Cancelar", fondo o X). */
  onClose: () => void;
  /** Callback invocado tras crear el alquiler con éxito; usado para recargar el inventario. */
  onSuccess: () => void;
  /** ID del usuario autenticado que realizará el alquiler. */
  userId: string;
  /** Token Bearer para autorizar la petición a la API. */
  token: string;
}

/**
 * Devuelve la fecha de hoy en formato ISO `YYYY-MM-DD`.
 * @returns Fecha actual como string.
 */
function todayStr() {
  return new Date().toISOString().split('T')[0];
}

/**
 * Devuelve la fecha de mañana en formato ISO `YYYY-MM-DD`.
 * Se usa como valor inicial de la fecha de fin para garantizar
 * un mínimo de un día de alquiler.
 *
 * @returns Fecha de mañana como string.
 */
function tomorrowStr() {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().split('T')[0];
}

/**
 * Calcula el número de días entre dos fechas ISO `YYYY-MM-DD`.
 * Usa mediodía local (`T00:00:00`) para evitar desfases de zona horaria.
 *
 * @param start - Fecha de inicio en formato `YYYY-MM-DD`.
 * @param end   - Fecha de fin en formato `YYYY-MM-DD`.
 * @returns Número de días (puede ser negativo si `end` < `start`).
 */
function calcDays(start: string, end: string): number {
  const s = new Date(start + 'T00:00:00');
  const e = new Date(end + 'T00:00:00');
  return Math.ceil((e.getTime() - s.getTime()) / (1000 * 60 * 60 * 24));
}

/**
 * Convierte un string ISO `YYYY-MM-DD` a un objeto `Date`.
 * Si la fecha es inválida devuelve la fecha actual como fallback seguro.
 *
 * @param str - Fecha en formato `YYYY-MM-DD`.
 * @returns Objeto `Date` correspondiente.
 */
function toDate(str: string): Date {
  const d = new Date(str + 'T00:00:00');
  return isNaN(d.getTime()) ? new Date() : d;
}

/**
 * Formatea un string ISO `YYYY-MM-DD` para mostrar al usuario en español.
 * Ejemplo: `'2025-06-15'` → `'15 jun 2025'`.
 *
 * @param str - Fecha en formato `YYYY-MM-DD`.
 * @returns Fecha formateada o el string original si la fecha es inválida.
 */
function formatDisplay(str: string): string {
  const d = new Date(str + 'T00:00:00');
  if (isNaN(d.getTime())) return str;
  return d.toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' });
}

/**
 * Modal de confirmación de alquiler para la aplicación móvil CommodaFlow.
 *
 * Se presenta como un bottom sheet (slide desde abajo, `animationType="slide"`)
 * con fondo semitransparente oscuro. Pulsar el fondo cierra el modal.
 *
 * ### Selección de fechas
 * Las fechas de inicio y fin se seleccionan con `DateTimePicker` de
 * `@react-native-community/datetimepicker`, con comportamiento diferenciado:
 * - **iOS**: picker inline dentro del modal, con botón "Listo" para confirmarlo.
 * - **Android**: dialog nativo del sistema que se cierra automáticamente al seleccionar.
 *
 * `endMinDate` garantiza que la fecha de fin siempre sea al menos un día
 * posterior a la de inicio. Si el usuario adelanta la fecha de inicio más
 * allá de la de fin, ésta se desplaza automáticamente un día después.
 *
 * ### Validación
 * El `useMemo` `validation` calcula en tiempo real si el rango de fechas es
 * válido y cuántos días comprende. El botón de confirmación se deshabilita
 * y se tiñe con `theme.border` cuando `validation.isValid` es `false`.
 *
 * ### Cálculo del precio
 * `totalPrice = validation.days × item.dailyRate`. Se muestra en el resumen
 * solo cuando la validación es correcta; cuando no lo es, el precio aparece
 * atenuado con `opacity: 0.6`.
 *
 * ### Confirmación
 * `handleConfirm` envía `POST /api/rentals` con el cuerpo:
 * `{ hardwareId, userId, startDate, endDate, totalPrice, status: 'RENTED' }`.
 * Tras éxito dispara feedback háptico de tipo `Success`, invoca `onSuccess`
 * (recarga el inventario) y cierra el modal con `onClose`.
 */
export function RentalModal({ item, onClose, onSuccess, userId, token }: Props) {
  const scheme = useColorScheme();
  const theme = Colors[scheme ?? 'light'];

  const [startDate, setStartDate] = useState(todayStr());
  const [endDate, setEndDate] = useState(tomorrowStr());
  /** Qué picker está activo ('start', 'end' o `null` = ninguno). */
  const [activePicker, setActivePicker] = useState<'start' | 'end' | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  /** Fecha de hoy sin horas — sirve como `minimumDate` para el picker de inicio. */
  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  /** Fecha mínima del picker de fin: siempre el día siguiente al inicio seleccionado. */
  const endMinDate = useMemo(() => {
    const d = toDate(startDate);
    d.setDate(d.getDate() + 1);
    return d;
  }, [startDate]);

  /**
   * Resultado de validación calculado a partir del rango de fechas actual.
   * - `isValid`: si el rango es mayor a cero días.
   * - `message`: mensaje de error a mostrar si no es válido.
   * - `days`: número de días del alquiler (0 si inválido).
   */
  const validation = useMemo(() => {
    const days = calcDays(startDate, endDate);
    if (days < 0) return { isValid: false, message: 'La fecha de fin es anterior al inicio', days: 0 };
    if (days === 0) return { isValid: false, message: 'El alquiler mínimo es de 1 día', days: 0 };
    return { isValid: true, message: '', days };
  }, [startDate, endDate]);

  /** Precio total estimado = días × tarifa diaria del equipo. */
  const totalPrice = validation.days * (item?.dailyRate ?? 0);

  /**
   * Maneja el cambio de fecha en el DateTimePicker.
   *
   * En Android el picker se cierra solo al seleccionar; en iOS permanece
   * abierto hasta que el usuario pulsa "Listo". Cuando se cambia la fecha de
   * inicio y el nuevo valor iguala o supera la fecha de fin, la fecha de fin
   * se desplaza automáticamente un día más tarde.
   *
   * @param _event - Evento nativo del picker (no se usa directamente).
   * @param date   - Fecha seleccionada por el usuario, o `undefined` si canceló.
   */
  function handleDateChange(_event: DateTimePickerEvent, date?: Date) {
    // On Android the picker closes itself; on iOS stays open until "Listo"
    if (Platform.OS === 'android') setActivePicker(null);
    if (!date) return;

    const str = date.toISOString().split('T')[0];
    if (activePicker === 'start') {
      setStartDate(str);
      // Push end date forward if it's no longer after the new start
      if (str >= endDate) {
        const next = new Date(str + 'T00:00:00');
        next.setDate(next.getDate() + 1);
        setEndDate(next.toISOString().split('T')[0]);
      }
    } else if (activePicker === 'end') {
      setEndDate(str);
    }
  }

  /**
   * Envía el alquiler a la API y gestiona el resultado.
   *
   * Solo se ejecuta si `item` está disponible y la validación es correcta.
   * Ante éxito dispara `expo-haptics` de tipo `Success`, actualiza el inventario
   * llamando a `onSuccess`, y cierra el modal. Ante error muestra un `Alert`.
   */
  async function handleConfirm() {
    if (!item || !validation.isValid) return;

    setIsSubmitting(true);
    try {
      const res = await fetch(`${API_URL}/api/rentals`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          hardwareId: item.id,
          userId,
          startDate,
          endDate,
          totalPrice,
          status: 'RENTED',
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? 'Error en el servidor');
      }

      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      onSuccess();
      onClose();
    } catch (err: unknown) {
      Alert.alert('Error', err instanceof Error ? err.message : 'Error de conexión');
    } finally {
      setIsSubmitting(false);
    }
  }

  if (!item) return null;

  return (
    <Modal
      visible={!!item}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View style={s.overlay}>
        {/* Fondo semitransparente — pulsar cierra */}
        <TouchableOpacity style={s.backdrop} activeOpacity={1} onPress={onClose} />

        <View style={[s.sheet, { backgroundColor: theme.surface }]}>
          {/* Línea decorativa superior */}
          <View style={s.gradientBar} />

          <ScrollView contentContainerStyle={s.content} keyboardShouldPersistTaps="handled">
            {/* Cabecera */}
            <View style={s.header}>
              <View style={{ flex: 1 }}>
                <Text style={[s.title, { color: theme.text }]}>Confirmar alquiler</Text>
                <Text style={[s.subtitle, { color: theme.textSecondary }]} numberOfLines={1}>
                  {item.model}
                </Text>
              </View>
              <TouchableOpacity onPress={onClose} style={[s.closeBtn, { backgroundColor: theme.background }]}>
                <Ionicons name="close" size={20} color={theme.textSecondary} />
              </TouchableOpacity>
            </View>

            {/* Selectores de fecha */}
            <View style={s.datesRow}>
              <DateField
                label="Fecha inicio"
                value={startDate}
                onPress={() => setActivePicker('start')}
                active={activePicker === 'start'}
                theme={theme}
              />
              <View style={[s.dateArrow, { backgroundColor: theme.border }]} />
              <DateField
                label="Fecha fin"
                value={endDate}
                onPress={() => setActivePicker('end')}
                active={activePicker === 'end'}
                theme={theme}
              />
            </View>

            {/* Calendar picker — iOS inline */}
            {Platform.OS === 'ios' && activePicker !== null && (
              <View style={[s.iosPickerWrap, { backgroundColor: theme.background, borderColor: theme.border }]}>
                <View style={s.iosPickerHeader}>
                  <Text style={[s.iosPickerTitle, { color: theme.textSecondary }]}>
                    {activePicker === 'start' ? 'Selecciona inicio' : 'Selecciona fin'}
                  </Text>
                  <TouchableOpacity
                    onPress={() => setActivePicker(null)}
                    style={[s.iosDoneBtn, { backgroundColor: theme.primary }]}
                  >
                    <Text style={s.iosDoneBtnText}>Listo</Text>
                  </TouchableOpacity>
                </View>
                <DateTimePicker
                  value={activePicker === 'start' ? toDate(startDate) : toDate(endDate)}
                  mode="date"
                  display="inline"
                  minimumDate={activePicker === 'start' ? today : endMinDate}
                  onChange={handleDateChange}
                  themeVariant={scheme === 'dark' ? 'dark' : 'light'}
                  accentColor={theme.primary}
                  style={s.iosPicker}
                />
              </View>
            )}

            {/* Calendar picker — Android (renders as system dialog) */}
            {Platform.OS === 'android' && activePicker !== null && (
              <DateTimePicker
                value={activePicker === 'start' ? toDate(startDate) : toDate(endDate)}
                mode="date"
                display="default"
                minimumDate={activePicker === 'start' ? today : endMinDate}
                onChange={handleDateChange}
              />
            )}

            {/* Error de validación */}
            {!validation.isValid && (
              <View style={[s.errorBox, { backgroundColor: theme.danger + '15' }]}>
                <Ionicons name="warning-outline" size={16} color={theme.danger} />
                <Text style={[s.errorText, { color: theme.danger }]}>{validation.message}</Text>
              </View>
            )}

            {/* Resumen de precio */}
            <View style={[s.priceBox, {
              backgroundColor: validation.isValid ? theme.primaryLight : theme.background,
              borderColor: validation.isValid ? theme.primary + '30' : theme.border,
              opacity: validation.isValid ? 1 : 0.6,
            }]}>
              <View>
                <Text style={[s.priceLabel, { color: theme.textSecondary }]}>Total estimado</Text>
                <Text style={[s.priceValue, { color: validation.isValid ? theme.success : theme.textSecondary }]}>
                  {totalPrice.toFixed(2)}€
                </Text>
                {validation.isValid && (
                  <Text style={[s.priceDays, { color: theme.textSecondary }]}>
                    {validation.days} día{validation.days !== 1 ? 's' : ''}
                  </Text>
                )}
              </View>
              <View style={[s.rateTag, { backgroundColor: theme.surface }]}>
                <Text style={[s.rateText, { color: theme.primary }]}>{item.dailyRate}€/día</Text>
              </View>
            </View>

            {/* Botones */}
            <View style={s.buttonsRow}>
              <TouchableOpacity
                style={[s.btnCancel, { backgroundColor: theme.background }]}
                onPress={onClose}
                disabled={isSubmitting}
              >
                <Text style={[s.btnCancelText, { color: theme.textSecondary }]}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[s.btnConfirm, {
                  backgroundColor: validation.isValid ? theme.primary : theme.border,
                }]}
                onPress={handleConfirm}
                disabled={!validation.isValid || isSubmitting}
              >
                {isSubmitting
                  ? <ActivityIndicator color="#fff" />
                  : <Text style={s.btnConfirmText}>Confirmar ahora</Text>}
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

// ── Subcomponente campo de fecha ──────────────────────────────────────────────

/**
 * Campo táctil de selección de fecha para el modal de alquiler.
 *
 * Muestra la fecha formateada y un ícono de calendario. Cuando el campo está
 * activo (su picker está abierto), el borde se tiñe con el color primario del
 * tema para indicar el foco visual.
 *
 * @param label   - Etiqueta del campo ("Fecha inicio" / "Fecha fin").
 * @param value   - Fecha actual en formato `YYYY-MM-DD`.
 * @param onPress - Callback que activa el picker correspondiente.
 * @param active  - `true` cuando el picker de este campo está abierto.
 * @param theme   - Paleta de colores del tema activo.
 */
function DateField({ label, value, onPress, active, theme }: {
  label: string; value: string; onPress: () => void; active: boolean; theme: Theme;
}) {
  return (
    <TouchableOpacity
      style={[
        df.field,
        { backgroundColor: theme.background, borderColor: active ? theme.primary : theme.border },
      ]}
      onPress={onPress}
      activeOpacity={0.75}
    >
      <View style={df.labelRow}>
        <Ionicons
          name="calendar-outline"
          size={13}
          color={active ? theme.primary : theme.textSecondary}
        />
        <Text style={[df.label, { color: active ? theme.primary : theme.textSecondary }]}>
          {label}
        </Text>
      </View>
      <Text style={[df.value, { color: theme.text }]}>{formatDisplay(value)}</Text>
    </TouchableOpacity>
  );
}

// ── Estilos ───────────────────────────────────────────────────────────────────

const s = StyleSheet.create({
  overlay: { flex: 1, justifyContent: 'flex-end' },
  backdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(26,38,60,0.45)' },
  sheet: { borderTopLeftRadius: 32, borderTopRightRadius: 32, overflow: 'hidden', maxHeight: '95%' },
  gradientBar: { height: 4, backgroundColor: '#3D70DD' },
  content: { padding: Spacing.xl, gap: Spacing.lg },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  title: { fontSize: Typography.xl, fontWeight: '800' },
  subtitle: { fontSize: Typography.sm, marginTop: 2 },
  closeBtn: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center', marginLeft: Spacing.md },
  datesRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  dateArrow: { width: 1, height: 32, borderRadius: 1 },
  // iOS inline picker
  iosPickerWrap: { borderRadius: Radius.lg, borderWidth: 1, overflow: 'hidden' },
  iosPickerHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm },
  iosPickerTitle: { fontSize: Typography.xs, fontWeight: '600' },
  iosDoneBtn: { paddingHorizontal: Spacing.md, paddingVertical: Spacing.xs, borderRadius: Radius.full },
  iosDoneBtnText: { color: '#fff', fontSize: Typography.xs, fontWeight: '700' },
  iosPicker: { width: '100%' },
  // validation
  errorBox: { flexDirection: 'row', alignItems: 'center', gap: Spacing.xs, padding: Spacing.md, borderRadius: Radius.md },
  errorText: { fontSize: Typography.xs, fontWeight: '700', flex: 1 },
  // price summary
  priceBox: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: Spacing.lg, borderRadius: Radius.lg, borderWidth: 1 },
  priceLabel: { fontSize: Typography.xs, fontWeight: '700', letterSpacing: 1 },
  priceValue: { fontSize: Typography['3xl'], fontWeight: '800' },
  priceDays: { fontSize: Typography.xs, marginTop: 2 },
  rateTag: { paddingHorizontal: Spacing.md, paddingVertical: Spacing.xs, borderRadius: Radius.sm },
  rateText: { fontSize: Typography.sm, fontWeight: '800' },
  // buttons
  buttonsRow: { flexDirection: 'row', gap: Spacing.md, paddingBottom: Spacing.md },
  btnCancel: { flex: 1, padding: Spacing.md, borderRadius: Radius.md, alignItems: 'center' },
  btnCancelText: { fontSize: Typography.sm, fontWeight: '700' },
  btnConfirm: { flex: 2, padding: Spacing.md, borderRadius: Radius.md, alignItems: 'center' },
  btnConfirmText: { color: '#fff', fontSize: Typography.sm, fontWeight: '800', letterSpacing: 0.5 },
});

const df = StyleSheet.create({
  field: { flex: 1, borderWidth: 1.5, borderRadius: Radius.md, padding: Spacing.md, gap: 4 },
  labelRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  label: { fontSize: Typography.xs, fontWeight: '700', letterSpacing: 0.5 },
  value: { fontSize: Typography.sm, fontWeight: '600' },
});
