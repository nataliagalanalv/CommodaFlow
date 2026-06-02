import { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  KeyboardAvoidingView, Platform, ScrollView, useColorScheme, ActivityIndicator,
} from 'react-native';
import { z } from 'zod';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { useHardwareStore } from '../store/hardwareStore';
import { useAuthStore } from '../store/authStore';
import { Colors, Theme, Typography, Spacing, Radius } from '../constants/theme';
import { API_URL } from '../constants/api';
import { Hardware, HardwareCategory, HardwareStatus } from '../types';

/**
 * Esquema Zod de validación para el formulario de nuevo equipo.
 *
 * - `model`: mínimo 2 caracteres para evitar abreviaturas sin sentido.
 * - `specs`: mínimo 3 caracteres; campo descriptivo libre.
 * - `category`: enum restringido a los tres valores válidos del dominio.
 * - `dailyRate`: número positivo; el parser convierte el string del input antes de validar.
 * - `status`: siempre `'AVAILABLE'` al crear; se pasa como default para no exponer el campo.
 */
const hardwareSchema = z.object({
  model: z.string().min(2, 'El modelo debe tener al menos 2 caracteres'),
  specs: z.string().min(3, 'Las especificaciones son requeridas'),
  category: z.enum(['LAPTOP', 'TABLET', 'PERIPHERAL']),
  dailyRate: z.number({ invalid_type_error: 'Introduce un número válido' }).positive('El precio debe ser mayor a 0'),
  status: z.enum(['AVAILABLE', 'RENTED', 'MAINTENANCE']).default('AVAILABLE'),
});

/** Mapa de errores de campo derivado del esquema, todos opcionales. */
type FormErrors = Partial<Record<string, string>>;

/** Todas las categorías disponibles para el selector de chips. */
const CATEGORIES: HardwareCategory[] = ['LAPTOP', 'TABLET', 'PERIPHERAL'];

/** Etiquetas legibles para cada categoría de hardware. */
const CATEGORY_LABEL: Record<HardwareCategory, string> = {
  LAPTOP: 'Portátil', TABLET: 'Tablet', PERIPHERAL: 'Periférico',
};

/**
 * Pantalla modal para crear un nuevo equipo de hardware (solo administradores).
 *
 * Se presenta como modal sobre la pantalla de inventario, con header propio
 * definido en `app/_layout.tsx` (`presentation: 'modal'`).
 *
 * ### Flujo de creación
 * 1. El usuario rellena el formulario (modelo, especificaciones, categoría, precio).
 * 2. Al pulsar "Añadir equipo", se valida el formulario con Zod:
 *    - Si hay errores, se muestran bajo cada campo sin llamar a la API.
 *    - Si es válido, se envía `POST /api/hardware` con el token Bearer.
 * 3. Ante respuesta exitosa:
 *    - El nuevo equipo se **antepone** al array del store (`[created, ...items]`)
 *      para que aparezca primero en el inventario sin necesidad de recargar.
 *    - Se dispara feedback háptico de tipo `Success`.
 *    - Se cierra el modal con `router.back()`.
 *
 * ### Selector de categoría
 * Se implementa con chips táctiles en lugar de un picker nativo, lo que
 * ofrece mejor visibilidad y consistencia visual entre plataformas.
 *
 * ### Teclado
 * `KeyboardAvoidingView` adapta el layout al teclado virtual diferenciando
 * entre el comportamiento de iOS (`padding`) y Android (`height`).
 */
export default function NuevoHardwareScreen() {
  const scheme = useColorScheme();
  const theme = Colors[scheme ?? 'light'];
  const router = useRouter();

  const { items, setItems } = useHardwareStore();
  const token = useAuthStore((s) => s.token);

  const [model, setModel] = useState('');
  const [specs, setSpecs] = useState('');
  const [category, setCategory] = useState<HardwareCategory>('LAPTOP');
  const [dailyRate, setDailyRate] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  /** Mensaje de error devuelto por el servidor (ej. conflicto de modelo). */
  const [serverError, setServerError] = useState('');

  /**
   * Valida el formulario y, si es correcto, crea el equipo en la API.
   *
   * Convierte `dailyRate` de string a float antes de pasarlo a Zod.
   * Si la validación falla, asigna los errores a los campos correspondientes.
   * En caso de éxito actualiza el store y cierra el modal.
   */
  async function handleSubmit() {
    setServerError('');
    const parsed = hardwareSchema.safeParse({
      model, specs, category,
      dailyRate: parseFloat(dailyRate),
      status: 'AVAILABLE' as HardwareStatus,
    });

    if (!parsed.success) {
      const fe: FormErrors = {};
      parsed.error.errors.forEach((e) => { fe[e.path[0] as string] = e.message; });
      setErrors(fe);
      return;
    }
    setErrors({});
    setIsLoading(true);

    try {
      const res = await fetch(`${API_URL}/api/hardware`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(parsed.data),
      });
      if (!res.ok) throw new Error('Error al crear el equipo');
      const created: Hardware = await res.json();
      setItems([created, ...items]);
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      router.back();
    } catch (err: unknown) {
      setServerError(err instanceof Error ? err.message : 'Error de red');
    } finally {
      setIsLoading(false);
    }
  }

  const s = styles(theme);

  return (
    <KeyboardAvoidingView style={s.flex} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView contentContainerStyle={s.container}>
        <Text style={s.label}>Modelo *</Text>
        <TextInput style={[s.input, errors.model ? s.inputError : null]} placeholder="Ej: MacBook Pro 14" placeholderTextColor={theme.textSecondary} value={model} onChangeText={setModel} />
        {errors.model && <Text style={s.errorText}>{errors.model}</Text>}

        <Text style={s.label}>Especificaciones *</Text>
        <TextInput style={[s.input, s.textarea, errors.specs ? s.inputError : null]} placeholder="Ej: Apple M3 Pro, 18GB RAM, 512GB SSD" placeholderTextColor={theme.textSecondary} value={specs} onChangeText={setSpecs} multiline numberOfLines={3} />
        {errors.specs && <Text style={s.errorText}>{errors.specs}</Text>}

        <Text style={s.label}>Categoría *</Text>
        <View style={s.row}>
          {CATEGORIES.map((cat) => (
            <TouchableOpacity
              key={cat}
              style={[s.chip, category === cat ? s.chipActive : null]}
              onPress={() => setCategory(cat)}
            >
              <Text style={[s.chipText, category === cat ? s.chipTextActive : null]}>{CATEGORY_LABEL[cat]}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={s.label}>Precio por día (€) *</Text>
        <TextInput style={[s.input, errors.dailyRate ? s.inputError : null]} placeholder="Ej: 25.00" placeholderTextColor={theme.textSecondary} value={dailyRate} onChangeText={setDailyRate} keyboardType="decimal-pad" />
        {errors.dailyRate && <Text style={s.errorText}>{errors.dailyRate}</Text>}

        {serverError ? <Text style={s.serverError}>{serverError}</Text> : null}

        <TouchableOpacity style={s.button} onPress={handleSubmit} disabled={isLoading}>
          {isLoading ? <ActivityIndicator color="#fff" /> : <Text style={s.buttonText}>Añadir equipo</Text>}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

/**
 * Fábrica de estilos parametrizada por el tema activo.
 *
 * @param theme - Paleta de colores del tema activo.
 * @returns Hoja de estilos para la pantalla de creación de hardware.
 */
const styles = (theme: Theme) => StyleSheet.create({
  flex: { flex: 1, backgroundColor: theme.background },
  container: { padding: Spacing.xl, gap: Spacing.xs },
  label: { fontSize: Typography.sm, fontWeight: '600', color: theme.textSecondary, marginTop: Spacing.md },
  input: { borderWidth: 1, borderColor: theme.border, borderRadius: Radius.md, padding: Spacing.md, fontSize: Typography.md, color: theme.text, backgroundColor: theme.surface },
  textarea: { height: 80, textAlignVertical: 'top' },
  inputError: { borderColor: theme.danger },
  errorText: { fontSize: Typography.xs, color: theme.danger },
  row: { flexDirection: 'row', gap: Spacing.sm, flexWrap: 'wrap' },
  chip: { paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm, borderRadius: Radius.full, borderWidth: 1, borderColor: theme.border },
  chipActive: { backgroundColor: theme.primary, borderColor: theme.primary },
  chipText: { fontSize: Typography.sm, color: theme.textSecondary },
  chipTextActive: { color: '#fff', fontWeight: '600' },
  serverError: { fontSize: Typography.sm, color: theme.danger, textAlign: 'center' },
  button: { backgroundColor: theme.primary, borderRadius: Radius.md, padding: Spacing.md, alignItems: 'center', marginTop: Spacing.xl },
  buttonText: { color: '#fff', fontSize: Typography.md, fontWeight: '600' },
});
