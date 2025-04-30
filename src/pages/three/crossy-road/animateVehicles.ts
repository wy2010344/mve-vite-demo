
import * as THREE from 'three'
import { metadata as rows } from "./Map";
import { maxTileIndex, minTileIndex, tileSize } from './constants';

const clock = new THREE.Clock();
export function animateVehicles() {
  const delta = clock.getDelta()
  // Animate cars and trucks
  rows.forEach((rowData) => {
    if (rowData.type === "car" || rowData.type === "truck") {
      const beginningOfRow = (minTileIndex - 2) * tileSize;
      const endOfRow = (maxTileIndex + 2) * tileSize;

      rowData.vehicles.forEach(({ ref }) => {
        const obj = ref.get()
        if (!ref) throw Error("Vehicle reference is missing");

        if (rowData.direction) {
          obj.position.x =
            obj.position.x > endOfRow
              ? beginningOfRow
              : obj.position.x + rowData.speed * delta;
        } else {
          obj.position.x =
            obj.position.x < beginningOfRow
              ? endOfRow
              : obj.position.x - rowData.speed * delta;
        }
      });
    }
  });
}