import {
  createRenderChildren,
  hookCurrentStateHolder,
  purifySet,
  renderRoot,
  ShareConfig,
} from 'mve-core';
import { diffMoveOrderLess, ReadSet } from 'wy-helper';

const markerConfig: ShareConfig<any, ReadSet<any>> = {
  purifyList(list) {
    const newSet = new Set<any>();
    purifySet(list, newSet, () => false);
    return newSet;
  },
  after() {},
};

/**
 * parent是map
 * children是marker
 */
export const markerRender = createRenderChildren<any, ReadSet<any>>(
  //顺序无影响
  diffMoveOrderLess({
    removeChild(parent, child) {
      parent.remove(child);
    },
    appendChild(parent, child) {
      parent.add(child);
    },
  }),
  function (node, callback) {
    const state = hookCurrentStateHolder(true);
    const root = renderRoot(node, markerConfig, function () {
      callback.call(this);
    });
    state.addDestroy(() => {
      root.destroy();
    });
    return root.target;
  },
  function (node, callback) {
    const state = hookCurrentStateHolder(true);
    const root = renderRoot(node, markerConfig, function () {
      callback.call(this);
    });
    return root;
  }
);
