import * as THREE from 'three';
import { hookAddResult } from "mve-core";
import { getPerspectiveCamera, hookOrbitControls, renderMesh, renderThreeView } from "../../../hookThreeView";
import { windowSize } from "wy-dom-helper";

export default function () {
  const camera = getPerspectiveCamera(windowSize.width, windowSize.height)
  camera.fov = 75
  camera.near = 0.1
  camera.far = 1000
  camera.position.z = 5
  // //点光源
  // const sun = new THREE.DirectionalLight()
  // sun.position.set(1, 2, 3)
  // sun.intensity = 3
  // scene.add(sun)
  // //环境光
  // const ambient = new THREE.AmbientLight()
  // ambient.intensity = 0.5
  // scene.add(ambient)
  renderThreeView({
    camera,
    width: windowSize.width,
    height: windowSize.height,
    render(scene) {
      hookAddResult(
        new THREE.HemisphereLight(0x0099ff, 0xaa5500)
      )

      // const rootGroup = new THREE.Group()
      // rootGroup.position.z = -2
      // scene.add(rootGroup)
      const mesh = renderMesh()
      mesh.geometry = new THREE.IcosahedronGeometry(1.0, 12)
      mesh.material = new THREE.MeshStandardMaterial({
        color: 0xfffff,
        flatShading: true
      })
      // const wireMesh = new THREE.Mesh()
      // wireMesh.geometry = mesh.geometry
      // wireMesh.material = new THREE.MeshBasicMaterial({
      //   color: 0xffffff,
      //   wireframe: true
      // })

      // wireMesh.scale.setScalar(1.0001)
      // scene.add(wireMesh)

      const controls = hookOrbitControls()
      controls.enableDamping = true
      controls.dampingFactor = 0.03
    },
  })


  // controls.update()
}