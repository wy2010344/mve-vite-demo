import * as THREE from 'three';
import { metadata as rows } from './Map';
import { player, position } from './Player';
import { createSignal } from 'wy-helper';
export const finished = createSignal(false);
export function hitTest() {
  const row = rows[position.currentRow - 1];
  if (!row) return;

  if (row.type === 'car' || row.type === 'truck') {
    const playerBoundingBox = new THREE.Box3();
    playerBoundingBox.setFromObject(player);

    row.vehicles.forEach(({ ref }) => {
      const obj = ref.get();
      if (!obj) throw Error('Vehicle reference is missing');

      const vehicleBoundingBox = new THREE.Box3();
      vehicleBoundingBox.setFromObject(obj);

      if (playerBoundingBox.intersectsBox(vehicleBoundingBox)) {
        finished.set(true);
      }
    });
  }
}
