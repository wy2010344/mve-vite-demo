import * as THREE from "three";
import { tileSize, tilesPerRow } from "./constants";



export function Road(rowIndex: number) {
  const road = new THREE.Group()

  road.position.y = rowIndex * tileSize

  const foundation = new THREE.Mesh(
    new THREE.PlaneGeometry(tilesPerRow * tileSize, tileSize),
    new THREE.MeshLambertMaterial({
      color: 0x454a59
    })
  )

  foundation.receiveShadow = true
  road.add(foundation)
  return road
}