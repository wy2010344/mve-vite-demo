import { renderArrayKey, renderIf, renderOne, renderOneKey } from 'mve-helper';
import { GetValue, ReadArray } from 'wy-helper';

export function If({
  condition,
  whenTrue,
  whenFalse,
}: {
  condition(): any;
  whenTrue(): void;
  whenFalse?(): void;
}) {
  renderIf(condition, whenTrue, whenFalse);
}

export function HookRender({ render }: { render(): void }) {
  render();
}

export function ArrayRender<T>({
  getArray,
  getKey,
  render,
}: {
  getArray: GetValue<ReadArray<T>>;
  getKey(v: T): any;
  render(getValue: GetValue<T>, getIndex: GetValue<number>, key: any): void;
}) {
  renderArrayKey(getArray, getKey, render);
}

export function OneRender<K>({
  key,
  render,
}: {
  key: GetValue<K>;
  render(v: K): void;
}) {
  renderOne(key, render);
}
