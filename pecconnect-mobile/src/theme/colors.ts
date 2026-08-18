import { useColorScheme } from 'react-native';
import { useThemeStore, ThemeMode } from '@/stores/useThemeStore';

export const darkColors = {
  systemBackground: '#09090B',
  secondarySystemBackground: '#18181B',
  cardBackground: '#18181B',
  cardBackgroundElevated: '#27272A',
  cardBorder: 'rgba(255, 255, 255, 0.08)',
  glassBackground: 'rgba(24, 24, 27, 0.75)',
  glassBorder: 'rgba(255, 255, 255, 0.08)',
  label: '#FAFAFA',
  secondaryLabel: '#A1A1AA',
  tertiaryLabel: '#71717A',
  accent: '#3B82F6',
  secondaryAccent: '#60A5FA',
  indigoGlow: '#4F46E5',
  destructive: '#EF4444',
  destructiveBg: 'rgba(239, 68, 68, 0.12)',
  success: '#10B981',
  successBg: 'rgba(16, 185, 129, 0.12)',
  warning: '#F59E0B',
  warningBg: 'rgba(245, 158, 11, 0.12)',
  separator: 'rgba(255, 255, 255, 0.08)',
  glowBorder: 'rgba(59, 130, 246, 0.4)',
};

export const lightColors = {
  systemBackground: '#F8FAFC',
  secondarySystemBackground: '#F1F5F9',
  cardBackground: '#FFFFFF',
  cardBackgroundElevated: '#F8FAFC',
  cardBorder: 'rgba(0, 0, 0, 0.08)',
  glassBackground: 'rgba(255, 255, 255, 0.85)',
  glassBorder: 'rgba(0, 0, 0, 0.08)',
  label: '#0F172A',
  secondaryLabel: '#64748B',
  tertiaryLabel: '#94A3B8',
  accent: '#2563EB',
  secondaryAccent: '#3B82F6',
  indigoGlow: '#4F46E5',
  destructive: '#DC2626',
  destructiveBg: 'rgba(220, 38, 38, 0.08)',
  success: '#059669',
  successBg: 'rgba(5, 150, 105, 0.08)',
  warning: '#D97706',
  warningBg: 'rgba(217, 119, 6, 0.08)',
  separator: 'rgba(0, 0, 0, 0.06)',
  glowBorder: 'rgba(37, 99, 235, 0.3)',
};

// Default export maintains backward compatibility
export const colors = darkColors;

export function useTheme() {
  const systemColorScheme = useColorScheme();
  const { themeMode, setThemeMode } = useThemeStore();

  const isDark =
    themeMode === 'system' ? systemColorScheme !== 'light' : themeMode === 'dark';

  const currentColors = isDark ? darkColors : lightColors;

  return {
    themeMode,
    setThemeMode,
    isDark,
    colors: currentColors,
  };
}
