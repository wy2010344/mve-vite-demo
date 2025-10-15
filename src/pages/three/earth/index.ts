import * as THREE from 'three';
import { hookAddResult } from 'mve-core';
import {
  getPerspectiveCamera,
  hookOrbitControls,
  renderGroup,
  renderMesh,
  renderThreeView,
  ThreeContext,
} from '../../../hookThreeView';
import earthmap1k from './00_earthmap1k.jpg';
import earthbump1k from './01_earthbump1k.jpg';
import earthspec1k from './02_earthspec1k.jpg';
import earthlights1k from './03_earthlights1k.jpg';
import earthcloudmap from './04_earthcloudmap.jpg';
import earthcloudmaptrans from './05_earthcloudmaptrans.jpg';
import { getFresnelMat } from './getFresnelMat';
import getStarfield from './getStarfield';
import { windowSize } from 'wy-dom-helper';
/**
 * https://www.youtube.com/watch?v=UMqNHi1GDAE
 */
export default function () {
  const camera = getPerspectiveCamera(windowSize.width, windowSize.height);
  const renderer = renderThreeView({
    camera,
    width: windowSize.width,
    height: windowSize.height,
    render(scene) {
      renderGroup(function (group) {
        group.rotation.z = (-23.4 * Math.PI) / 180;
        const detail = 12;
        const geometry = new THREE.IcosahedronGeometry(1.0, detail);
        renderEarthMesh(geometry);
        renderLightMesh(geometry);
        renderCloudMesh(geometry);
        renderGlowMesh(geometry);
      });

      renderStars();

      const sunLight = new THREE.DirectionalLight(0xffffff, 2.0);
      sunLight.position.set(-2, 0.5, 1.5);
      hookAddResult(sunLight);

      const controls = hookOrbitControls();
      controls.enableDamping = true;
      controls.dampingFactor = 0.03;
    },
  });

  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.outputColorSpace = THREE.LinearSRGBColorSpace;
}

function renderStars() {
  const { hookAnimationLoop } = ThreeContext.consume();
  const starts = getStarfield({ numStars: 2000 });
  hookAddResult(starts);
  hookAnimationLoop(() => {
    starts.rotation.y -= 0.002;
  });
}

/**
 * 正面图层
 * @param geometry
 */
function renderEarthMesh(geometry: THREE.BufferGeometry) {
  const loader = new THREE.TextureLoader();
  const { hookAnimationLoop } = ThreeContext.consume();
  const earthMesh = renderMesh();
  earthMesh.geometry = geometry;
  earthMesh.material = new THREE.MeshPhongMaterial({
    map: loader.load(earthmap1k),
    specularMap: loader.load(earthspec1k),
    bumpMap: loader.load(earthbump1k),
  });
  hookAnimationLoop(() => {
    earthMesh.rotation.y += 0.002;
  });
}

/**
 * 背光面的图层
 * @param geometry
 */
function renderLightMesh(geometry: THREE.BufferGeometry) {
  const loader = new THREE.TextureLoader();
  const { hookAnimationLoop } = ThreeContext.consume();
  const lightsMesh = renderMesh();
  lightsMesh.geometry = geometry;
  lightsMesh.material = new THREE.MeshBasicMaterial({
    map: loader.load(earthlights1k),
    blending: THREE.AdditiveBlending,
  });
  hookAnimationLoop(() => {
    lightsMesh.rotation.y += 0.002;
  });
}
/**
 * 云层
 * @param geometry
 */
function renderCloudMesh(geometry: THREE.BufferGeometry) {
  const loader = new THREE.TextureLoader();
  const { hookAnimationLoop } = ThreeContext.consume();
  const cloudsMesh = renderMesh();
  cloudsMesh.geometry = geometry;
  cloudsMesh.material = new THREE.MeshStandardMaterial({
    map: loader.load(earthcloudmap),
    transparent: true,
    opacity: 0.8,
    blending: THREE.AdditiveBlending,
    alphaMap: loader.load(earthcloudmaptrans),
    // alphaTest: 0.3,
  });
  cloudsMesh.scale.setScalar(1.003);
  hookAnimationLoop(() => {
    cloudsMesh.rotation.y += 0.0023;
  });
}

/**
 * 外边的蓝色光辉
 * @param geometry
 */
function renderGlowMesh(geometry: THREE.BufferGeometry) {
  const { hookAnimationLoop } = ThreeContext.consume();
  const glowMesh = renderMesh();
  glowMesh.geometry = geometry;
  glowMesh.material = getFresnelMat();
  glowMesh.scale.setScalar(1.01);
  hookAnimationLoop(() => {
    glowMesh.rotation.y += 0.002;
  });
}
