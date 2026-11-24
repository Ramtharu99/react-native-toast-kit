import { describe, expect, it } from '@jest/globals';
import { Toast } from '../index';
import { subscribe } from '../toastManager';
import type { ToastItemData } from '../types';

describe('Toast', () => {
  it('adds typed toasts and hides them', () => {
    let current: ToastItemData[] = [];
    const off = subscribe((t) => {
      current = t;
    });

    const id = Toast.success('Saved', 'All good');
    expect(current).toHaveLength(1);
    expect(current[0]).toMatchObject({ type: 'success', title: 'Saved' });

    Toast.hide(id);
    expect(current).toHaveLength(0);
    off();
  });

  it('keeps at most 3 toasts visible', () => {
    let current: ToastItemData[] = [];
    const off = subscribe((t) => {
      current = t;
    });
    for (let i = 0; i < 5; i++) Toast.info(`n${i}`);
    expect(current).toHaveLength(3);
    Toast.hide();
    off();
  });
});
