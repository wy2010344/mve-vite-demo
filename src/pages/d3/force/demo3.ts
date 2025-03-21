import * as d3 from "d3";
import { fdom } from "mve-dom";
import { hookDraw, renderCanvas } from "mve-dom-helper/canvasRender";
import { hookDestroy, renderArray } from "mve-helper";
import { subscribeRequestAnimationFrame } from "wy-dom-helper";
import { asLazy, batchSignalEnd, createSignal, emptyArray, memo, run, toProxySignal } from "wy-helper";
import { createSignalForceDir, emptySignalForceDir, forceCollide, forceDir, forceManybody, ForceNode, initForceConfig, initToNode, mergeNodes, SignalForceDir, tickForce } from "wy-helper/forceLayout";
import { renderFullScreen } from "../../../onlyMobile";

export default function () {
  renderFullScreen(function ({
    width,
    height
  }) {

    const data = run(() => {
      const k = width() / 200;
      const r = d3.randomUniform(k, k * 4);
      const n = 4;
      return Array.from({ length: 200 }, (_, i) => ({ r: r(), group: i && (i % n + 1) }));
    })

    type Row = {
      r: number,
      group: number
    }

    const model = createSignal(data)

    const getNodes = memo<readonly ForceNode<Row, SignalForceDir>[]>((old) => {
      return mergeNodes({
        nodes: old || emptyArray,
        fromNodes: model.get(),
        createForceNode(n, i) {
          return initToNode(n, 2, i, createSignalForceDir, emptySignalForceDir)
        }
      })
    })

    const _m = initForceConfig()
    _m.alphaTarget = 0.3
    _m.velocityDecay = 1 - 0.1
    const config = toProxySignal(_m)
    const color = d3.scaleOrdinal(d3.schemeTableau10);



    const renderManyBody = forceManybody<Row>({
      getStrenth(n) {
        return n.index ? 0 : -width() * 2 / 3
      },
    })
    const renderDirX = forceDir('x', {
      getStrength: asLazy(0.01)
    })
    const renderDirY = forceDir('y', {
      getStrength: asLazy(0.01)
    })
    const renderCollide = forceCollide<Row>({
      getRadius(n) {
        return n.value.r + 1
      },
      iterations: 3
    })
    hookDestroy(subscribeRequestAnimationFrame(() => {
      const nodes = getNodes()
      tickForce(config, nodes, alpha => {
        renderManyBody(nodes, config.nDim, alpha)
        renderDirX(nodes, alpha)
        renderDirY(nodes, alpha)
        renderCollide(nodes, 2)
      })
      batchSignalEnd()
    }))
    renderCanvas({
      className: "touch-none",
      width,
      height,
      onPointerMove(e) {
        const [x, y] = d3.pointer(e);
        const n0 = getNodes()[0]
        n0.x.f = x - width() / 2;
        n0.y.f = y - height() / 2;
        batchSignalEnd()
      }
    }, function () {
      renderArray(getNodes, (node, getIndex) => {
        hookDraw({
          x() {
            return node.x.dSignal.get() + width() / 2
          },
          y() {
            return node.y.dSignal.get() + height() / 2
          },
          withPath: true,

          draw(ctx, path) {
            path.arc(0, 0, node.value.r, 0, 2 * Math.PI)
            return {
              operates: getIndex() ? [
                {
                  type: "fill",
                  style: color(node.value.group + '')
                }
              ] : emptyArray as any[]
            }
          },
        })
      })
    }, {
      // beforeDraw(ctx: CanvasRenderingContext2D) {
      //   ctx.translate(width / 2, height / 2)
      // }
    })
  })
}