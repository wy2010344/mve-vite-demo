import { fdom } from "mve-dom"
import { hookDraw, renderCanvas } from "mve-dom-helper/canvasRender";
import { hookDestroy, renderArray } from "mve-helper";
import { pointerMove, subscribeMove, subscribeRequestAnimationFrame } from "wy-dom-helper";
import { asLazy, batchSignalEnd, createSignal, emptyArray, memo, run, toProxySignal } from "wy-helper";
import { createSignalForceDir, emptySignalForceDir, forceLink, ForceLink, forceManybody, ForceNode, initForceConfig, initToNode, mergeNodesAndLinks, SignalForceDir, tickForce } from "wy-helper/forceLayout";
import { renderFullScreen } from "../../../../onlyMobile";

export default function () {
  renderFullScreen(function ({
    width, height
  }) {

    const data = run(() => {
      const n = 20;
      const nodes: {
        index: number
      }[] = Array.from({ length: n * n }, (_, i) => ({ index: i }));
      const links: {
        source: number
        target: number
      }[] = [];
      for (let y = 0; y < n; ++y) {
        for (let x = 0; x < n; ++x) {
          if (y > 0) links.push({ source: (y - 1) * n + x, target: y * n + x });
          if (x > 0) links.push({ source: y * n + (x - 1), target: y * n + x });
        }
      }
      return { nodes, links };
    })

    type Row = {
      index: number,
    }
    type Link = {

      source: number;
      target: number;
    }

    const nodes = createSignal<readonly Row[]>(data.nodes)
    const links = createSignal<readonly Link[]>(data.links)
    const currentNode = createSignal<ForceNode<Row> | undefined>(undefined)
    const getNodesAndLinks = memo<{
      nodes: readonly ForceNode<Row, SignalForceDir>[],
      links: readonly ForceLink<Link, Row, SignalForceDir>[]
    }>(old => {
      return mergeNodesAndLinks({
        nodes: old?.nodes || emptyArray,
        links: old?.links || emptyArray,
        fromLinks: links.get(),
        fromNodes: nodes.get(),
        createForceNode(n, i, befores) {
          return initToNode(n, 2, i, createSignalForceDir, emptySignalForceDir)
        },
        getNodeKey(n) {
          return n.index
        },
        getSorceKey(n) {
          return n.source
        },
        getTargetKey(n) {
          return n.target
        },
        createFromKey(k) {
          return {
            index: k
          }
        },
      })
    })

    const config = toProxySignal(initForceConfig())
    const renderLink = forceLink({

      getStrength: asLazy(1),
      getDistance: asLazy(20),
      iterations: 10
    })
    const renderManyBody = forceManybody({
      getStrenth: asLazy(-30)
    })
    function didTick() {
      const gl = getNodesAndLinks()
      tickForce(config, gl.nodes, (alpha) => {
        renderLink(gl.links, config.nDim, alpha)
        renderManyBody(gl.nodes, config.nDim, alpha)
      })
    }
    hookDestroy(subscribeRequestAnimationFrame(() => {
      didTick()
      batchSignalEnd()
    }))
    renderCanvas({
      className: "touch-none",
      width,
      height
    }, function ({ canvas }) {
      renderArray(() => getNodesAndLinks().links, link => {
        hookDraw({
          x() {
            return link.source.x.dSignal.get() + width() / 2
          },
          y() {
            return link.source.y.dSignal.get() + height() / 2
          },
          withPath: true,
          draw(ctx, path) {
            path.moveTo(0, 0)
            path.lineTo(
              link.target.x.d - link.source.x.d,
              link.target.y.d - link.source.y.d,
            )
            return {
              operates: [
                {
                  type: "stroke",
                  style: "#aaa",
                  width: 1
                }
              ]
            }
          },
        })
      })
      renderArray(() => getNodesAndLinks().nodes, node => {
        hookDraw({
          x() {
            return node.x.dSignal.get() + width() / 2
          },
          y() {
            return node.y.dSignal.get() + height() / 2
          },
          onPointerDown(e) {
            config.alphaTarget = 0.3
            currentNode.set(node)
            pointerMove({
              onMove(p) {
                node.x.f = p.offsetX - width() / 2
                node.y.f = p.offsetY - height() / 2
              },
              onEnd(e) {
                config.alphaTarget = 0
                node.x.f = undefined
                node.y.f = undefined
                currentNode.set(undefined)
              },
              // leave: true,
              // cancel: true
            }, canvas)
          },
          withPath: true,
          draw(ctx, path) {
            path.arc(0, 0, 6, 0, 2 * Math.PI)

            return {
              operates: [
                {
                  type: "fill",
                  style: "#000"
                },
                {
                  type: "draw",
                  callback(ctx) {
                    ctx.fillText(node.value.index + "", 3, -3)
                  },
                }
              ]
            }
          },
        })
      })
    }, {
      beforeDraw(ctx: CanvasRenderingContext2D) {
        //这里竟然不会影响点击坐标??
        // ctx.translate(width() / 2, height() / 2)
      }
    })
  })

}