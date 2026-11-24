import { useCallback, useEffect, useMemo, useRef } from 'react';
import {
  Animated,
  Easing,
  PanResponder,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
  useColorScheme,
} from 'react-native';
import { palette } from './theme';
import { ToastIcon } from './ToastIcon';
import type { ToastItemData } from './types';

interface Props {
  toast: ToastItemData;
  onDismiss: (id: string) => void;
}

const DEFAULT_DURATION = 5000;
const SWIPE_DISMISS_DISTANCE = 40;

export function ToastItem({ toast, onDismiss }: Props) {
  const {
    id,
    type = 'default',
    title,
    message,
    duration = DEFAULT_DURATION,
    position = 'top',
    swipeToDismiss = true,
    showProgress = true,
    onPress,
  } = toast;

  const isDark = useColorScheme() === 'dark';
  const colors = palette[type];
  const isTop = position === 'top';
  const hiddenY = isTop ? -120 : 120;

  const enter = useRef(new Animated.Value(0)).current; // 0 hidden → 1 shown
  const drag = useRef(new Animated.Value(0)).current;
  const dismissed = useRef(false);
  // 1 → 0 over `duration`; when it reaches 0 the toast hides itself.
  const progress = useRef(new Animated.Value(1)).current;
  const progressValue = useRef(1);

  const dismiss = useCallback(() => {
    if (dismissed.current) return;
    dismissed.current = true;
    progress.stopAnimation();
    Animated.timing(enter, {
      toValue: 0,
      duration: 220,
      easing: Easing.in(Easing.cubic),
      useNativeDriver: true,
    }).start(() => onDismiss(id));
  }, [enter, id, onDismiss, progress]);

  const runProgress = useCallback(() => {
    if (duration <= 0) return;
    Animated.timing(progress, {
      toValue: 0,
      duration: duration * progressValue.current,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start(({ finished }) => {
      if (finished) dismiss();
    });
  }, [duration, progress, dismiss]);

  useEffect(() => {
    const listenerId = progress.addListener(({ value }) => {
      progressValue.current = value;
    });
    Animated.spring(enter, {
      toValue: 1,
      damping: 16,
      stiffness: 190,
      mass: 0.9,
      useNativeDriver: true,
    }).start();
    runProgress();
    return () => {
      progress.removeListener(listenerId);
      progress.stopAnimation();
    };
    // Run once per toast.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const pan = useMemo(
    () =>
      PanResponder.create({
        onMoveShouldSetPanResponder: (_, g) =>
          swipeToDismiss &&
          Math.abs(g.dy) > 6 &&
          Math.abs(g.dy) > Math.abs(g.dx),
        onPanResponderGrant: () => {
          progress.stopAnimation(); // pause while dragging
        },
        onPanResponderMove: (_, g) => {
          // Only allow dragging toward the screen edge it came from.
          drag.setValue(isTop ? Math.min(0, g.dy) : Math.max(0, g.dy));
        },
        onPanResponderRelease: (_, g) => {
          const away = isTop ? -g.dy : g.dy;
          if (away > SWIPE_DISMISS_DISTANCE || Math.abs(g.vy) > 0.8) {
            dismiss();
          } else {
            Animated.spring(drag, {
              toValue: 0,
              useNativeDriver: true,
            }).start();
            runProgress(); // resume from where it paused
          }
        },
      }),
    [swipeToDismiss, isTop, drag, dismiss, progress, runProgress]
  );

  const translateY = Animated.add(
    enter.interpolate({ inputRange: [0, 1], outputRange: [hiddenY, 0] }),
    drag
  );
  const scale = enter.interpolate({
    inputRange: [0, 1],
    outputRange: [0.92, 1],
    extrapolate: 'clamp',
  });
  const opacity = enter.interpolate({
    inputRange: [0, 0.6, 1],
    outputRange: [0, 1, 1],
    extrapolate: 'clamp',
  });

  // Android draws elevation shadows through translucent fills, so use a
  // near-opaque glass there; iOS keeps the see-through look.
  const glass = isDark ? colors.glassDark : colors.glassLight;
  const body =
    Platform.OS === 'android' ? glass.replace(/[\d.]+\)$/, '0.97)') : glass;

  const textPrimary = isDark ? '#FFFFFF' : '#111114';
  const textSecondary = isDark
    ? 'rgba(255,255,255,0.72)'
    : 'rgba(17,17,20,0.66)';

  return (
    <Animated.View
      {...pan.panHandlers}
      accessibilityRole="alert"
      accessibilityLiveRegion="polite"
      style={[
        styles.shadow,
        { shadowColor: colors.accent, opacity },
        { transform: [{ translateY }, { scale }] },
      ]}
    >
      <Pressable
        disabled={!onPress}
        onPress={() => {
          onPress?.();
          dismiss();
        }}
        style={[
          styles.glass,
          {
            backgroundColor: body,
            borderColor: isDark
              ? 'rgba(255,255,255,0.18)'
              : 'rgba(255,255,255,0.9)',
          },
        ]}
      >
        {/* Liquid-glass specular highlight across the top half */}
        <View
          pointerEvents="none"
          style={[
            styles.highlight,
            {
              backgroundColor: isDark
                ? 'rgba(255,255,255,0.07)'
                : 'rgba(255,255,255,0.45)',
            },
          ]}
        />
        {/* Progress fill: drains right-to-left, toast hides when it ends */}
        {showProgress && duration > 0 && (
          <Animated.View
            pointerEvents="none"
            style={[
              styles.progress,
              {
                backgroundColor: colors.accent,
                width: progress.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0%', '100%'],
                }),
              },
            ]}
          />
        )}
        <ToastIcon type={type} color={colors.accent} />
        <View style={styles.texts}>
          {!!title && (
            <Text
              numberOfLines={1}
              style={[styles.title, { color: textPrimary }]}
            >
              {title}
            </Text>
          )}
          {!!message && (
            <Text
              numberOfLines={3}
              style={[
                styles.message,
                { color: textSecondary },
                !title && styles.messageOnly,
              ]}
            >
              {message}
            </Text>
          )}
        </View>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  shadow: {
    marginVertical: 6,
    borderRadius: 26,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.28,
    shadowRadius: 18,
    elevation: 10,
  },
  glass: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 56,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 26,
    borderWidth: StyleSheet.hairlineWidth * 2,
    overflow: 'hidden',
  },
  highlight: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '50%',
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
  },
  progress: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    opacity: 0.22,
  },
  texts: {
    flex: 1,
    marginLeft: 12,
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: -0.1,
  },
  message: {
    fontSize: 13.5,
    marginTop: 1,
    lineHeight: 18,
  },
  messageOnly: {
    fontSize: 15,
    marginTop: 0,
  },
});
