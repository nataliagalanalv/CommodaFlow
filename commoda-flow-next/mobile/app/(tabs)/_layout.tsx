import { Tabs, Redirect } from 'expo-router';
import { useColorScheme } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/theme';
import { useAuthStore } from '../../store/authStore';

export default function TabsLayout() {
  const { isAuthenticated, isHydrated } = useAuthStore();
  const scheme = useColorScheme();
  const theme = Colors[scheme ?? 'light'];

  if (!isHydrated) return null;
  if (!isAuthenticated) return <Redirect href="/(auth)/login" />;

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: theme.primary,
        tabBarInactiveTintColor: theme.textSecondary,
        tabBarStyle: { backgroundColor: theme.surface, borderTopColor: theme.border },
        headerStyle: { backgroundColor: theme.surface },
        headerTintColor: theme.text,
        headerShadowVisible: false,
      }}
    >
      <Tabs.Screen
        name="inventario"
        options={{
          title: 'Inventario',
          headerShown: false,
          tabBarIcon: ({ focused, color }) => (
            <Ionicons name={focused ? 'laptop' : 'laptop-outline'} size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="alquileres"
        options={{
          title: 'Alquileres',
          headerShown: false,
          tabBarIcon: ({ focused, color }) => (
            <Ionicons name={focused ? 'receipt' : 'receipt-outline'} size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="perfil"
        options={{
          title: 'Perfil',
          headerTitle: 'Mi perfil',
          tabBarIcon: ({ focused, color }) => (
            <Ionicons name={focused ? 'person' : 'person-outline'} size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
