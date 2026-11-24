# react-native-toast-kit

Glass-style toast notifications for React Native CLI. Pure JS: no native modules, no pods, no linking, no extra dependencies.

## Install

```sh
npm install react-native-toast-kit
```

## Usage

Wrap your app once:

```tsx
import { ToastProvider } from 'react-native-toast-kit';

export default function Root() {
  return (
    <ToastProvider>
      <App />
    </ToastProvider>
  );
}
```

Then call it from anywhere, including outside components:

```tsx
import { Toast } from 'react-native-toast-kit';

Toast.success('Saved', 'Your changes are live.');
Toast.error('Upload failed', 'Check your connection.');
Toast.warning('Low storage');
Toast.info('New version available');
Toast.message('Copied', undefined, { position: 'bottom' });
```

## Options

| Option           | Type                                                    | Default |
| ---------------- | ------------------------------------------------------- | ------- |
| `type`           | `'success' \| 'error' \| 'warning' \| 'info' \| 'default'` | `default` |
| `title`          | `string`                                                |         |
| `message`        | `string`                                                |         |
| `duration`       | `number` (ms, `0` = until dismissed)                    | `3000`  |
| `position`       | `'top' \| 'bottom'`                                     | `top`   |
| `offset`         | `number`                                                | `0`     |
| `swipeToDismiss` | `boolean`                                               | `true`  |
| `onPress`        | `() => void`                                            |         |
| `onHide`         | `() => void`                                            |         |

`Toast.show(options)` accepts all of these and returns an id; `Toast.hide(id?)` removes one toast, or all of them.

## Look

Each type has its own color (green, red, amber, blue, grey), with light and dark mode support, a translucent glass body, specular highlight, spring animation and swipe-to-dismiss.

## License

MIT
