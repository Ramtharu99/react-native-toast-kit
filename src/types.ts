export type ToastType = 'success' | 'error' | 'warning' | 'info' | 'default';

export type ToastPosition = 'top' | 'bottom';

export interface ToastOptions {
  type?: ToastType;
  title?: string;
  message?: string;
  duration?: number;
  position?: ToastPosition;
  offset?: number;
  swipeToDismiss?: boolean;
  showProgress?: boolean;
  onPress?: () => void;
  onHide?: () => void;
}

export interface ToastItemData extends ToastOptions {
  id: string;
}
