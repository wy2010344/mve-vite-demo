import { windowSize } from 'wy-dom-helper';
import {
  getPerspectiveCamera,
  hookOrbitControls,
  renderGroup,
  renderThreeView,
} from '../../../hookThreeView';

import * as THREE from 'three';
import {
  hookDrawThree,
  hookThreeCenterPosition,
  hookThreePosition,
} from 'mve-dom-helper';
import {
  emptyFun,
  flexDisplayUtil,
  LayoutNode,
  Point,
  PointKey,
  simpleFlex,
} from 'wy-helper';
import { hookTrackSignal } from 'mve-helper';
import { any } from 'wy-helper/kanren';
import { addTrackEffect, hookAddResult } from 'mve-core';
type ThreeKey = PointKey | 'z';

/**
 * 不太好,three是以中点定位的
 */
export default function () {
  const camera = getPerspectiveCamera(windowSize.width, windowSize.height);

  camera.position.z = 10;
  camera.position.y = 5;
  const renderer = renderThreeView({
    camera,
    width: windowSize.width,
    height: windowSize.height,
    render(scene) {
      hookOrbitControls();
      // 添加光源
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
      scene.add(ambientLight);

      const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
      directionalLight.position.set(1, 1, 1);
      scene.add(directionalLight);
      // 创建长方体函数
      function createBox(
        color: number,
        width: number,
        height: number,
        depth: number,
        x: number,
        y: number,
        z: number
      ) {
        const geometry = new THREE.BoxGeometry(width, height, depth);
        const material = new THREE.MeshPhongMaterial({
          color,
          shininess: 30,
        });
        const box = new THREE.Mesh(geometry, material);
        box.position.set(x, y, z);
        scene.add(box);
        return box;
      }

      // 添加坐标轴辅助（可选）
      const axesHelper = new THREE.AxesHelper(5);
      scene.add(axesHelper);
      // 创建三个不同颜色、不同位置的长方体
      // const box1 = createBox(0xff0000, 1, 2, 1, -3, 0, 0);  // 红色长方体
      // const box2 = createBox(0x00ff00, 1.5, 1, 1.5, 0, 0, 0);  // 绿色长方体
      // const box3 = createBox(0x0000ff, 1, 1, 2, 3, 0, 0);  // 蓝色长方体

      function createBox2(color: number, n: LayoutNode<any, ThreeKey>) {
        const box = new THREE.Mesh();
        box.material = new THREE.MeshPhongMaterial({
          color,
          shininess: 30,
        });

        hookThreeCenterPosition(n);
        addTrackEffect(
          () =>
            new THREE.BoxGeometry(
              n.axis.x.size(),
              n.axis.y.size(),
              n.axis.z.size()
            ),
          v => {
            return function () {
              box.geometry = v;
            };
          }
        );
        hookAddResult(box);
        return box as any;
      }

      hookDrawThree({
        x: 1,
        y: 1,
        z: 1,
        // paddingLeft: 1,
        // paddingBack: 1,
        // paddingTop: 1,
        layout(v) {
          return flexDisplayUtil(
            'x',
            {
              gap: 1,
            },
            {
              alignItems: 'start',
            }
          );
        },
        render(n) {
          return renderGroup(group => {
            hookThreePosition(n as any);

            hookDrawThree({
              width: 1,
              height: 2,
              depth: 1,
              render(n) {
                return createBox2(0xff0000, n);
              },
            });

            hookDrawThree({
              width: 1.5,
              height: 1,
              depth: 1.5,
              render(n) {
                return createBox2(0x00ff00, n);
              },
            });

            hookDrawThree({
              width: 1,
              height: 1,
              depth: 2,
              render(n) {
                return createBox2(0x0000ff, n);
              },
            });
          }) as any;
        },
      });
    },
  });
}
