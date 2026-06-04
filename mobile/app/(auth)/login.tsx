import { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  KeyboardAvoidingView, Platform, ActivityIndicator, useColorScheme,
} from 'react-native';
import { z } from 'zod';
import { useAuthStore } from '../../store/authStore';
import { Colors, Theme, Typography, Spacing, Radius } from '../../constants/theme';
import { API_URL } from '../../constants/api';

/**
 * Esquema Zod de validación del formulario de login.
 *
 * Aplica validación de formato de email y presencia de contraseña antes
 * de realizar cualquier petición a la red, reduciendo roundtrips innecesarios.
 */
const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(1, 'La contraseña es requerida'),
});

/**
 * Mapa de errores de campo derivado del esquema Zod.
 * Cada clave es opcional para que el estado empiece limpio (`{}`).
 */
type FormErrors = Partial<Record<keyof z.infer<typeof loginSchema>, string>>;

/**
 * Pantalla de inicio de sesión de la aplicación móvil CommodaFlow.
 *
 * Gestiona el ciclo completo de autenticación:
 * 1. Validación local con Zod antes de tocar la red.
 * 2. Petición `POST /api/auth/login` con las credenciales.
 * 3. Persistencia del usuario y token en `authStore` mediante `setAuth`.
 *
 * ### Comportamiento tras login exitoso
 * Al llamar a `setAuth`, el store actualiza `isAuthenticated` a `true`, lo
 * que hace que `(auth)/_layout.tsx` monte `<Redirect href="/(tabs)/inventario" />`
 * de forma automática — no hay navegación explícita en este componente.
 *
 * ### Adaptación a teclado
 * `KeyboardAvoidingView` ajusta el layout para que el formulario no quede
 * oculto bajo el teclado virtual, con comportamiento diferenciado entre
 * iOS (`padding`) y Android (`height`).
 *
 * ### Modo oscuro
 * Los estilos se generan en tiempo de render llamando a `styles(theme)`,
 * lo que permite que el formulario responda instantáneamente al cambio
 * de esquema de color del sistema.
 */
export default function LoginScreen() {
  const scheme = useColorScheme();
  const theme = Colors[scheme ?? 'light'];
  const setAuth = useAuthStore((s) => s.setAuth);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  /** Errores de validación local por campo. Se limpian antes de cada intento. */
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  /** Mensaje de error devuelto por la API (credenciales incorrectas, red, etc.). */
  const [serverError, setServerError] = useState('');

  /**
   * Maneja el intento de inicio de sesión.
   *
   * Primero valida el formulario con Zod y, si hay errores, los muestra
   * sin llegar a la red. Si la validación pasa, envía las credenciales a la
   * API y persiste la sesión en el store ante una respuesta exitosa.
   */
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
      if (!res.ok) throw new Error(data.error ?? data.message ?? 'Error al iniciar sesión');
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

/**
 * Fábrica de estilos parametrizada por el tema activo.
 *
 * Se invoca en cada render para que los colores reflejen siempre el
 * esquema de color actual (claro u oscuro) sin necesidad de lógica
 * adicional en el JSX.
 *
 * @param theme - Paleta de colores del tema activo.
 * @returns Hoja de estilos para la pantalla de login.
 */
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
