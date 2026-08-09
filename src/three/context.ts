import {
  createContext,
  hookCurrentStateHolder,
  renderRoot,
  ShareConfig,
} from 'mve-core';
import { Mesh } from 'three';
import GUI from 'three/examples/jsm/libs/lil-gui.module.min.js';
import { EmptyFun } from 'wy-helper';

import * as THREE from 'three';

export const GlobalContext = createContext<{
  gui: GUI;
  renderer: THREE.WebGLRenderer;
}>(undefined as any);

const ParentContext = createContext<Mesh>(undefined as any);

const scopedConfig: ShareConfig<any, any> = {
  purifyList(list) {
    return list;
  },
  after() {},
};

export function withParent(p: Mesh, fun: EmptyFun) {
  const state = hookCurrentStateHolder(true);
  const root = renderRoot(p, scopedConfig, function () {
    ParentContext.provide(p);
    fun();
  });
  state.addDestroy(() => {
    root.destroy();
  });
}
export function findParent() {
  return ParentContext.consume();
}
