import { subscribeEventListener, windowSize } from 'wy-dom-helper';
import {
  getPerspectiveCamera,
  hookOrbitControls,
  renderGroup,
  renderMesh,
  renderThreeView,
  ThreeContext,
} from '../../../hookThreeView';
import { hookAddResult } from 'mve-core';

import * as THREE from 'three';
import spline from './spline';

import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { hookDestroy, hookTrackSignal } from 'mve-helper';
import getStarfield from './getStarField';

const sfx = import.meta.glob<string>('./sfx/*', {
  eager: true,
  query: '?url',
  import: 'default',
});

/**
 * 为什么加了不正常??
 */
function postProcessing() {
  const { renderer, hookAnimationLoop, scene, camera } = ThreeContext.consume();
  // post-processing
  const renderScene = new RenderPass(scene, camera);
  const bloomPass = new UnrealBloomPass(
    new THREE.Vector2(windowSize.width(), windowSize.height()),
    1.5,
    0.4,
    100
  );
  hookTrackSignal(() => {
    bloomPass.resolution = new THREE.Vector2(
      windowSize.width(),
      windowSize.height()
    );
  });
  bloomPass.threshold = 0.002;
  bloomPass.strength = 3.5;
  bloomPass.radius = 0;
  const composer = new EffectComposer(renderer);
  composer.addPass(renderScene);
  composer.addPass(bloomPass);
  hookAnimationLoop(t => {
    //@ts-expect-error no check
    composer.render(scene, camera);
  });
}

function soundEffects() {
  const { camera } = ThreeContext.consume();

  const sounds = [];
  let fitzSound!: THREE.Audio<GainNode>, laserSound!: THREE.Audio<GainNode>;
  const manager = new THREE.LoadingManager();
  const audioLoader = new THREE.AudioLoader(manager);
  const mp3s = ['fitz', 'laser-01', 'blarmp'];
  const listener = new THREE.AudioListener();
  camera.add(listener);
  mp3s.forEach(name => {
    const sound = new THREE.Audio(listener);
    sound.name = name;
    if (name === 'blarmp') {
      fitzSound = sound;
    }
    if (name === 'laser-01') {
      laserSound = sound;
    }
    sounds.push(sound);
    audioLoader.load(sfx[`./sfx/${name}.mp3`], function (buffer) {
      sound.setBuffer(buffer);
    });
  });
  return {
    fitzSound,
    laserSound,
  };
}
/**
 * https://github.com/bobbyroe/flythru-wireframe-wormhole/blob/add-soundfx/index.js
 * 感觉总不如预期..
 */
export default function () {
  const camera = getPerspectiveCamera(windowSize.width, windowSize.height);
  const renderer = renderThreeView({
    camera,
    width: windowSize.width,
    notRender: true,
    height: windowSize.height,
    render(scene) {
      hookAddResult(camera);
      scene.fog = new THREE.FogExp2(0x000000, 0.3);
      const controls = hookOrbitControls();
      controls.enableDamping = true;
      controls.dampingFactor = 0.03;

      hookAddResult(getStarfield());
      // hookAddResult(new THREE.HemisphereLight(0xffffff, 0x444444))
      const { tubeGeo, tubeHitArea } = renderTube();
      const boxGroup = renderBox(tubeGeo);
      const crosshairs = renderCrossHairs();
      onWindowClick(crosshairs, boxGroup, tubeHitArea);
      /**
       * 这个还必须放在最后
       */
      postProcessing();
    },
  });

  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
}

/**
 * 渲染虫洞
 */
function renderTube() {
  // const points = spline.getPoints(100)
  // const geometry = new THREE.BufferGeometry().setFromPoints(points);
  // const material = new THREE.LineBasicMaterial({ color: 0xff0000 });
  // const line = new THREE.Line(geometry, material);

  // create a tube geometry from the spline
  const tubeColor = 0x00ccff;
  const tubeGeo = new THREE.TubeGeometry(spline, 222, 0.65, 16, true);
  const tubeLines = hookAddResult(new THREE.LineSegments());
  tubeLines.geometry = new THREE.EdgesGeometry(tubeGeo, 0.2);
  tubeLines.material = new THREE.LineBasicMaterial({ color: tubeColor });

  const tubeHitArea = renderMesh();
  tubeHitArea.geometry = tubeGeo;
  tubeHitArea.material = new THREE.MeshBasicMaterial({
    color: tubeColor,
    transparent: true,
    opacity: 0.0,
    side: THREE.BackSide,
  });
  tubeHitArea.name = 'tube';
  const { renderer, hookAnimationLoop, camera } = ThreeContext.consume();
  hookAnimationLoop(t => {
    const time = t * 0.1;
    const looptime = 10 * 1000;
    const p = (time % looptime) / looptime;
    const pos = tubeGeo.parameters.path.getPointAt(p);
    const lookAt = tubeGeo.parameters.path.getPointAt((p + 0.03) % 1);
    camera.position.copy(pos);
    camera.lookAt(lookAt);
  });
  return { tubeGeo, tubeHitArea };
}

/**
 * 渲染虫洞中的盒子
 * @param tubeGeo
 */
function renderBox(tubeGeo: THREE.TubeGeometry) {
  const { scene } = ThreeContext.consume();
  return renderGroup(function (boxGroup) {
    const numBoxes = 55;
    const size = 0.075;
    const boxGeo = new THREE.BoxGeometry(size, size, size);
    for (let i = 0; i < numBoxes; i += 1) {
      const p = (i / numBoxes + Math.random() * 0.1) % 1;
      const pos = tubeGeo.parameters.path.getPointAt(p);
      const color = new THREE.Color().setHSL(0.7 + p, 1, 0.5);
      const boxMat = new THREE.MeshBasicMaterial({
        color,
        transparent: true,
        opacity: 0.0,
      });
      const hitBox = new THREE.Mesh(boxGeo, boxMat);
      hitBox.name = 'box';

      pos.x += Math.random() - 0.4;
      pos.z += Math.random() - 0.4;
      hitBox.position.copy(pos);
      const rote = new THREE.Vector3(
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI
      );
      hitBox.rotation.set(rote.x, rote.y, rote.z);
      const edges = new THREE.EdgesGeometry(boxGeo, 0.2);

      const lineMat = new THREE.LineBasicMaterial({ color });
      const boxLines = new THREE.LineSegments(edges, lineMat);
      boxLines.position.copy(pos);
      boxLines.rotation.set(rote.x, rote.y, rote.z);
      hitBox.userData.box = boxLines;
      boxGroup.add(hitBox);
      scene.add(boxLines);
    }
  });
}
/**
 * 十字准线
 */
function renderCrossHairs() {
  const { camera, hookAnimationLoop } = ThreeContext.consume();
  const crosshairs = new THREE.Group();
  crosshairs.position.z = -1;
  camera.add(crosshairs);
  const crossMat = new THREE.LineBasicMaterial({
    color: 0xffffff,
  });
  const lineGeo = new THREE.BufferGeometry();
  const lineVerts = [0, 0.05, 0, 0, 0.02, 0];
  lineGeo.setAttribute(
    'position',
    new THREE.Float32BufferAttribute(lineVerts, 3)
  );

  for (let i = 0; i < 4; i += 1) {
    const line = new THREE.Line(lineGeo, crossMat);
    line.rotation.z = i * 0.5 * Math.PI;
    crosshairs.add(line);
  }
  const mousePos = new THREE.Vector2();
  hookAnimationLoop(() => {
    crosshairs.position.set(mousePos.x, mousePos.y, -1);
  });
  hookDestroy(
    subscribeEventListener(window, 'mousemove', function (evt) {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const aspect = w / h;
      const fudge = { x: aspect * 0.75, y: 0.75 };
      mousePos.x = ((evt.clientX / w) * 2 - 1) * fudge.x;
      mousePos.y = (-1 * (evt.clientY / h) * 2 + 1) * fudge.y;
    })
  );
  return crosshairs;
}

function onWindowClick(
  crosshairs: THREE.Group,
  boxGroup: THREE.Group,
  tubeHitArea: THREE.Mesh
) {
  const { camera, scene, hookAnimationLoop } = ThreeContext.consume();
  const sound = soundEffects();
  const raycaster = new THREE.Raycaster();
  const direction = new THREE.Vector3();
  const impactPos = new THREE.Vector3();
  const impactColor = new THREE.Color();
  let impactBox: THREE.LineSegments | null = null;

  let lasers: THREE.Mesh[] = [];
  hookAnimationLoop(() => {
    lasers.forEach(l => l.userData.update());
  });
  const laserGeo = new THREE.IcosahedronGeometry(0.05, 2);
  /**
   * 激光
   * @returns
   */
  function getLaserBolt() {
    const laserMat = new THREE.MeshBasicMaterial({
      color: 0xffcc00,
      transparent: true,
      fog: false,
    });
    const laserBolt = new THREE.Mesh(laserGeo, laserMat);
    laserBolt.position.copy(camera.position);

    let active = true;
    const speed = 0.5;

    const goalPos = camera.position
      .clone()
      .setFromMatrixPosition(crosshairs.matrixWorld);

    const laserDirection = new THREE.Vector3(0, 0, 0);
    laserDirection
      .subVectors(laserBolt.position, goalPos)
      .normalize()
      .multiplyScalar(speed);

    direction.subVectors(goalPos, camera.position);
    raycaster.set(camera.position, direction);
    const intersects = raycaster.intersectObjects(
      [...boxGroup.children, tubeHitArea],
      true
    );

    if (intersects.length > 0) {
      const is0 = intersects[0];
      impactPos.copy(is0.point);
      impactColor.copy(
        (is0.object as THREE.Mesh<any, THREE.MeshBasicMaterial>).material.color
      );
      if (is0.object.name === 'box') {
        impactBox = is0.object.userData.box;
        boxGroup.remove(is0.object);
        sound.fitzSound.stop();
        sound.fitzSound.play();
      }
    }

    let scale = 1.0;
    let opacity = 1.0;
    let isExploding = false;
    laserBolt.userData = {
      active,
      update() {
        if (active === true) {
          if (isExploding === false) {
            laserBolt.position.sub(laserDirection);

            if (laserBolt.position.distanceTo(impactPos) < 0.5) {
              laserBolt.position.copy(impactPos);
              laserBolt.material.color.set(impactColor);
              isExploding = true;
              impactBox?.scale.setScalar(0.0);
            }
          } else {
            if (opacity > 0.01) {
              scale += 0.2;
              opacity *= 0.85;
            } else {
              opacity = 0.0;
              scale = 0.01;
              active = false;
            }
            laserBolt.scale.setScalar(scale);
            laserBolt.material.opacity = opacity;
            laserBolt.userData.active = active;
          }
        }
      },
    };
    return laserBolt;
  }
  hookDestroy(
    subscribeEventListener(window, 'click', function () {
      const laser = getLaserBolt();
      lasers.push(laser);
      scene.add(laser);
      sound.laserSound.stop();
      sound.laserSound.play();
      // cleanup
      const inactiveLasers = lasers.filter(l => l.userData.active === false);
      scene.remove(...inactiveLasers);
      lasers = lasers.filter(l => l.userData.active === true);
    })
  );
}
