import { dom, fdom, fsvg } from 'mve-dom'
import data from './graph.json'//'./block.json'//
import * as d3 from "d3";
import { cns, dragInit, pointerMove, subscribeDragMove, subscribeEventListener, subscribeRequestAnimationFrame } from 'wy-dom-helper';
import { addEffect, batchSignalEnd, createSignal, emptyArray, emptyFun, memo, Point, PointKey, removeEqual, toProxySignal, PagePoint } from 'wy-helper';
import { hookDestroy, hookTrackSignal, renderArray, renderIf, renderOne } from 'mve-helper';
import { mergeNodesAndLinks, initToNode, createSignalForceDir, emptySignalForceDir, SignalForceDir, ForceNode, ForceLink, tickForce, forceLink, forceManybody, forceDir, initForceConfig, DIMType } from 'wy-helper/forceLayout';
import { animate } from 'motion';
import { hookTabLayout } from '../../../../components/daisy-tab-layout';
import { getPerspectiveCamera, hookOrbitControls, renderThreeView, ThreeContext } from '../../../../hookThreeView';

import * as THREE from 'three';
import { hookAddDestroy, hookAddResult } from 'mve-core';
import { DragControls } from 'three/examples/jsm/controls/DragControls.js'

const width = 800
const height = 800

type NNode = typeof data.nodes[number]
type NLink = typeof data.links[number]
const alphaMin = 0.001


const renderTypes = ['2D', '3D'] as const
type RenderType = typeof renderTypes[number]
export default function () {

  const type = createSignal<RenderType>('3D')
  fdom.div({
    role: 'tablist',
    className: 'daisy-tabs daisy-tabs-box',
    children() {
      renderTypes.forEach(rt => {
        fdom.button({
          className() {
            return cns(
              "daisy-tab",
              rt == type.get() && 'daisy-tab-active fd1-tab-active'
            )
          },
          role: "tab",
          onClick() {
            type.set(rt)
          },
          children() {
            dom.span().renderTextContent(rt)
          }
        })
      })
      hookTabLayout(type.get, 'fd1-tab-active')
    }
  })

  const model = createSignal(data)
  const color = d3.scaleOrdinal(d3.schemeCategory10);
  const renderLink = forceLink()
  const renderManyBody = forceManybody()
  const renderDirX = forceDir('x')
  const renderDirY = forceDir('y')
  type NodesAndLinks = {
    nodes: readonly ForceNode<NNode, SignalForceDir>[],
    links: readonly ForceLink<NLink, NNode, SignalForceDir>[]
  }
  function nodesAndLink(nDim: DIMType, renderAxis: (
    gl: NodesAndLinks,
    alpha: number) => void
  ) {
    const config = toProxySignal(initForceConfig())
    const stoped = () => {
      return config.alpha < alphaMin
    }
    const getNodesAndLinks = memo<NodesAndLinks>((old) => {
      return mergeNodesAndLinks({
        nodes: old?.nodes || emptyArray,
        links: old?.links || emptyArray,
        fromLinks: model.get().links,
        fromNodes: model.get().nodes,
        createForceNode(n, i, befores) {
          return initToNode(n, nDim, i, createSignalForceDir, emptySignalForceDir)
        },
        getNodeKey(n) {
          return n.id
        },
        getSorceKey(n) {
          return n.source
        },
        getTargetKey(n) {
          return n.target
        },
        createFromKey(k) {
          return {
            id: k,
            group: 'not-found'
          }
        },
      })
    })
    function didTick() {
      const gl = getNodesAndLinks()
      tickForce(nDim, config, gl.nodes, (alpha) => {
        renderLink(gl.links, nDim, alpha)
        renderManyBody(gl.nodes, nDim, alpha)
        renderAxis(gl, alpha)
      })
    }

    let closeFrame = emptyFun
    hookTrackSignal(stoped, stoped => {
      if (stoped) {
        closeFrame()
        return
      }
      closeFrame = subscribeRequestAnimationFrame(() => {
        didTick()
        batchSignalEnd()
      })
    })
    return {
      config,
      getNodesAndLinks,
      didTick
    }
  }
  renderOne(type.get, function (type) {
    if (type == '2D') {

      const { getNodesAndLinks, didTick, config } = nodesAndLink(2, (gl, alpha) => {
        renderDirX(gl.nodes, alpha)
        renderDirY(gl.nodes, alpha)
      })

      const svg = fsvg.svg({
        width: width,
        height: height,
        viewBox: `${-width / 2} ${-height / 2} ${width} ${height}`,
        s_maxWidth: '100%',
        s_height: 'auto',
        children() {
          renderArray(() => getNodesAndLinks().links, link =>
            fsvg.g({
              stroke: "#999",
              strokeOpacity: 0.6,
              children() {
                fsvg.line({
                  x1: link.source.x.dSignal.get,
                  y1: link.source.y.dSignal.get,
                  x2: link.target.x.dSignal.get,
                  y2: link.target.y.dSignal.get,
                  strokeWidth: Math.sqrt(link.value.value)
                })
              }
            })
          )

          renderArray(() => getNodesAndLinks().nodes, node =>
            fsvg.g({
              stroke: "#fff",
              strokeWidth: 1.5,
              children() {
                fsvg.circle({
                  r: 5,
                  cx: node.x.dSignal.get,
                  cy: node.y.dSignal.get,
                  fill: color(node.value.group),
                  ...(dragInit(e => {
                    const rec = svg.getBoundingClientRect()
                    const halfX = rec.left + rec.width / 2
                    const halfY = rec.top + rec.height / 2
                    node.x.f = e.pageX - halfX
                    node.y.f = e.pageY - halfY
                    config.alphaTarget = 0.3
                    didTick()
                    const destroy = subscribeDragMove(e => {
                      if (e) {
                        node.x.f = e.pageX - halfX
                        node.y.f = e.pageY - halfY
                      } else {
                        node.x.f = undefined
                        node.y.f = undefined
                        config.alphaTarget = 0
                        destroy()
                      }
                    })
                  }))
                })
              }
            })
          )
        }
      })
    } else if (type == '3D') {

      const renderDirZ = forceDir('z')
      const { getNodesAndLinks, didTick, config } = nodesAndLink(3, (gl, alpha) => {
        renderDirX(gl.nodes, alpha)
        renderDirY(gl.nodes, alpha)
        renderDirZ(gl.nodes, alpha)
      })
      const camera = getPerspectiveCamera(width, height)
      camera.position.z = 500
      renderThreeView({
        camera,
        width,
        height,
        render(scene) {
          const { renderer } = ThreeContext.consume()
          scene.background = new THREE.Color(0xf5f7fa); // 浅灰色背景
          // // 添加环境光使各个方向光照均匀
          // const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
          // scene.add(ambientLight);

          // // 添加轻微的方向光创造立体感
          // const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
          // directionalLight.position.set(1, 1, 1).normalize();
          // scene.add(directionalLight);



          // 光照设置 - 调整为适合白色主题
          const ambientLight = new THREE.AmbientLight(0xffffff, 0.8); // 更强的环境光
          scene.add(ambientLight);

          // 主光源 - 创造柔和的阴影效果
          const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);
          directionalLight.position.set(1, 1, 1).normalize();
          directionalLight.castShadow = true;
          directionalLight.shadow.mapSize.width = 1024;
          directionalLight.shadow.mapSize.height = 1024;
          scene.add(directionalLight);

          // 辅助光源 - 减少阴影对比度
          const fillLight = new THREE.DirectionalLight(0xffffff, 0.3);
          fillLight.position.set(-1, -0.5, -1).normalize();
          scene.add(fillLight);


          const orbitControls = hookOrbitControls()



          const sphereGeometry = new THREE.SphereGeometry(5, 32, 32);
          function setV3(v: THREE.Vector3, n: ForceNode<any>) {
            v.x = n.x.d // 100
            v.y = n.y.d // 100
            v.z = n.z.d // 100
          }

          const raycaster = new THREE.Raycaster();
          // 设置射线
          const mouse = new THREE.Vector2();
          const spheres: THREE.Mesh<THREE.SphereGeometry, THREE.MeshPhongMaterial>[] = []
          const canvas = renderer.domElement

          function toCallOne(n: Point, e: PointerEvent, rect: DOMRect) {
            // 计算鼠标在Canvas内的相对坐标 (0到800)
            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;
            // 转换为归一化设备坐标 (-1到1)
            n.x = (mouseX / rect.width) * 2 - 1;
            n.y = -((mouseY / rect.height) * 2 - 1); // Y轴需要反转
          }
          hookDestroy(subscribeEventListener(canvas, 'pointerdown', e => {

            const rect = canvas.getBoundingClientRect();
            toCallOne(mouse, e, rect)
            // 设置射线
            raycaster.setFromCamera(mouse, camera);
            // 计算相交对象
            const intersects = raycaster.intersectObjects(spheres);
            if (intersects.length > 0) {
              orbitControls.enabled = false
              const sphere = intersects[0].object as THREE.Mesh<THREE.SphereGeometry, THREE.MeshPhongMaterial>


              const node = sphere.userData as ForceNode<any>

              node.z.f = node.z.d
              config.alphaTarget = 0.3
              didTick()
              pointerMove({
                onMove(e) {
                  const rect = renderer.domElement.getBoundingClientRect();
                  mouse.x = ((e.clientX - rect.left) / 800) * 2 - 1;
                  mouse.y = -((e.clientY - rect.top) / 800) * 2 + 1;
                  // 计算新位置
                  raycaster.setFromCamera(mouse, camera);
                  const direction = raycaster.ray.direction;
                  const origin = raycaster.ray.origin;
                  const t = (node.z.f! - origin.z) / direction.z;
                  node.x.f = origin.x + direction.x * t
                  node.y.f = origin.y + direction.y * t
                },
                onEnd(e) {
                  node.x.f = undefined
                  node.y.f = undefined
                  config.alphaTarget = 0

                  orbitControls.enabled = true
                },
              })
            }
          }))

          renderArray(() => getNodesAndLinks().nodes, node => {
            // 创建材质
            const sphereMaterial = new THREE.MeshPhongMaterial({
              color: color(node.value.group),
              specular: 0x111111, shininess: 30, emissive: 0x000000,
              flatShading: false,
              side: THREE.DoubleSide
            });

            // 创建球体
            const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);

            hookAddResult(sphere)
            sphere.userData = node
            spheres.push(sphere)
            hookDestroy(() => {
              removeEqual(spheres, sphere)
            })
            hookTrackSignal(() => {
              setV3(sphere.position, node)
            })
          })

          renderArray(() => getNodesAndLinks().links, link => {
            const lineMaterial = new THREE.LineBasicMaterial({
              color: 0x000000,
              transparent: true,
              opacity: 0.3
            });
            //     // 创建线的几何体
            const points: THREE.Vector3[] = [];
            points.push(new THREE.Vector3());
            points.push(new THREE.Vector3());
            const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);

            // 创建线对象
            const line = new THREE.Line(lineGeometry, lineMaterial);
            hookAddResult(line)
            hookTrackSignal(() => {
              setV3(points[0], link.source)
              setV3(points[1], link.target)
              line.geometry = lineGeometry.setFromPoints(points)
            })
          })
        },
      })
    }
  })
}

