import { createSignal } from 'wy-helper';

export const uiStore = {
  isStartMenuOpen: createSignal(false),
  toggleStartMenu() {
    this.isStartMenuOpen.set(!this.isStartMenuOpen.get());
  },
  closeStartMenu() {
    this.isStartMenuOpen.set(false);
  },
};
