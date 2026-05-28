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

const hardwareSchema = z.object({
  model: z.string().min(2, 'El modelo debe tener al menos 2 caracteres'),
  specs: z.string().min(3, 'Las especificaciones son requeridas'),
  category: z.enum(['LAPTOP', 'TABLET', 'PERIPHERAL']),
  dailyRate: z.number({ invalid_type_error: 'Introduce un número válido' }).positive('El precio debe ser mayor a 0'),
  status: z.enum(['AVAILABLE', 'RENTED', 'MAINTENANCE']).default('AVAILABLE'),
});

type FormErrors = Partial<Record<string, string>>;

const CATEGORIES: HardwareCategory[] = ['LAPTOP', 'TABLET', 'PERIPHERAL'];
const CATEGORY_LABEL: Record<HardwareCategory, string> = {
  LAPTOP: 'Portátil', TABLET: 'Tablet', PERIPHERAL: 'Periférico',
};

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
  const [serverError, setServerError] = useState('');

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
