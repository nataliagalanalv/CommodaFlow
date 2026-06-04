import { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  KeyboardAvoidingView, Platform, ActivityIndicator, useColorScheme,
} from 'react-native';
import { z } from 'zod';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from 'firebase/auth';
import { auth } from '../../lib/firebase';
import { useAuthStore } from '../../store/authStore';
import { Colors, Theme, Typography, Spacing, Radius } from '../../constants/theme';
import { API_URL } from '../../constants/api';

/** Esquema de validación del formulario de login. */
const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(1, 'La contraseña es requerida'),
});

/** Esquema de validación del formulario de registro. */
const registerSchema = z.object({
  name: z.string().min(2, 'El nombre es requerido'),
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Mínimo 6 caracteres'),
});

type FormErrors = Partial<Record<'name' | 'email' | 'password', string>>;

/**
 * Traduce los códigos de error de Firebase Auth a mensajes legibles en español.
 *
 * @param code - Código de error de Firebase (p.ej. `auth/invalid-credential`).
 * @returns Mensaje descriptivo para mostrar al usuario.
 */
function firebaseErrorMessage(code: string): string {
  switch (code) {
    case 'auth/invalid-credential':
    case 'auth/wrong-password':
    case 'auth/user-not-found':
      return 'Email o contraseña incorrectos';
    case 'auth/email-already-in-use':
      return 'Este correo ya está registrado';
    case 'auth/weak-password':
      return 'La contraseña debe tener al menos 6 caracteres';
    case 'auth/invalid-email':
      return 'El formato del email no es válido';
    case 'auth/too-many-requests':
      return 'Demasiados intentos. Inténtalo más tarde';
    default:
      return 'Error de autenticación. Inténtalo de nuevo';
  }
}

/**
 * Pantalla de inicio de sesión y registro de la aplicación móvil CommodaFlow.
 *
 * Usa Firebase Auth como proveedor de identidad (misma base de usuarios que
 * la versión web). El flujo es:
 *
 * ### Login
 * 1. `signInWithEmailAndPassword` (Firebase) valida las credenciales.
 * 2. Se obtiene el ID token de Firebase.
 * 3. Se envía a `POST /api/auth/login`, que establece la sesión y devuelve
 *    el perfil del usuario desde Neon DB.
 * 4. Se persiste en `authStore` con `setAuth`.
 *
 * ### Registro
 * 1. `createUserWithEmailAndPassword` (Firebase) crea la cuenta.
 * 2. Se envía el ID token + nombre a `POST /api/auth/register`, que crea el
 *    perfil en Neon DB con el Firebase uid como clave.
 * 3. Se persiste la sesión.
 *
 * Tras autenticar, `(auth)/_layout.tsx` redirige automáticamente al inventario.
 */
export default function LoginScreen() {
  const scheme = useColorScheme();
  const theme = Colors[scheme ?? 'light'];
  const setAuth = useAuthStore((s) => s.setAuth);

  /** `true` muestra el formulario de login; `false` el de registro. */
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState('');

  /**
   * Procesa el envío del formulario (login o registro según el modo activo).
   * Valida con Zod, autentica en Firebase y sincroniza con el backend.
   */
  async function handleSubmit() {
    setServerError('');

    // Validación local con el esquema correspondiente
    const schema = isLogin ? loginSchema : registerSchema;
    const result = schema.safeParse(isLogin ? { email, password } : { name, email, password });
    if (!result.success) {
      const fe: FormErrors = {};
      result.error.errors.forEach((e) => { fe[e.path[0] as keyof FormErrors] = e.message; });
      setErrors(fe);
      return;
    }
    setErrors({});
    setIsLoading(true);

    try {
      if (isLogin) {
        // ── LOGIN ──────────────────────────────────────────────────────────
        const cred = await signInWithEmailAndPassword(auth, email, password);
        const idToken = await cred.user.getIdToken();
        const res = await fetch(`${API_URL}/api/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ idToken }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error ?? 'Error al iniciar sesión');
        setAuth(data.user, data.token);
      } else {
        // ── REGISTRO ───────────────────────────────────────────────────────
        const cred = await createUserWithEmailAndPassword(auth, email, password);
        const idToken = await cred.user.getIdToken();
        const res = await fetch(`${API_URL}/api/auth/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ idToken, name }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error ?? 'Error al crear la cuenta');
        setAuth(data.user, data.token);
      }
    } catch (err: unknown) {
      const code = (err as { code?: string })?.code;
      setServerError(
        code ? firebaseErrorMessage(code)
        : err instanceof Error ? err.message
        : 'Error de red'
      );
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

        {/* Tabs login / registro */}
        <View style={s.tabs}>
          <TouchableOpacity
            style={[s.tab, isLogin && { borderBottomColor: theme.primary }]}
            onPress={() => { setIsLogin(true); setErrors({}); setServerError(''); }}
          >
            <Text style={[s.tabText, { color: isLogin ? theme.primary : theme.textSecondary }]}>
              Acceso
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[s.tab, !isLogin && { borderBottomColor: theme.primary }]}
            onPress={() => { setIsLogin(false); setErrors({}); setServerError(''); }}
          >
            <Text style={[s.tabText, { color: !isLogin ? theme.primary : theme.textSecondary }]}>
              Crear cuenta
            </Text>
          </TouchableOpacity>
        </View>

        {/* Nombre (solo registro) */}
        {!isLogin && (
          <>
            <TextInput
              style={[s.input, errors.name ? s.inputError : null]}
              placeholder="Nombre completo"
              placeholderTextColor={theme.textSecondary}
              value={name}
              onChangeText={setName}
            />
            {errors.name && <Text style={s.errorText}>{errors.name}</Text>}
          </>
        )}

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

        <TouchableOpacity style={s.button} onPress={handleSubmit} disabled={isLoading}>
          {isLoading
            ? <ActivityIndicator color="#fff" />
            : <Text style={s.buttonText}>{isLogin ? 'Iniciar sesión' : 'Registrarme'}</Text>}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

/**
 * Fábrica de estilos parametrizada por el tema activo.
 *
 * @param theme - Paleta de colores del tema activo.
 * @returns Hoja de estilos para la pantalla de login.
 */
const styles = (theme: Theme) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.background, justifyContent: 'center', padding: Spacing.xl },
    card: { backgroundColor: theme.surface, borderRadius: Radius.lg, padding: Spacing.xl, gap: Spacing.sm },
    title: { fontSize: Typography['3xl'], fontWeight: '700', color: theme.primary, textAlign: 'center' },
    subtitle: { fontSize: Typography.md, color: theme.textSecondary, textAlign: 'center', marginBottom: Spacing.md },
    tabs: { flexDirection: 'row', marginBottom: Spacing.md },
    tab: { flex: 1, paddingVertical: Spacing.sm, alignItems: 'center', borderBottomWidth: 2, borderBottomColor: 'transparent' },
    tabText: { fontSize: Typography.sm, fontWeight: '700' },
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
