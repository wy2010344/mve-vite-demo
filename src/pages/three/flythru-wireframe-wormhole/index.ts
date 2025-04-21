import { windowSize } from "wy-dom-helper";
import { getPerspectiveCamera, hookOrbitControls, renderMesh, renderThreeView } from "../../../hookThreeView";
import { hookAddResult } from "mve-core";

import * as THREE from 'three'
import spline from "./spline";


export default function () {
  const camera = getPerspectiveCamera(windowSize.width, windowSize.height)

  const renderer = renderThreeView({
    camera,
    width: windowSize.width,
    height: windowSize.height,
    render(scene) {
      scene.fog = new THREE.FogExp2(0x000000, 0.3);
      const controls = hookOrbitControls()
      controls.enableDamping = true
      controls.dampingFactor = 0.03

      hookAddResult(new THREE.HemisphereLight(0xffffff, 0x444444))


      const points = spline.getPoints(100)

      const mesh = renderMesh()
      mesh.geometry = new THREE.TubeGeometry(spline, 222, 0.65, 16, true)
      mesh.material = new THREE.MeshStandardMaterial({
        color: 0x0099ff,
        side: THREE.DoubleSide,
        wireframe: true
      })
    },
  })

  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
}