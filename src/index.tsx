import { hide, show } from './toastManager';
import type { ToastOptions } from './types';

type Shorthand = (
  title: string,
  message?: string,
  options?: Omit<ToastOptions, 'type' | 'title' | 'message'>
) => string;

const make =
  (type: NonNullable<ToastOptions['type']>): Shorthand =>
  (title, message, options) =>
    show({ ...options, type, title, message });

export const Toast = {
  show,
  hide,
  success: make('success'),
  error: make('error'),
  warning: make('warning'),
  info: make('info'),
  message: make('default'),
};

export { ToastProvider } from './ToastHost';
export type { ToastOptions, ToastType, ToastPosition } from './types';
