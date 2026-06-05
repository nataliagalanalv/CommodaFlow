import { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Alert, useColorScheme,
  TextInput, KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { updatePassword } from 'firebase/auth';
import { auth } from '../../lib/firebase';
import { useAuthStore } from '../../store/authStore';
import { Colors, Theme, Typography, Spacing, Radius } from '../../constants/theme';
import { API_URL } from '../../constants/api';

/**
 * Pantalla de perfil del usuario autenticado.
 *
 * Permite visualizar y editar los datos de la cuenta:
 * - **Nombre completo** — campo de texto editable.
 * - **Contraseña** — sección colapsable con dos campos (nueva + confirmación)
 *   y toggle de visibilidad mediante ícono de ojo para cada uno.
 *
 * ### Validación de contraseña
 * `pwdMismatch` es `true` cuando el campo de confirmación tiene texto y no
 * coincide con el de nueva contraseña. En ese estado el botón "Guardar" se
 * deshabilita y se tiñe con `theme.border` para indicar que la acción no
 * está disponible. El campo de confirmación muestra su borde en `theme.danger`.
 *
 * ### Envío del formulario
 * `handleSave` construye dinámicamente el cuerpo del `PATCH /api/users/:id`:
 * - Siempre incluye `name`.
 * - Solo incluye `password` si el usuario ha rellenado el campo — esto
 *   permite actualizar el nombre sin cambiar la contraseña.
 * Tras guardar, limpia los campos de contraseña y cierra la sección colapsable.
 *
 * ### Avatar generado
 * Las iniciales se calculan a partir del nombre (`name.split(' ').map(n => n[0])`),
 * tomando hasta dos caracteres para el círculo de avatar.
 *
 * ### Cierre de sesión
 * `handleLogout` muestra un `Alert.alert` nativo de confirmación antes de
 * llamar a `logout()` del store, que limpia usuario y token del estado y de
 * AsyncStorage, provocando la redirección automática a `/(auth)/login`.
 */
export default function PerfilScreen() {
  const scheme = useColorScheme();
  const theme = Colors[scheme ?? 'light'];
  const { user, logout, updateUser, token } = useAuthStore();

  const [name, setName] = useState(user?.name ?? '');

  // ── Contraseña ─────────────────────────────────────────────────────────────
  /** Controla si la sección de cambio de contraseña está expandida. */
  const [showPasswordField, setShowPasswordField] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  /** Controla la visibilidad del texto en el campo "Nueva contraseña". */
  const [showPassword, setShowPassword] = useState(false);
  /** Controla la visibilidad del texto en el campo "Confirmar contraseña". */
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  /** `true` solo cuando el campo de confirmación tiene texto y no coincide con la nueva contraseña. */
  const pwdMismatch = confirmPassword.length > 0 && password !== confirmPassword;

  /** Iniciales del usuario (máx. 2 caracteres) para el avatar generado. */
  const initials = name
    ? name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : '??';

  // ── Handlers ────────────────────────────────────────────────────────────────

  /**
   * Alterna la visibilidad de la sección de contraseña y limpia todos sus
   * campos al abrir o cerrar, evitando datos residuales entre sesiones de edición.
   */
  function togglePasswordSection() {
    setShowPasswordField((v) => !v);
    // Limpia todo al abrir/cerrar la sección
    setPassword('');
    setConfirmPassword('');
    setShowPassword(false);
    setShowConfirmPassword(false);
  }

  /**
   * Valida y envía los cambios del perfil a la API.
   *
   * El cuerpo del `PATCH` incluye `name` siempre y `password` solo si el
   * usuario ha escrito algo en ese campo. Tras el éxito, actualiza el store
   * con `updateUser` para reflejar los cambios en toda la app sin necesidad
   * de recargar el perfil.
   */
  async function handleSave() {
    if (!user) return;
    if (!name.trim()) {
      Alert.alert('Error', 'El nombre no puede estar vacío');
      return;
    }

    // Validación de contraseña (solo si el usuario ha rellenado el campo)
    if (password.trim()) {
      if (!confirmPassword.trim()) {
        Alert.alert('Error', 'Por favor, repite la nueva contraseña');
        return;
      }
      if (password !== confirmPassword) {
        Alert.alert('Error', 'Las contraseñas no coinciden');
        return;
      }
    }

    setIsLoading(true);
    try {
      // 1. Actualiza el nombre en Neon DB
      const res = await fetch(`${API_URL}/api/users/${user.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ name }),
      });
      if (!res.ok) throw new Error('Error al actualizar');
      const updated = await res.json();

      // 2. Si hay nueva contraseña, se cambia en Firebase Auth
      if (password.trim()) {
        if (!auth.currentUser) throw new Error('Sesión expirada, vuelve a iniciar sesión');
        await updatePassword(auth.currentUser, password);
      }

      updateUser({ ...user, name: updated.name ?? name });

      // Limpia campos de contraseña tras guardar
      setPassword('');
      setConfirmPassword('');
      setShowPasswordField(false);

      Alert.alert('¡Guardado!', 'Tus datos se han actualizado correctamente.');
    } catch (err: unknown) {
      const code = (err as { code?: string })?.code;
      if (code === 'auth/requires-recent-login') {
        Alert.alert('Sesión caducada', 'Por seguridad, vuelve a iniciar sesión para cambiar la contraseña.');
      } else if (code === 'auth/weak-password') {
        Alert.alert('Error', 'La contraseña debe tener al menos 6 caracteres.');
      } else {
        Alert.alert('Error', err instanceof Error ? err.message : 'No se pudo conectar con el servidor.');
      }
    } finally {
      setIsLoading(false);
    }
  }

  /**
   * Solicita confirmación nativa antes de cerrar la sesión del usuario.
   * Si el usuario confirma, llama a `logout()` del store, que limpia el
   * estado y AsyncStorage, desencadenando la redirección a la pantalla de login.
   */
  function handleLogout() {
    Alert.alert('Cerrar sesión', '¿Seguro que quieres salir?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Salir', style: 'destructive', onPress: logout },
    ]);
  }

  // ── Render ───────────────────────────────────────────────────────────────────

  return (
    <SafeAreaView style={[s.container, { backgroundColor: theme.background }]} edges={['top']}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView contentContainerStyle={s.scroll}>

          {/* Avatar */}
          <View style={[s.avatarBox, { backgroundColor: theme.primaryLight }]}>
            <Text style={[s.initials, { color: theme.primary }]}>{initials}</Text>
          </View>
          <View style={[s.roleBadge, { backgroundColor: theme.primaryLight }]}>
            <Text style={[s.roleText, { color: theme.primary }]}>
              {user?.role === 'ADMIN' ? 'Administrador' : 'Usuario'}
            </Text>
          </View>
          <Text style={[s.email, { color: theme.textSecondary }]}>{user?.email ?? '-'}</Text>

          {/* ── Formulario de edición ─────────────────────────────────────── */}
          <View style={[s.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
            <Text style={[s.cardTitle, { color: theme.text }]}>Editar datos</Text>

            {/* Nombre */}
            <Text style={[s.label, { color: theme.primary }]}>Nombre completo</Text>
            <TextInput
              style={[s.input, { color: theme.text, borderColor: theme.border, backgroundColor: theme.background }]}
              value={name}
              onChangeText={setName}
              placeholder="Tu nombre"
              placeholderTextColor={theme.textSecondary}
            />

            {/* Toggle sección contraseña */}
            <TouchableOpacity style={s.togglePassword} onPress={togglePasswordSection}>
              <Ionicons
                name={showPasswordField ? 'chevron-up' : 'chevron-down'}
                size={16}
                color={theme.primary}
              />
              <Text style={[s.togglePasswordText, { color: theme.primary }]}>
                {showPasswordField ? 'Cancelar cambio de contraseña' : 'Cambiar contraseña'}
              </Text>
            </TouchableOpacity>

            {/* Sección contraseña (colapsable) */}
            {showPasswordField && (
              <>
                {/* Nueva contraseña */}
                <Text style={[s.label, { color: theme.primary }]}>Nueva contraseña</Text>
                <View style={s.inputWrapper}>
                  <TextInput
                    style={[
                      s.input,
                      s.inputWithEye,
                      { color: theme.text, borderColor: theme.border, backgroundColor: theme.background },
                    ]}
                    value={password}
                    onChangeText={setPassword}
                    placeholder="••••••••"
                    placeholderTextColor={theme.textSecondary}
                    secureTextEntry={!showPassword}
                  />
                  <TouchableOpacity
                    style={s.eyeBtn}
                    onPress={() => setShowPassword((v) => !v)}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                    accessibilityRole="button"
                    accessibilityLabel={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                  >
                    <Ionicons
                      name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                      size={18}
                      color={theme.textSecondary}
                    />
                  </TouchableOpacity>
                </View>

                {/* Confirmar contraseña */}
                <Text style={[s.label, { color: theme.primary }]}>Confirmar contraseña</Text>
                <View style={s.inputWrapper}>
                  <TextInput
                    style={[
                      s.input,
                      s.inputWithEye,
                      {
                        color: theme.text,
                        borderColor: pwdMismatch ? theme.danger : theme.border,
                        backgroundColor: theme.background,
                      },
                    ]}
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    placeholder="••••••••"
                    placeholderTextColor={theme.textSecondary}
                    secureTextEntry={!showConfirmPassword}
                  />
                  <TouchableOpacity
                    style={s.eyeBtn}
                    onPress={() => setShowConfirmPassword((v) => !v)}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                    accessibilityRole="button"
                    accessibilityLabel={showConfirmPassword ? 'Ocultar confirmación de contraseña' : 'Mostrar confirmación de contraseña'}
                  >
                    <Ionicons
                      name={showConfirmPassword ? 'eye-off-outline' : 'eye-outline'}
                      size={18}
                      color={pwdMismatch ? theme.danger : theme.textSecondary}
                    />
                  </TouchableOpacity>
                </View>
                {pwdMismatch && (
                  <Text style={[s.mismatchText, { color: theme.danger }]}>
                    Las contraseñas no coinciden
                  </Text>
                )}
              </>
            )}

            {/* Botón guardar */}
            <TouchableOpacity
              style={[s.saveBtn, { backgroundColor: pwdMismatch ? theme.border : theme.primary }]}
              onPress={handleSave}
              disabled={isLoading || pwdMismatch}
            >
              {isLoading
                ? <ActivityIndicator color="#fff" />
                : <Text style={s.saveBtnText}>Guardar cambios</Text>}
            </TouchableOpacity>
          </View>

          {/* ── Info de cuenta ────────────────────────────────────────────── */}
          <View style={[s.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
            <Text style={[s.cardTitle, { color: theme.text }]}>Cuenta</Text>
            <Row icon="mail-outline" label="Email" value={user?.email ?? '-'} theme={theme} />
            <Row icon="shield-checkmark-outline" label="Rol" value={user?.role ?? '-'} theme={theme} />
          </View>

          {/* Logout */}
          <TouchableOpacity
            style={[s.logoutBtn, { backgroundColor: theme.danger + '20' }]}
            onPress={handleLogout}
          >
            <Ionicons name="log-out-outline" size={20} color={theme.danger} />
            <Text style={[s.logoutText, { color: theme.danger }]}>Cerrar sesión</Text>
          </TouchableOpacity>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// ── Subcomponente fila de info ─────────────────────────────────────────────────

/**
 * Fila de información de solo lectura con ícono, etiqueta y valor.
 * Se usa en la sección "Cuenta" para mostrar email y rol del usuario.
 *
 * @param icon  - Nombre del ícono Ionicons a mostrar.
 * @param label - Etiqueta descriptiva del campo.
 * @param value - Valor a mostrar en el lado derecho.
 * @param theme - Paleta de colores del tema activo.
 */
function Row({ icon, label, value, theme }: {
  icon: React.ComponentProps<typeof Ionicons>['name'];
  label: string; value: string; theme: Theme;
}) {
  return (
    <View style={r.row}>
      <View style={r.iconLabel}>
        <Ionicons name={icon} size={15} color={theme.textSecondary} />
        <Text style={[r.label, { color: theme.textSecondary }]}>{label}</Text>
      </View>
      <Text style={[r.value, { color: theme.text }]}>{value}</Text>
    </View>
  );
}

// ── Estilos ────────────────────────────────────────────────────────────────────

const s = StyleSheet.create({
  container: { flex: 1 },
  scroll: { alignItems: 'center', padding: Spacing.xl, gap: Spacing.md, paddingBottom: Spacing['3xl'] },
  avatarBox: { width: 88, height: 88, borderRadius: Radius.full, alignItems: 'center', justifyContent: 'center', marginTop: Spacing.md },
  initials: { fontSize: Typography['3xl'], fontWeight: '700' },
  roleBadge: { paddingHorizontal: Spacing.lg, paddingVertical: Spacing.xs, borderRadius: Radius.full },
  roleText: { fontSize: Typography.xs, fontWeight: '600' },
  email: { fontSize: Typography.sm, marginBottom: Spacing.md },
  card: { width: '100%', borderRadius: Radius.lg, borderWidth: 1, padding: Spacing.lg, gap: Spacing.sm },
  cardTitle: { fontSize: Typography.lg, fontWeight: '700', marginBottom: Spacing.xs },
  label: { fontSize: Typography.xs, fontWeight: '700', letterSpacing: 0.8, marginTop: Spacing.xs },
  // Input base
  input: {
    borderWidth: 1, borderRadius: Radius.md,
    paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm,
    fontSize: Typography.md,
  },
  // Input con espacio para el ojo
  inputWithEye: { paddingRight: Spacing.xl + Spacing.lg },
  // Wrapper relativo para posicionar el ojo
  inputWrapper: { position: 'relative' },
  eyeBtn: {
    position: 'absolute',
    right: Spacing.md,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
  },
  mismatchText: { fontSize: Typography.xs, fontWeight: '600', marginTop: -Spacing.xs },
  // Controles
  togglePassword: { flexDirection: 'row', alignItems: 'center', gap: Spacing.xs, paddingVertical: Spacing.xs },
  togglePasswordText: { fontSize: Typography.sm, fontWeight: '500' },
  saveBtn: { borderRadius: Radius.md, padding: Spacing.md, alignItems: 'center', marginTop: Spacing.sm },
  saveBtnText: { color: '#fff', fontSize: Typography.sm, fontWeight: '700' },
  logoutBtn: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, paddingHorizontal: Spacing.xl, paddingVertical: Spacing.md, borderRadius: Radius.md, width: '100%', justifyContent: 'center' },
  logoutText: { fontSize: Typography.md, fontWeight: '600' },
});

const r = StyleSheet.create({
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: Spacing.xs },
  iconLabel: { flexDirection: 'row', alignItems: 'center', gap: Spacing.xs },
  label: { fontSize: Typography.sm },
  value: { fontSize: Typography.sm, fontWeight: '500' },
});
