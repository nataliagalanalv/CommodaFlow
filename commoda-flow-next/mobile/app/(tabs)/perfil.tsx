import { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Alert, useColorScheme,
  TextInput, KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '../../store/authStore';
import { Colors, Theme, Typography, Spacing, Radius } from '../../constants/theme';
import { API_URL } from '../../constants/api';

export default function PerfilScreen() {
  const scheme = useColorScheme();
  const theme = Colors[scheme ?? 'light'];
  const { user, logout, updateUser, token } = useAuthStore();

  const [name, setName] = useState(user?.name ?? '');

  // ── Contraseña ─────────────────────────────────────────────────────────────
  const [showPasswordField, setShowPasswordField] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  // Mismatch solo cuando confirmar tiene texto y no coincide
  const pwdMismatch = confirmPassword.length > 0 && password !== confirmPassword;

  const initials = name
    ? name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : '??';

  // ── Handlers ────────────────────────────────────────────────────────────────

  function togglePasswordSection() {
    setShowPasswordField((v) => !v);
    // Limpia todo al abrir/cerrar la sección
    setPassword('');
    setConfirmPassword('');
    setShowPassword(false);
    setShowConfirmPassword(false);
  }

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
      const body: Record<string, string> = { name };
      if (password.trim()) body.password = password;

      const res = await fetch(`${API_URL}/api/users/${user.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error('Error al actualizar');
      const updated = await res.json();
      updateUser({ ...user, name: updated.name ?? name });

      // Limpia campos de contraseña tras guardar
      setPassword('');
      setConfirmPassword('');
      setShowPasswordField(false);

      Alert.alert('¡Guardado!', 'Tus datos se han actualizado correctamente.');
    } catch {
      Alert.alert('Error', 'No se pudo conectar con el servidor.');
    } finally {
      setIsLoading(false);
    }
  }

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
