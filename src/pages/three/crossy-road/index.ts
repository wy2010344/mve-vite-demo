import { hookAddResult } from 'mve-core';
import * as THREE from 'three';
import { initializeMap, map } from './Map';
import { windowSize } from 'wy-dom-helper';
import { animateVehicles } from './animateVehicles';
import { movesQueue, player, position, queueMove, score } from './Player';
import { dom, fdom, renderText } from 'mve-dom';
import { animatePlayer } from './animatePlayer';
import { finished, hitTest } from './hitTest';
import { renderThreeView, ThreeContext } from '../../../hookThreeView';

export default function () {
  fdom.div({
    s_fontFamily: `"Press Start 2P", cursive`,
    children() {


      const renderer = renderThreeView({
        camera: Camera(),
        args: {
          alpha: true,
          antialias: true
        },
        width: windowSize.width,
        height: windowSize.height,
        render(scene) {

          hookAddResult(player)
          hookAddResult(map)
          initializeMap()
          hookAddResult(new THREE.AmbientLight())


          const dirLight = DirectionLight()
          player.add(dirLight)
          dirLight.target = player
          const { hookAnimationLoop, camera } = ThreeContext.consume()
          player.add(camera)
          hookAnimationLoop(() => {
            animateVehicles()
            animatePlayer()
            hitTest()
          })
        },
      })
      // renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(window.devicePixelRatio)
      renderer.shadowMap.enabled = true







      fdom.div({
        childrenType: 'text',
        children: score.get,
        className: 'absolute top-5 left-5 text-white text-[2em]'
      })



      fdom.div({
        className: 'absolute min-w-full min-h-full top-0 flex items-center justify-center',
        s_visibility() {
          return finished.get() ? 'visible' : 'hidden'
        },
        children() {
          fdom.div({
            className: 'flex flex-col items-center bg-white p-5',
            children() {
              dom.h1().renderText`Game Over`
              fdom.p({
                children() {
                  renderText`Your score:`
                  dom.span().renderTextContent(score.get)
                }
              })
              dom.button({
                className: 'bg-red-400 pt-5 pb-5 pl-10 pr-10',
                onClick() {
                  finished.set(false)

                  player.position.x = 0;
                  player.position.y = 0;
                  player.children[0].position.z = 0;

                  // Initialize metadata
                  position.currentRow = 0;
                  position.currentTile = 0;

                  // Clear the moves queue
                  movesQueue.length = 0;
                }
              }).renderText`Retry`
            }
          })
        }
      })

      fdom.div({
        className: "absolute min-w-full bottom-5  flex items-end justify-center",
        children() {
          fdom.div({
            className: 'grid grid-cols-[50px_50px_50px] gap-[10px]',
            children() {
              window.addEventListener("keydown", (event) => {
                if (event.key === "ArrowUp") {
                  event.preventDefault(); // Avoid scrolling the page
                  queueMove("forward");
                } else if (event.key === "ArrowDown") {
                  event.preventDefault(); // Avoid scrolling the page
                  queueMove("backward");
                } else if (event.key === "ArrowLeft") {
                  event.preventDefault(); // Avoid scrolling the page
                  queueMove("left");
                } else if (event.key === "ArrowRight") {
                  event.preventDefault(); // Avoid scrolling the page
                  queueMove("right");
                }
              });
              fdom.button({
                className: 'w-full h-[40px] bg-white border-1 border-gray-100 shadow-2xl [grid-column:1/-1]',
                childrenType: "text",
                children: "▲",
                onClick() {
                  queueMove("forward")
                }
              })
              fdom.button({
                className: 'w-full h-[40px] bg-white border-1 border-gray-100 shadow-2xl',
                childrenType: "text",
                children: "◀",
                onClick() {
                  queueMove("left")
                }
              })
              fdom.button({
                className: 'w-full h-[40px] bg-white border-1 border-gray-100 shadow-2xl',
                childrenType: "text",
                children: "▼",
                onClick() {
                  queueMove("backward")
                }
              })
              fdom.button({
                className: 'w-full h-[40px] bg-white border-1 border-gray-100 shadow-2xl',
                childrenType: "text",
                children: "▶",
                onClick() {
                  queueMove("right")
                }
              })
            }
          })
        }
      })
    }
  })
}



function Camera() {
  const size = 300
  const viewRatio = window.innerWidth / window.innerHeight
  const width = viewRatio < 1 ? size : size * viewRatio
  const height = viewRatio < 1 ? size / viewRatio : size

  const camera = new THREE.OrthographicCamera(
    width / -2,//left
    width / 2,//right
    height / 2,//top
    height / -2,//bottom
    100,//near
    900//far
  )

  camera.up.set(0, 0, 1)
  camera.position.set(300, -300, 300)
  camera.lookAt(0, 0, 0)

  return camera
}


function DirectionLight() {
  const dirLight = new THREE.DirectionalLight()
  dirLight.position.set(-100, -100, 200)
  dirLight.up.set(0, 0, 1)
  dirLight.castShadow = true


  dirLight.shadow.mapSize.width = 2048
  dirLight.shadow.mapSize.height = 2048


  dirLight.shadow.camera.up.set(0, 0, 1)
  dirLight.shadow.camera.left = -400;
  dirLight.shadow.camera.right = 400;
  dirLight.shadow.camera.top = 400;
  dirLight.shadow.camera.bottom = -400;
  dirLight.shadow.camera.near = 50;
  dirLight.shadow.camera.far = 400;

  return dirLight

}