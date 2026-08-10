import { Platform } from 'react-native';

// Apple / Linear / Vercel Premium Dark Aesthetic Design Tokens
export const colors = {
  // Main System Canvas Background
  systemBackground: '#09090B', // Zinc 950 (True deep neutral)
  secondarySystemBackground: '#09090B', // Keep canvas unified for a cleaner look, use borders to separate
  
  // Card & Container Surfaces
  cardBackground: '#18181B', // Zinc 900
  cardBackgroundElevated: '#27272A', // Zinc 800
  cardBorder: 'rgba(255, 255, 255, 0.08)', // Faint hairline border
  
  // Premium Glass Surfaces
  glassBackground: 'rgba(24, 24, 27, 0.6)', // Zinc 900 translucent
  glassBorder: 'rgba(255, 255, 255, 0.05)', // Ultra-thin frosted rim
  
  // Primary Text & Labels
  label: '#FAFAFA', // Zinc 50
  secondaryLabel: '#A1A1AA', // Zinc 400
  tertiaryLabel: '#71717A', // Zinc 500
  
  // Accents & Actions
  accent: '#3B82F6', // Crisp Blue
  secondaryAccent: '#60A5FA', // Sky Blue
  indigoGlow: '#4F46E5', // Deep Indigo
  
  // Semantic Status Colors
  destructive: '#EF4444', 
  destructiveBg: 'rgba(239, 68, 68, 0.1)',
  success: '#10B981', 
  successBg: 'rgba(16, 185, 129, 0.1)',
  warning: '#F59E0B', 
  warningBg: 'rgba(245, 158, 11, 0.1)',
  
  // Separator & Borders
  separator: 'rgba(255, 255, 255, 0.1)',
  glowBorder: 'rgba(59, 130, 246, 0.4)',
};
