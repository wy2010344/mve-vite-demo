
import * as THREE from 'three';
import { tileSize } from './constants';
import { Wheel } from './Wheel';


/**
 * 卡车
 * @param initialTileIndex 
 * @param direction 
 * @param color 
 */
export function Truck(initialTileIndex: number, direction: boolean, color: number) {
  const truck = new THREE.Group()
  truck.position.x = initialTileIndex * tileSize
  if (!direction) {
    truck.position.z = Math.PI
  }

  //货物
  const cargo = new THREE.Mesh(
    new THREE.BoxGeometry(70, 35, 35),
    new THREE.MeshLambertMaterial({
      color: 0xb4c6fc,
      flatShading: true
    })
  )

  cargo.castShadow = true;
  cargo.receiveShadow = true;
  truck.add(cargo)

  cargo.position.x = -15
  cargo.position.z = 25

  //舱
  const cabin = new THREE.Mesh(
    new THREE.BoxGeometry(30, 30, 30),
    new THREE.MeshLambertMaterial({
      color,
      flatShading: true
    })
  )

  cabin.position.x = 35
  cabin.position.z = 20

  cabin.castShadow = true;
  cabin.receiveShadow = true;
  truck.add(cabin)

  const frontWheel = Wheel(37)
  truck.add(frontWheel)

  const middleWheel = Wheel(5)
  truck.add(middleWheel)

  const backWheel = Wheel(-15)
  truck.add(backWheel)
  return truck
}