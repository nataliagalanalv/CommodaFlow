/**
 * Definición del sistema de diseño de la aplicación móvil CommodaFlow.
 *
 * Todas las constantes de este módulo se usan directamente en los estilos
 * de los componentes mediante `StyleSheet.create` para garantizar coherencia
 * visual y facilitar la adaptación al modo oscuro.
 */

/**
 * Forma del objeto de tema.
 * Cada propiedad es un color hexadecimal que se usa en los estilos de los
 * componentes. Exportado como tipo para que los componentes puedan tipar
 * correctamente el tema recibido como prop.
 */
export type Theme = {
  /** Color de fondo principal de las pantallas. */
  background: string;
  /** Color de fondo de tarjetas y superficies elevadas. */
  surface: string;
  /** Color de acción principal (botones, énfasis, iconos activos). */
  primary: string;
  /** Variante clara del color principal para fondos sutiles y badges. */
  primaryLight: string;
  /** Color de acento secundario para destacar elementos complementarios. */
  accent: string;
  /** Color del texto principal (títulos, etiquetas, contenido). */
  text: string;
  /** Color del texto secundario (subtítulos, placeholders, metainformación). */
  textSecondary: string;
  /** Color de bordes y separadores. */
  border: string;
  /** Color para estados positivos (disponible, devuelto, éxito). */
  success: string;
  /** Color para advertencias (próximo a vencer, estado pendiente). */
  warning: string;
  /** Color para errores y estados críticos (vencido, mantenimiento). */
  danger: string;
  /** Color de fondo de tarjetas de lista. */
  card: string;
};

/**
 * Paletas de color completas para los modos claro y oscuro.
 * Se selecciona la paleta activa usando `useColorScheme()` de React Native:
 * ```ts
 * const theme = Colors[useColorScheme() ?? 'light'];
 * ```
 */
export const Colors: { light: Theme; dark: Theme } = {
  light: {
    background: '#F0F7FF',
    surface: '#FFFFFF',
    primary: '#2563EB',
    primaryLight: '#DBEAFE',
    accent: '#0EA5E9',
    text: '#1E293B',
    textSecondary: '#64748B',
    border: '#E2E8F0',
    success: '#16A34A',
    warning: '#D97706',
    danger: '#DC2626',
    card: '#FFFFFF',
  },
  dark: {
    background: '#0F172A',
    surface: '#1E293B',
    primary: '#3B82F6',
    primaryLight: '#1E3A5F',
    accent: '#38BDF8',
    text: '#F1F5F9',
    textSecondary: '#94A3B8',
    border: '#334155',
    success: '#22C55E',
    warning: '#F59E0B',
    danger: '#EF4444',
    card: '#1E293B',
  },
} as const;

/**
 * Escala tipográfica en píxeles.
 * Basada en la escala de Tailwind CSS para mantener coherencia con la web.
 * Uso: `fontSize: Typography.md` en lugar de valores mágicos.
 */
export const Typography = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 20,
  '2xl': 24,
  '3xl': 30,
} as const;

/**
 * Escala de espaciado en píxeles.
 * Uso: `padding: Spacing.lg`, `gap: Spacing.sm`, etc.
 */
export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  '2xl': 32,
  '3xl': 48,
} as const;

/**
 * Escala de radios de borde en píxeles.
 * - `full` → círculo perfecto (usado para avatares y badges redondeados).
 */
export const Radius = {
  sm: 6,
  md: 10,
  lg: 16,
  full: 9999,
} as const;

/**
 * Colores por categoría de hardware.
 * Usados para colorear iconos y fondos de badges según el tipo de equipo.
 */
export const CategoryColors: Record<string, string> = {
  LAPTOP: '#2563EB',
  TABLET: '#7C3AED',
  PERIPHERAL: '#0891B2',
};

/**
 * Colores por estado de alquiler y hardware.
 * Usados para colorear badges de estado en tarjetas de alquiler e inventario.
 */
export const StatusColors: Record<string, string> = {
  RENTED: '#D97706',
  RETURNED: '#16A34A',
  OVERDUE: '#DC2626',
  PENDING: '#64748B',
  COMPLETED: '#16A34A',
  AVAILABLE: '#16A34A',
  MAINTENANCE: '#DC2626',
};
