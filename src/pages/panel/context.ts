import { globalStorageSignal } from 'mve-dom-helper';
import { KScheme } from 'wy-helper';

export const sourceColor = globalStorageSignal<string>(
  'panel-theme-color',
  '#ffffff'
);
export const scheme = globalStorageSignal<KScheme>(
  'panel-theme-scheme',
  'light'
);
export const level = globalStorageSignal<number>('panel-theme-level', 0);
