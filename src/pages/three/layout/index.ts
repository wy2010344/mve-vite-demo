import * as THREE from 'three';
import { hookAddResult } from 'mve-core';
import { hookTrackSignal } from 'mve-helper';
import { windowSize } from 'wy-dom-helper';
import {
  flex3,
  getPerspectiveCamera,
  hookOrbitControls,
  hookThreeCenterPosition,
  renderLayoutNode3,
  renderMesh,
  renderThreeView,
} from 'mve-three';

function renderBoxNode(
  color: number,
  width: number,
  height: number,
  depth: number
) {
  renderLayoutNode3({
    width,
    height,
    depth,
    children() {
      const n = this;
      const mesh = renderMesh();
      mesh.material = new THREE.MeshPhongMaterial({
        color,
        shininess: 30,
      });
      hookTrackSignal(() => {
        const old = mesh.geometry;
        mesh.geometry = new THREE.BoxGeometry(
          n.outerWidth(),
          n.outerHeight(),
          n.outerDepth()
        );
        old.dispose();
      });
      hookThreeCenterPosition(n);
    },
  });
}

export default function () {
  const camera = getPerspectiveCamera(windowSize.width, windowSize.height);
  camera.position.z = 10;
  camera.position.y = 5;
  renderThreeView({
    camera,
    width: windowSize.width,
    height: windowSize.height,
    render(scene) {
      hookOrbitControls();
      hookAddResult(new THREE.AmbientLight(0xffffff, 0.5));
      const light = new THREE.DirectionalLight(0xffffff, 0.8);
      light.position.set(1, 1, 1);
      hookAddResult(light);
      hookAddResult(new THREE.AxesHelper(5));

      renderLayoutNode3({
        x: 1,
        y: 1,
        z: 1,
        layout: flex3({ direction: 'x', gap: 1, alignItem: 'stretch' }),
        children() {
          renderBoxNode(0xff0000, 1, 2, 1);
          renderBoxNode(0x00ff00, 1.5, 1, 1.5);
          renderBoxNode(0x0000ff, 1, 1, 2);
        },
      });
    },
  });
}
