import { faker } from "@faker-js/faker";
import { fsvg } from "mve-dom";
import { hookDestroy, hookTrackSignal, renderArray } from "mve-helper";
import { dragInit, subscribeDragMove, subscribeEventListener, subscribeRequestAnimationFrame } from "wy-dom-helper";
import { batchSignalEnd, createSignal, emptyArray, emptyFun, memo, toProxySignal } from "wy-helper";
import { createSignalForceDir, emptySignalForceDir, ForceConfig, forceDir, forceLink, ForceLink, forceManybody, ForceNode, initForceConfig, mergeNodesAndLinks, SignalForceDir, tickForce } from "wy-helper/forceLayout";


const width = 800
const height = 800
const alphaMin = 0.001

type MNode = {
  x: number
  y: number
  color: string
  value: number
}

type MLink = {
  source: number
  target: number
}

let uid = 0
export default function () {


  const nodes = createSignal<readonly MNode[]>(emptyArray)
  const links = createSignal<readonly MLink[]>(emptyArray)
  const selected = createSignal<MNode | undefined>(undefined)

  hookDestroy(subscribeEventListener(document, 'keydown', e => {
    if (e.key == 'Enter') {
      const s = selected.get()
      if (s) {
        selected.set(undefined)
        nodes.set(nodes.get().filter(v => v.value != s.value))
        links.set(links.get().filter(x => x.source != s.value && x.target != s.value))
        didTick()
      }
    }
  }))
  const nDim = 2
  const getNodesAndLinks = memo<{
    nodes: readonly ForceNode<MNode, SignalForceDir>[],
    links: readonly ForceLink<MLink, MNode, SignalForceDir>[]
  }>((old) => {
    return mergeNodesAndLinks({
      nodes: old?.nodes || emptyArray,
      links: old?.links || emptyArray,
      fromLinks: links.get(),
      fromNodes: nodes.get(),
      createForceNode(n, i, befores) {
        return {
          index: i,
          x: createSignalForceDir(n.x),
          y: createSignalForceDir(n.y),
          z: emptySignalForceDir,
          value: n
        }
      },
      getNodeKey(n) {
        return n.value
      },
      getSorceKey(n) {
        return n.source
      },
      getTargetKey(n) {
        return n.target
      },
      createFromKey(k) {
        return {
          value: k,
          color: faker.color.rgb(),
          x: 0,
          y: 0
        }
      },
    })
  })
  const config = toProxySignal(initForceConfig())
  const stoped = () => {
    return config.alpha < alphaMin
  }
  const renderLink = forceLink()
  const renderManyBody = forceManybody()
  const renderDirX = forceDir('x')
  const renderDirY = forceDir('y')
  function didTick() {
    const gl = getNodesAndLinks()
    tickForce(nDim, config, gl.nodes, (alpha) => {
      renderLink(gl.links, nDim, alpha)
      renderManyBody(gl.nodes, nDim, alpha)
      renderDirX(gl.nodes, alpha)
      renderDirY(gl.nodes, alpha)
    })
  }
  const svg = fsvg.svg({
    width: width,
    height: height,
    viewBox: `${-width / 2} ${-height / 2} ${width} ${height}`,
    s_maxWidth: '100%',
    s_height: 'auto',
    s_boxSizing: "content-box",
    s_border: '10px solid gray',
    s_userSelect: "none",
    onClick(e) {
      const node = {
        value: uid++,
        color: faker.color.rgb(),
        x: e.offsetX - svg.clientWidth / 2,
        y: e.offsetY - svg.clientHeight / 2
      }
      nodes.set([
        ...nodes.get(),
        node
      ])
      selected.set(node)
      didTick()
      batchSignalEnd()
    },
    children() {
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
              strokeWidth: 1
            })
          }
        })
      )

      renderArray(() => getNodesAndLinks().nodes, node =>
        fsvg.g({
          stroke: "#fff",
          strokeWidth: 1.5,
          onClick(e) {
            e.stopPropagation()
            const s = selected.get()
            if (e.shiftKey) {
              if (s) {
                if (s != node.value) {
                  const oldIndex = links.get().findIndex(x => x.source == s.value && x.target == node.value.value)
                  if (oldIndex < 0) {
                    links.set([
                      ...links.get(),
                      {
                        source: s.value,
                        target: node.value.value
                      }
                    ])
                  } else {
                    const l = links.get().slice()
                    links.set(l)
                  }
                  didTick()
                }
              }
            } else {
              if (s == node.value) {
                selected.set(undefined)
              } else {
                selected.set(node.value)
              }
            }
          },
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
          })),
          children() {
            fsvg.circle({
              r: 5,
              cx: node.x.dSignal.get,
              cy: node.y.dSignal.get,
              s_outline() {
                return selected.get() == node.value ? '1px solid blue' : ''
              },
              s_borderRadius: '50%',
              fill: node.value.color
            })
            fsvg.text({
              x: node.x.dSignal.get,
              y: node.y.dSignal.get,
              stroke: node.value.color,
              childrenType: "text",
              children: node.value.value + ''
            })
          }
        })
      )
    }
  })
}

