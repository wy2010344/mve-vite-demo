import { subscribeEventListener, windowSize } from "wy-dom-helper";
import { getPerspectiveCamera, hookOrbitControls, renderThreeView, ThreeContext } from "../../../hookThreeView";
import { hookDestroy, hookPromiseSignal, hookTrackSignal, promiseSignal, renderIf, renderOne } from "mve-helper";
import RAPIER from '@dimforge/rapier3d-compat'
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import * as THREE from 'three'
import { getBody, getMouseBall, loadGLTFModels } from "./getBodies";

import { UltraHDRLoader } from 'three/examples/jsm/loaders/UltraHDRLoader.js';
import getLayer from "./getLayer";
import { hookAddResult } from "mve-core";
const envs = import.meta.glob<string>('./envs/*', {
  eager: true,
  query: '?url',
  import: 'default'
})
console.log("envs", envs)
export default function () {

  const signal = promiseSignal(Promise.all([
    RAPIER.init(),
    loadGLTFModels()
  ]))

  renderOne(signal.get, function (value) {
    if (value?.type == 'success') {

      const gravity = { x: 0.0, y: 0, z: 0.0 };
      const world = new RAPIER.World(gravity);

      const camera = getPerspectiveCamera(windowSize.width, windowSize.height)
      renderThreeView({
        camera,
        width: windowSize.width,
        height: windowSize.height,
        args: {
          antialias: true
        },
        // notRender: true,
        render(scene) {
          const { renderer, hookAnimationLoop } = ThreeContext.consume()
          renderer.toneMapping = THREE.ACESFilmicToneMapping;
          renderer.outputColorSpace = THREE.SRGBColorSpace;


          hookOrbitControls().enableDamping = true


          const hdrLoader = new UltraHDRLoader();
          hdrLoader.load(envs['./envs/san_giuseppe_bridge_2k.jpg'], (hdr) => {
            hdr.mapping = THREE.EquirectangularReflectionMapping;
            // scene.background = hdr;
            scene.environment = hdr;
          });



          // const renderScene = new RenderPass(scene, camera);
          // const bloomPass = new UnrealBloomPass(new THREE.Vector2(windowSize.width(), windowSize.height()), 2.0, 0.0, 0.005);
          // hookTrackSignal(() => {
          //   bloomPass.resolution.width = windowSize.width()
          //   bloomPass.resolution.height = windowSize.height()
          // })
          // const composer = new EffectComposer(renderer);
          // composer.addPass(renderScene);
          // composer.addPass(bloomPass);
          // hookAnimationLoop(()=>{
          //   composer.render(t);
          // })

          const numBodies = 100;
          const bodies: ReturnType<typeof getBody>[] = [];
          for (let i = 0; i < numBodies; i++) {
            const body = getBody(world);
            bodies.push(body);
            scene.add(body.mesh);
          }

          const mouseBall = getMouseBall(world);
          scene.add(mouseBall.mesh);
          const mousePos = new THREE.Vector3(0, 0, 0);
          hookDestroy(subscribeEventListener(window, 'pointermove', e => {
            mousePos.x = (e.clientX / window.innerWidth) * 2 - 1;
            mousePos.y = -(e.clientY / window.innerHeight) * 2 + 1;
          }))
          hookAnimationLoop((t) => {
            world.step();
            mouseBall.update(mousePos)
            bodies.forEach(b => b.update());
          })
          renderSpritesBG()
          renderRaycast()
          renderLight()
        },
      })
    }
  })
}

function renderRaycast() {
  const { camera, hookAnimationLoop } = ThreeContext.consume()
  // Mouse Interactivity
  const raycaster = new THREE.Raycaster();
  const pointerPos = new THREE.Vector2(0, 0);
  const mousePos = new THREE.Vector3(0, 0, 0);

  const mousePlaneGeo = new THREE.PlaneGeometry(48, 48, 48, 48);
  const mousePlaneMat = new THREE.MeshBasicMaterial({
    wireframe: true,
    color: 0x00ff00,
    transparent: true,
    opacity: 0.0
  });
  const mousePlane = new THREE.Mesh(mousePlaneGeo, mousePlaneMat);
  mousePlane.position.set(0, 0, 0.2);
  hookAddResult(mousePlane);


  let cameraDirection = new THREE.Vector3();
  hookAnimationLoop(() => {
    // orient the mouse plane to the camera
    camera.getWorldDirection(cameraDirection);
    cameraDirection.multiplyScalar(-1);
    mousePlane.lookAt(cameraDirection);

    raycaster.setFromCamera(pointerPos, camera);
    const intersects = raycaster.intersectObjects(
      [mousePlane],
      false
    );
    if (intersects.length > 0) {
      mousePos.copy(intersects[0].point);
    }
  })
}

function renderLight() {

  const hemiLight = new THREE.HemisphereLight(0x00bbff, 0xaa00ff);
  hemiLight.intensity = 0.2;
  hookAddResult(hemiLight);
}

function renderSpritesBG() {
  // Sprites BG
  const gradientBackground = getLayer({
    hue: 0.6,
    numSprites: 8,
    opacity: 0.2,
    radius: 10,
    size: 24,
    z: -10.5,
  });
  hookAddResult(gradientBackground);

  const pointsGeo = new THREE.BufferGeometry();
  const pointsMat = new THREE.PointsMaterial({
    size: 0.035,
    vertexColors: true
  });
  const points = new THREE.Points(pointsGeo, pointsMat);
  hookAddResult(points);

}