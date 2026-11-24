import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Toast, ToastProvider } from 'react-native-toast-kit';

const buttons = [
  {
    label: 'Success',
    color: '#30D158',
    run: () => Toast.success('Payment complete', 'Your order is on its way.'),
  },
  {
    label: 'Error',
    color: '#FF453A',
    run: () =>
      Toast.error('Upload failed', 'Check your connection and try again.'),
  },
  {
    label: 'Warning',
    color: '#FF9F0A',
    run: () => Toast.warning('Low storage', 'Only 120 MB left on this device.'),
  },
  {
    label: 'Info',
    color: '#0A84FF',
    run: () => Toast.info('New version available'),
  },
  {
    label: 'Bottom',
    color: '#8E8E93',
    run: () =>
      Toast.message('Copied to clipboard', undefined, { position: 'bottom' }),
  },
];

export default function App() {
  return (
    <ToastProvider>
      <View style={styles.container}>
        {buttons.map((b) => (
          <Pressable
            key={b.label}
            onPress={b.run}
            style={[styles.button, { backgroundColor: b.color }]}
          >
            <Text style={styles.text}>{b.label}</Text>
          </Pressable>
        ))}
      </View>
    </ToastProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 28,
    borderRadius: 14,
    minWidth: 160,
    alignItems: 'center',
  },
  text: { color: '#fff', fontWeight: '700', fontSize: 16 },
});
