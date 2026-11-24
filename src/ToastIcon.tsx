import { StyleSheet, Text, View } from 'react-native';
import type { ToastType } from './types';

const SIZE = 30;

export function ToastIcon({ type, color }: { type: ToastType; color: string }) {
  return (
    <View style={[styles.badge, { backgroundColor: `${color}38` }]}>
      {type === 'success' && (
        <View style={[styles.check, { borderColor: color }]} />
      )}
      {type === 'error' && (
        <>
          <View
            style={[
              styles.bar,
              { backgroundColor: color, transform: [{ rotate: '45deg' }] },
            ]}
          />
          <View
            style={[
              styles.bar,
              { backgroundColor: color, transform: [{ rotate: '-45deg' }] },
            ]}
          />
        </>
      )}
      {type === 'warning' && <Text style={[styles.glyph, { color }]}>!</Text>}
      {type === 'info' && <Text style={[styles.glyph, { color }]}>i</Text>}
      {type === 'default' && (
        <View style={[styles.dot, { backgroundColor: color }]} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    width: SIZE,
    height: SIZE,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  check: {
    width: 7,
    height: 13,
    borderRightWidth: 3,
    borderBottomWidth: 3,
    transform: [{ rotate: '45deg' }, { translateY: -1.5 }],
  },
  bar: {
    position: 'absolute',
    width: 18,
    height: 3,
    borderRadius: 2,
  },
  glyph: {
    fontSize: 22,
    fontWeight: '800',
    includeFontPadding: false,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});
