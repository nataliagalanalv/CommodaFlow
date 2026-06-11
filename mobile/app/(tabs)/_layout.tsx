import { useEffect } from 'react';
import { Tabs, Redirect } from 'expo-router';
import { useColorScheme } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/theme';
import { useAuthStore } from '../../store/authStore';
import { requestNotificationPermission } from '../../lib/notifications';

/**
 * Layout del grupo de pestañas `(tabs)`.
 *
 * Define la barra de navegación inferior con tres pestañas principales:
 * - **Inventario** → listado completo de equipos con búsqueda y filtros.
 * - **Alquileres** → alquileres activos del usuario e historial.
 * - **Perfil** → edición de datos y cierre de sesión.
 *
 * ### Protección de acceso
 * Si el usuario no está autenticado redirige a `/(auth)/login`. El flag
 * `isHydrated` evita una redirección prematura mientras Zustand todavía
 * está rehidratando el estado desde AsyncStorage (devuelve `null` hasta
 * que la rehidratación completa).
 *
 * ### Tema adaptativo
 * Los colores de la barra de pestañas y los headers se derivan del tema
 * activo (claro/oscuro), garantizando coherencia visual con el sistema.
 *
 * @remarks
 * Los íconos usan la variante `*-outline` cuando la pestaña está inactiva
 * y la variante sólida cuando está activa, siguiendo las convenciones de
 * diseño de Ionicons para indicar la selección actual.
 */
export default function TabsLayout() {
  const { isAuthenticated, isHydrated } = useAuthStore();
  const scheme = useColorScheme();
  const theme = Colors[scheme ?? 'light'];

  // Solicita el permiso de notificaciones la primera vez que el usuario entra
  // autenticado en la app (tanto si se registró como si solo inició sesión).
  // El sistema operativo solo muestra el diálogo una vez; si ya respondió antes,
  // esta llamada no vuelve a molestar.
  useEffect(() => {
    if (isAuthenticated) {
      requestNotificationPermission();
    }
  }, [isAuthenticated]);

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
