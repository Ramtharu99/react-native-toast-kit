import { useCallback, useEffect, useState, type ReactNode } from 'react';
import { Platform, StatusBar, StyleSheet, View } from 'react-native';
import { hide, subscribe } from './toastManager';
import { ToastItem } from './ToastItem';
import type { ToastItemData } from './types';

const TOP_INSET =
  Platform.OS === 'ios' ? 54 : (StatusBar.currentHeight ?? 24) + 6;
const BOTTOM_INSET = Platform.OS === 'ios' ? 34 : 24;

export function ToastProvider({ children }: { children?: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItemData[]>([]);

  useEffect(() => subscribe(setToasts), []);

  const remove = useCallback(
    (id: string) => {
      const t = toasts.find((x) => x.id === id);
      hide(id);
      t?.onHide?.();
    },
    [toasts]
  );

  const top = toasts.filter((t) => (t.position ?? 'top') === 'top');
  const bottom = toasts.filter((t) => t.position === 'bottom');

  return (
    <View style={styles.root} pointerEvents="box-none">
      {children}
      <View
        pointerEvents="box-none"
        style={[styles.stack, { top: TOP_INSET + (top[0]?.offset ?? 0) }]}
      >
        {top.map((t) => (
          <ToastItem key={t.id} toast={t} onDismiss={remove} />
        ))}
      </View>
      <View
        pointerEvents="box-none"
        style={[
          styles.stack,
          { bottom: BOTTOM_INSET + (bottom[0]?.offset ?? 0) },
        ]}
      >
        {bottom.map((t) => (
          <ToastItem key={t.id} toast={t} onDismiss={remove} />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  stack: {
    position: 'absolute',
    left: 16,
    right: 16,
    zIndex: 9999,
  },
});
