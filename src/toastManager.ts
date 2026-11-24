import type { ToastItemData, ToastOptions } from './types';

type Listener = (toasts: ToastItemData[]) => void;

const MAX_VISIBLE = 3;

let toasts: ToastItemData[] = [];
let counter = 0;
const listeners = new Set<Listener>();

function emit() {
  listeners.forEach((l) => l(toasts));
}

export function subscribe(listener: Listener): () => void {
  listeners.add(listener);
  listener(toasts);
  return () => {
    listeners.delete(listener);
  };
}

export function show(options: ToastOptions): string {
  const id = `toast-${++counter}`;
  toasts = [...toasts, { ...options, id }].slice(-MAX_VISIBLE);
  emit();
  return id;
}

export function hide(id?: string) {
  toasts = id ? toasts.filter((t) => t.id !== id) : [];
  emit();
}
