export type Theme = {
  background: string; surface: string; primary: string; primaryLight: string;
  accent: string; text: string; textSecondary: string; border: string;
  success: string; warning: string; danger: string; card: string;
};

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

export const Typography = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 20,
  '2xl': 24,
  '3xl': 30,
} as const;

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  '2xl': 32,
  '3xl': 48,
} as const;

export const Radius = {
  sm: 6,
  md: 10,
  lg: 16,
  full: 9999,
} as const;

// Colores por categoría de hardware
export const CategoryColors: Record<string, string> = {
  LAPTOP: '#2563EB',
  TABLET: '#7C3AED',
  PERIPHERAL: '#0891B2',
};

// Colores por estado de alquiler
export const StatusColors: Record<string, string> = {
  RENTED: '#D97706',
  RETURNED: '#16A34A',
  OVERDUE: '#DC2626',
  PENDING: '#64748B',
  COMPLETED: '#16A34A',
  AVAILABLE: '#16A34A',
  MAINTENANCE: '#DC2626',
};
