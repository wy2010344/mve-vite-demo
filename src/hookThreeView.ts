import { EmptyFun, SetValue, ValueOrGet, valueOrGetToGet } from "wy-helper";

import * as THREE from 'three';
import { hookDestroy, hookTrackSignal, } from "mve-helper";
import { createRenderBatcher } from "motion";
import { createContext, createRenderChildren, hookAddResult } from 'mve-core'
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";


export function getPerspectiveCamera(
  width: ValueOrGet<number>,
  height: ValueOrGet<number>
) {
  const camera = new THREE.PerspectiveCamera()
  const w = valueOrGetToGet(width)
  const h = valueOrGetToGet(height)
  hookTrackSignal(() => {
    camera.aspect = w() / h()
    camera.updateProjectionMatrix()
  })
  return camera
}
export function renderThreeView({
  camera,
  width,
  height,
  render,
  args
}: {
  camera: THREE.Camera
  width: ValueOrGet<number>,
  height: ValueOrGet<number>,
  render(scene: THREE.Scene): void
  args?: THREE.WebGLRendererParameters
}) {
  const renderer = new THREE.WebGLRenderer(args);
  const scene = new THREE.Scene();
  const w = valueOrGetToGet(width)
  const h = valueOrGetToGet(height)
  const set = new Set<XRFrameRequestCallback>()
  ThreeContext.provide({
    camera,
    domElement: renderer.domElement,
    hookAnimationLoop(fun) {
      if (set.has(fun)) {
        return
      }
      set.add(fun)
      hookDestroy(() => {
        set.delete(fun)
      })
    },
  })
  renderChildren(scene, render as any)
  renderer.setAnimationLoop(function (time, frame) {
    renderer.render(scene, camera);
    set.forEach(fun => {
      fun(time, frame)
    })
  })
  hookTrackSignal(() => {
    renderer.setSize(w(), h())
  })
  hookAddResult(renderer.domElement)
  return renderer
}



export function hookOrbitControls() {
  const { hookAnimationLoop, domElement, camera } = ThreeContext.consume()
  /**旋转等查看 */
  const controls = new OrbitControls(camera, domElement);
  hookAnimationLoop(() => {
    controls.update()
  })
  return controls
}


export const ThreeContext = createContext<{
  camera: THREE.Camera
  domElement: HTMLCanvasElement
  hookAnimationLoop(fun: XRFrameRequestCallback): void
}>(undefined!)


export function renderMesh() {
  const mesh = new THREE.Mesh()
  hookAddResult(mesh)
  return mesh
}

export function renderGroup(render: SetValue<THREE.Group>) {
  const group = new THREE.Group()
  renderChildren(group, render as any)
  hookAddResult(group)
  return group
}

const renderChildrenThree = createRenderChildren<THREE.Object3D>({
  moveBefore(parent, newChild, beforeChild) {
    newChild?.parent?.remove(newChild)
    parent.add(newChild)
    if (beforeChild) {
      const refIndex = parent.children.indexOf(beforeChild);
      if (refIndex === -1) return;
      // 删除刚刚 add 的
      parent.children.splice(parent.children.indexOf(newChild), 1);
      // 插入到目标前面
      parent.children.splice(refIndex, 0, newChild)
    }
  },
  removeChild(parent, child) {
    if (child.parent == parent) {
      parent.remove(child)
    }
  },
})



export const renderChildren = renderChildrenThree.renderChildren