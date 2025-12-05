import {
  createSignal,
  debounce,
  debounceEager,
  subscribeTimeout,
} from 'wy-helper';
import { LocationPoint } from './types';
import { hookTrackSignal } from 'mve-helper';

/**
 * 防抖状态hook
 */
export function hookDebounceState(
  get: () => string,
  arg: number | ((callback: () => void) => () => void),
  erger?: boolean
) {
  const state = createSignal(get());
  hookTrackSignal(
    get,
    (erger ? debounceEager : debounce)(
      state.set,
      typeof arg == 'number'
        ? callback => {
            return subscribeTimeout(callback, arg);
          }
        : arg
    )
  );
  return state.get;
}

/**
 * 检查点是否包含在列表中
 */
export function includePoint(
  fs: readonly LocationPoint[],
  dp: LocationPoint
): boolean {
  return !!fs.find(x => x.address == dp.address && x.name == dp.name);
}
