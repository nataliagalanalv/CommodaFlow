import { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  KeyboardAvoidingView, Platform, ActivityIndicator, useColorScheme,
} from 'react-native';
import { z } from 'zod';
import { useAuthStore } from '../../store/authStore';
import { Colors, Theme, Typography, Spacing, Radius } from '../../constants/theme';
import { API_URL } from '../../constants/api';

const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(1, 'La contraseña es requerida'),
});

type FormErrors = Partial<Record<keyof z.infer<typeof loginSchema>, string>>;

export default function LoginScreen() {
  const scheme = useColorScheme();
  const theme = Colors[scheme ?? 'light'];
  const setAuth = useAuthStore((s) => s.setAuth);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState('');

  async function handleLogin() {
    setServerError('');
    const result = loginSchema.safeParse({ email, password });
    if (!result.success) {
      const fieldErrors: FormErrors = {};
      result.error.errors.forEach((e) => {
        const field = e.path[0] as keyof FormErrors;
        fieldErrors[field] = e.message;
      });
      setErrors(fieldErrors);
      return;
    }
    setErrors({});
    setIsLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(result.data),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Error al iniciar sesión');
      setAuth(data.user, data.token);
    } catch (err: unknown) {
      setServerError(err instanceof Error ? err.message : 'Error de red');
    } finally {
      setIsLoading(false);
    }
  }

  const s = styles(theme);

  return (
    <KeyboardAvoidingView
      style={s.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={s.card}>
        <Text style={s.title}>CommodaFlow</Text>
        <Text style={s.subtitle}>Gestión de hardware</Text>

        <TextInput
          style={[s.input, errors.email ? s.inputError : null]}
          placeholder="Email"
          placeholderTextColor={theme.textSecondary}
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />
        {errors.email && <Text style={s.errorText}>{errors.email}</Text>}

        <TextInput
          style={[s.input, errors.password ? s.inputError : null]}
          placeholder="Contraseña"
          placeholderTextColor={theme.textSecondary}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        {errors.password && <Text style={s.errorText}>{errors.password}</Text>}

        {serverError ? <Text style={s.serverError}>{serverError}</Text> : null}

        <TouchableOpacity style={s.button} onPress={handleLogin} disabled={isLoading}>
          {isLoading
            ? <ActivityIndicator color="#fff" />
            : <Text style={s.buttonText}>Iniciar sesión</Text>}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = (theme: Theme) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.background, justifyContent: 'center', padding: Spacing.xl },
    card: { backgroundColor: theme.surface, borderRadius: Radius.lg, padding: Spacing.xl, gap: Spacing.sm },
    title: { fontSize: Typography['3xl'], fontWeight: '700', color: theme.primary, textAlign: 'center' },
    subtitle: { fontSize: Typography.md, color: theme.textSecondary, textAlign: 'center', marginBottom: Spacing.lg },
    input: {
      borderWidth: 1, borderColor: theme.border, borderRadius: Radius.md,
      padding: Spacing.md, fontSize: Typography.md, color: theme.text, backgroundColor: theme.background,
    },
    inputError: { borderColor: theme.danger },
    errorText: { fontSize: Typography.xs, color: theme.danger, marginTop: -Spacing.xs },
    serverError: { fontSize: Typography.sm, color: theme.danger, textAlign: 'center' },
    button: {
      backgroundColor: theme.primary, borderRadius: Radius.md,
      padding: Spacing.md, alignItems: 'center', marginTop: Spacing.sm,
    },
    buttonText: { color: '#fff', fontSize: Typography.md, fontWeight: '600' },
  });
