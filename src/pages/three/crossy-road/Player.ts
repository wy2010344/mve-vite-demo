import * as THREE from 'three';
import { endsUpInValidPosition } from './endsUpInValidPosition';
import { metadata as rows, addRows } from './Map';
import { createSignal } from 'wy-helper';

function Player() {
  const player = new THREE.Group();
  const body = new THREE.Mesh(
    new THREE.BoxGeometry(5, 5, 20),
    new THREE.MeshLambertMaterial({
      color: 'white',
      flatShading: true,
    })
  );
  body.position.z = 10;
  body.castShadow = true;
  body.receiveShadow = true;
  player.add(body);
  const cap = new THREE.Mesh(
    new THREE.BoxGeometry(2, 4, 2),
    new THREE.MeshLambertMaterial({
      color: 0xf0619a,
      flatShading: true,
    })
  );

  cap.position.z = 21;
  cap.castShadow = true;
  player.add(cap);

  const playerContainer = new THREE.Group();
  playerContainer.add(player);

  return playerContainer;
}

export const player = Player();

export const position: {
  currentRow: number;
  currentTile: number;
} = {
  currentRow: 0,
  currentTile: 0,
};

export type MoveDirection = 'forward' | 'backward' | 'left' | 'right';
export const movesQueue: MoveDirection[] = [];

export function queueMove(direction: MoveDirection) {
  const isValidMove = endsUpInValidPosition(
    {
      rowIndex: position.currentRow,
      tileIndex: position.currentTile,
    },
    [...movesQueue, direction]
  );

  if (!isValidMove) return;
  movesQueue.push(direction);
}

export function stepCompleted() {
  const direction = movesQueue.shift();

  if (direction === 'forward') position.currentRow += 1;
  if (direction === 'backward') position.currentRow -= 1;
  if (direction === 'left') position.currentTile -= 1;
  if (direction === 'right') position.currentTile += 1;

  if (position.currentRow > rows.length - 10) {
    addRows();
  }
  score.set(position.currentRow);
}

export const score = createSignal(0);
