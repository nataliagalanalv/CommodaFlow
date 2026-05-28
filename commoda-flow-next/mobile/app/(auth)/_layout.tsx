import { Stack, Redirect } from 'expo-router';
import { useAuthStore } from '../../store/authStore';

export default function AuthLayout() {
  const { isAuthenticated, isHydrated } = useAuthStore();

  if (!isHydrated) return null;
  if (isAuthenticated) return <Redirect href="/(tabs)/inventario" />;

  return <Stack screenOptions={{ headerShown: false }} />;
}
