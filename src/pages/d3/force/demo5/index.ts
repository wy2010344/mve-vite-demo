import * as d3 from 'd3';
import csv from './suits.csv?raw';
import { createSignal, emptyArray, memo, toProxySignal } from 'wy-helper';
import {
  createSignalForceDir,
  emptySignalForceDir,
  forceDir,
  forceLink,
  ForceLink,
  forceManybody,
  ForceNode,
  initForceConfig,
  initToNode,
  mergeNodesAndLinks,
  SignalForceDir,
  tickForce,
} from 'wy-helper/forceLayout';
import { hookTrackSignal, renderArray } from 'mve-helper';
import {
  dragInit,
  subscribeDragMove,
  subscribeRequestAnimationFrame,
} from 'wy-dom-helper';
import { fsvg } from 'mve-dom';
/**
 * https://observablehq.com/@d3/mobile-patent-suits
 */
export default function () {
  const suits = d3.csvParse(csv);
  console.log('data', suits);

  const width = 928;
  const height = 600;
  const types = Array.from(new Set(suits.map(d => d.type)));
  const color = d3.scaleOrdinal(types, d3.schemeCategory10);

  type NNode = {
    id: string;
  };
  type NLink = {
    source: string;
    target: string;
    type: string;
  };
  type NodesAndLinks = {
    nodes: readonly ForceNode<NNode, SignalForceDir>[];
    links: readonly ForceLink<NLink, NNode, SignalForceDir>[];
  };

  const model = createSignal({
    nodes: Array.from(
      new Set(suits.flatMap(l => [l.source, l.target])),
      id => ({ id })
    ),
    links: suits.map(d => Object.create(d)),
  });
  const nDim = 2;
  const getNodesAndLinks = memo<NodesAndLinks>(old => {
    return mergeNodesAndLinks<NNode, NLink, string, SignalForceDir>({
      nodes: old?.nodes || emptyArray,
      links: old?.links || emptyArray,
      fromLinks: model.get().links,
      fromNodes: model.get().nodes,
      createForceNode(n, i, befores) {
        return initToNode(
          n,
          nDim,
          i,
          createSignalForceDir,
          emptySignalForceDir
        );
      },
      getNodeKey(n) {
        return n.id;
      },
      getSorceKey(n) {
        return n.source;
      },
      getTargetKey(n) {
        return n.target;
      },
      createFromKey(k) {
        return {
          id: k,
        };
      },
    });
  });

  const alphaMin = 0.001;
  const config = toProxySignal(initForceConfig());
  const stoped = () => {
    return config.alpha < alphaMin;
  };

  const renderDirX = forceDir('x');
  const renderDirY = forceDir('y');
  const renderManyBody = forceManybody({
    getStrenth(n) {
      return -400;
    },
  });
  const renderLink = forceLink();
  function didTick() {
    const gl = getNodesAndLinks();
    tickForce(nDim, config, gl.nodes, alpha => {
      renderLink(gl.links, nDim, alpha);
      renderManyBody(gl.nodes, nDim, alpha);
      renderDirX(gl.nodes, alpha);
      renderDirY(gl.nodes, alpha);
    });
  }

  hookTrackSignal(stoped, function (stoped) {
    if (stoped) {
      return;
    }
    return subscribeRequestAnimationFrame(() => {
      didTick();
    });
  });

  const svg = fsvg.svg({
    width,
    height,
    viewBox: [-width / 2, -height / 2, width, height].join(' '),
    s_maxWidth: '100%',
    s_height: 'auto',
    s_font: '12px sans-serif',
    children() {
      fsvg.defs({
        children() {
          types.forEach(type => {
            fsvg.marker({
              id: `arrow-${type}`,
              viewBox: [0, -5, 10, 10].join(' '),
              refX: 15,
              refY: -0.5,
              markerWidth: 6,
              markerHeight: 6,
              orient: 'auto',
              children() {
                fsvg.path({
                  fill: color(type),
                  d: 'M0,-5L10,0L0,5',
                });
              },
            });
          });
        },
      });
      fsvg.g({
        fill: 'none',
        strokeWidth: 1.5,
        children() {
          renderArray(
            () => getNodesAndLinks().links,
            function (d) {
              fsvg.path({
                markerEnd: `url(${new URL(
                  `#arrow-${d.value.type}`,
                  location.href
                )})`,
                stroke: color(d.value.type),
                d() {
                  return linkArc(d);
                },
              });
            }
          );
        },
      });
      fsvg.g({
        fill: 'currentColor',
        strokeLinecap: 'round',
        strokeLinejoin: 'round',
        children() {
          renderArray(
            () => getNodesAndLinks().nodes,
            function (node) {
              fsvg.g({
                ...dragInit(e => {
                  const rec = svg.getBoundingClientRect();
                  const halfX = rec.left + rec.width / 2;
                  const halfY = rec.top + rec.height / 2;
                  node.x.f = e.pageX - halfX;
                  node.y.f = e.pageY - halfY;
                  config.alphaTarget = 0.3;
                  didTick();
                  const destroy = subscribeDragMove(e => {
                    if (e) {
                      node.x.f = e.pageX - halfX;
                      node.y.f = e.pageY - halfY;
                    } else {
                      node.x.f = undefined;
                      node.y.f = undefined;
                      config.alphaTarget = 0;
                      destroy();
                    }
                  });
                }),
                transform() {
                  return `translate(${node.x.d},${node.y.d})`;
                },
                children() {
                  fsvg.circle({
                    stroke: 'white',
                    strokeWidth: 1.5,
                    r: 4,
                  });
                  fsvg.text({
                    x: 8,
                    y: '0.31em',
                    children: node.value.id,
                    fill: 'none',
                    stroke: 'white',
                    strokeWidth: 3,
                  });

                  fsvg.text({
                    x: 8,
                    y: '0.31em',
                    children: node.value.id,
                  });
                },
              });
            }
          );
        },
      });
      function linkArc(d: ForceLink<NLink, NNode, SignalForceDir>) {
        const r = Math.hypot(
          d.target.x.d - d.source.x.d,
          d.target.y.d - d.source.y.d
        );
        return `
    M${d.source.x.d},${d.source.y.d}
    A${r},${r} 0 0,1 ${d.target.x.d},${d.target.y.d}
  `;
      }
    },
  });
}
