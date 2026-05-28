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
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPasswordField, setShowPasswordField] = useState(false);

  const initials = name
    ? name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : '??';

  async function handleSave() {
    if (!user) return;
    if (!name.trim()) {
      Alert.alert('Error', 'El nombre no puede estar vacío');
      return;
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
      setPassword('');
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

          {/* Formulario de edición */}
          <View style={[s.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
            <Text style={[s.cardTitle, { color: theme.text }]}>Editar datos</Text>

            <Text style={[s.label, { color: theme.primary }]}>Nombre completo</Text>
            <TextInput
              style={[s.input, { color: theme.text, borderColor: theme.border, backgroundColor: theme.background }]}
              value={name}
              onChangeText={setName}
              placeholder="Tu nombre"
              placeholderTextColor={theme.textSecondary}
            />

            <TouchableOpacity
              style={s.togglePassword}
              onPress={() => setShowPasswordField(!showPasswordField)}
            >
              <Ionicons
                name={showPasswordField ? 'chevron-up' : 'chevron-down'}
                size={16}
                color={theme.primary}
              />
              <Text style={[s.togglePasswordText, { color: theme.primary }]}>
                {showPasswordField ? 'Cancelar cambio de contraseña' : 'Cambiar contraseña'}
              </Text>
            </TouchableOpacity>

            {showPasswordField && (
              <>
                <Text style={[s.label, { color: theme.primary }]}>Nueva contraseña</Text>
                <TextInput
                  style={[s.input, { color: theme.text, borderColor: theme.border, backgroundColor: theme.background }]}
                  value={password}
                  onChangeText={setPassword}
                  placeholder="••••••••"
                  placeholderTextColor={theme.textSecondary}
                  secureTextEntry
                />
              </>
            )}

            <TouchableOpacity
              style={[s.saveBtn, { backgroundColor: theme.primary }]}
              onPress={handleSave}
              disabled={isLoading}
            >
              {isLoading
                ? <ActivityIndicator color="#fff" />
                : <Text style={s.saveBtnText}>Guardar cambios</Text>}
            </TouchableOpacity>
          </View>

          {/* Info de cuenta */}
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
  input: { borderWidth: 1, borderRadius: Radius.md, paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm, fontSize: Typography.md },
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
