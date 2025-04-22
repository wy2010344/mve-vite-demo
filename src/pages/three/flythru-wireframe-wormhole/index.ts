import { windowSize } from "wy-dom-helper";
import { getPerspectiveCamera, hookOrbitControls, renderMesh, renderThreeView, ThreeContext } from "../../../hookThreeView";
import { hookAddResult } from "mve-core";

import * as THREE from 'three'
import spline from "./spline";

import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { hookTrackSignal } from "mve-helper";

/**
 * https://github.com/bobbyroe/flythru-wireframe-wormhole/blob/add-soundfx/index.js
 */
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


      const { renderer, hookAnimationLoop } = ThreeContext.consume()
      // post-processing
      const renderScene = new RenderPass(scene, camera);
      const bloomPass = new UnrealBloomPass(new THREE.Vector2(windowSize.width(), windowSize.height()), 3.5, 0, 0.002);
      hookTrackSignal(() => {
        bloomPass.resolution = new THREE.Vector2(windowSize.width(), windowSize.height())
      })
      bloomPass.threshold = 0.002;
      bloomPass.strength = 3.5;
      bloomPass.radius = 0;
      const composer = new EffectComposer(renderer);
      composer.addPass(renderScene);
      composer.addPass(bloomPass);


      hookAnimationLoop((t) => {
        composer.render(t);
      })





      hookAddResult(new THREE.HemisphereLight(0xffffff, 0x444444))


      const points = spline.getPoints(100)
      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      const material = new THREE.LineBasicMaterial({ color: 0xff0000 });
      const line = new THREE.Line(geometry, material);

      // create a tube geometry from the spline
      const tubeColor = 0x00ccff;
      const tubeGeo = new THREE.TubeGeometry(spline, 222, 0.65, 16, true);
      const tubeLines = hookAddResult(new THREE.LineSegments())
      tubeLines.geometry = new THREE.EdgesGeometry(tubeGeo, 0.2)
      tubeLines.material = new THREE.LineBasicMaterial({ color: tubeColor })


      const tubeHitArea = renderMesh()
      tubeHitArea.geometry = tubeGeo
      tubeHitArea.material = new THREE.MeshBasicMaterial({
        color: tubeColor,
        transparent: true,
        opacity: 0.0,
        side: THREE.BackSide
      })
      hookAnimationLoop(t => {
        const time = t * 0.1;
        const looptime = 10 * 1000;
        const p = (time % looptime) / looptime;
        const pos = tubeGeo.parameters.path.getPointAt(p);
        const lookAt = tubeGeo.parameters.path.getPointAt((p + 0.03) % 1);
        camera.position.copy(pos);
        camera.lookAt(lookAt);
      })
    },
  })

  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.outputColorSpace = THREE.SRGBColorSpace;


}