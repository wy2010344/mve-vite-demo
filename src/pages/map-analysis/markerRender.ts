import { createAppendSet, createRenderChildren } from 'mve-core';
import { diffMoveOrderLess, ReadSet } from 'wy-helper';

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
  createAppendSet
);
