import type { ToastType } from './types';

export interface Palette {
  /** Accent color: icon badge, glow, edge tint. */
  accent: string;
  /** Glass body color for light / dark mode (translucent). */
  glassLight: string;
  glassDark: string;
}

export const palette: Record<ToastType, Palette> = {
  success: {
    accent: '#30D158',
    glassLight: 'rgba(232, 250, 238, 0.82)',
    glassDark: 'rgba(18, 48, 30, 0.78)',
  },
  error: {
    accent: '#FF453A',
    glassLight: 'rgba(255, 237, 236, 0.82)',
    glassDark: 'rgba(60, 22, 22, 0.78)',
  },
  warning: {
    accent: '#FF9F0A',
    glassLight: 'rgba(255, 245, 225, 0.82)',
    glassDark: 'rgba(58, 40, 10, 0.78)',
  },
  info: {
    accent: '#0A84FF',
    glassLight: 'rgba(230, 242, 255, 0.82)',
    glassDark: 'rgba(14, 36, 66, 0.78)',
  },
  default: {
    accent: '#8E8E93',
    glassLight: 'rgba(246, 246, 248, 0.82)',
    glassDark: 'rgba(40, 40, 44, 0.78)',
  },
};
