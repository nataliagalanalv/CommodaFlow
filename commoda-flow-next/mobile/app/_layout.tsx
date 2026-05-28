import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Colors } from '../constants/theme';

export default function RootLayout() {
  const scheme = useColorScheme();
  const theme = Colors[scheme ?? 'light'];

  return (
    <SafeAreaProvider>
      <StatusBar style={scheme === 'dark' ? 'light' : 'dark'} />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen
          name="nuevo-hardware"
          options={{
            presentation: 'modal',
            headerShown: true,
            title: 'Añadir equipo',
            headerStyle: { backgroundColor: theme.surface },
            headerTintColor: theme.primary,
          }}
        />
      </Stack>
    </SafeAreaProvider>
  );
}
