import { hookDestroy } from "mve-helper";
import { subscribeEventListener } from "wy-dom-helper";
import * as THREE from 'three';
/**
 * 这个确是绑定camera的...
 */
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { hookAddResult } from "mve-core";

export default function () {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000);
  const renderer = new THREE.WebGLRenderer();


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


  const hemiLight = new THREE.HemisphereLight(0x0099ff, 0xaa5500)
  scene.add(hemiLight)
  // const rootGroup = new THREE.Group()
  // rootGroup.position.z = -2
  // scene.add(rootGroup)

  const mesh = new THREE.Mesh()
  mesh.geometry = new THREE.IcosahedronGeometry(1.0, 12)
  mesh.material = new THREE.MeshStandardMaterial({
    color: 0xfffff,
    flatShading: true
  })
  scene.add(mesh)


  // const wireMesh = new THREE.Mesh()
  // wireMesh.geometry = mesh.geometry
  // wireMesh.material = new THREE.MeshBasicMaterial({
  //   color: 0xffffff,
  //   wireframe: true
  // })

  // wireMesh.scale.setScalar(1.0001)
  // scene.add(wireMesh)

  /**旋转等查看 */
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true
  controls.dampingFactor = 0.03

  renderer.setAnimationLoop(function () {
    controls.update()
    renderer.render(scene, camera);
  })
  renderer.setSize(window.innerWidth, window.innerHeight);
  hookDestroy(subscribeEventListener(window, 'resize', e => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
  }))
  hookAddResult(renderer.domElement)
}