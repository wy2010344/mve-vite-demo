import { hookTheme } from 'daisy-mobile-helper';
import { fdom } from 'mve-dom';
import { pointerMove } from 'wy-dom-helper';
import { createStyle } from 'wy-dom-helper/window-theme';
import {
  StoreRef,
  createSignal,
  emptyArray,
  emptyObject,
  numberBetween,
} from 'wy-helper';
import { Button } from './button';
import {
  renderArray,
  renderArrayKey,
  renderIf,
  renderMap,
  renderOne,
} from 'mve-helper';

import { type Node, context, NodeArgs, LineFrom, GetPoint } from './context';
import { Edge } from './edge';
import { NumberData, createNumberNodeType } from './node';
import { renderRecord } from 'mve-helper';

export default function () {
  const getStyle = hookTheme(board);
  const grabbingBoard = createSignal(false);
  const transX = createSignal(0);
  const transY = createSignal(0);
  const scale = createSignal(1);
  const nodes = createSignal<Node[]>(emptyArray);
  const selectedNode = createSignal<NodeArgs | undefined>(undefined);
  const selectedEdge = createSignal<
    | {
        node: Node;
        key: string;
      }
    | undefined
  >(undefined);
  const newEdge = createSignal<
    | {
        location: GetPoint;
        fromNode: Node;
        fromKey: string;
        toPointX: StoreRef<number>;
        toPointY: StoreRef<number>;
        hoverInto: StoreRef<
          | {
              node: Node;
              key: string;
            }
          | undefined
        >;
      }
    | undefined
  >(undefined);
  context.provide({
    scale,
    selectedNode,
    onPointerDownOutput(e, node, sourceKey) {
      const location = node.type.outputLocation(sourceKey);
      if (!location) {
        throw '';
      }
      const s = scale.get();

      const rect = wrapper.getBoundingClientRect();
      const { hoverInto, toPointX, toPointY } = newEdge.set({
        location,
        fromNode: node,
        fromKey: sourceKey,
        //坐标需要经过相对转换
        toPointX: createSignal((e.pageX - rect.left - transX.get()) / s),
        toPointY: createSignal((e.pageY - rect.top - transY.get()) / s),
        hoverInto: createSignal(undefined),
      })!;
      pointerMove({
        onMove(ne) {
          const s = scale.get();
          toPointX.set(toPointX.get() + (ne.pageX - e.pageX) / s);
          toPointY.set(toPointY.get() + (ne.pageY - e.pageY) / s);
          e = ne;
        },
        onEnd(e) {
          const into = hoverInto.get();
          if (into) {
            const o = into.node.args.inputs.set({
              ...into.node.args.inputs.get(),
              [into.key]: {
                fromKey: sourceKey,
                fromNode: node,
              },
            });
            selectedEdge.set(into);
          }
          newEdge.set(undefined);
        },
      });
    },
    onPointerEnterInput(e, node, key) {
      const ne = newEdge.get();
      if (!ne) {
        return;
      }
      ne.hoverInto.set({
        key: key,
        node: node,
      });
    },
    onPointerLeaveInput(e, node, index) {
      const ne = newEdge.get();
      if (!ne) {
        return;
      }
      ne.hoverInto.set(undefined);
    },
  });
  const wrapper = fdom.div({
    className: getStyle('wrapper', {
      className: 'inset-10 absolute  overflow-hidden',
    }),
    onPointerDown(lastE: PointerEvent) {
      selectedNode.set(undefined);
      grabbingBoard.set(true);
      pointerMove({
        onMove(e) {
          const deltaX = e.pageX - lastE.pageX;
          const deltaY = e.pageY - lastE.pageY;
          transX.set(transX.get() + deltaX);
          transY.set(transY.get() + deltaY);
          lastE = e;
        },
        onEnd(e) {
          grabbingBoard.set(false);
        },
      });
    },
    children(wrapper: HTMLElement) {
      wrapper.addEventListener('wheel', e => {
        e.preventDefault();
        const rect = wrapper.getBoundingClientRect();
        const px = e.clientX - rect.left; // 光标在视口的位置
        const py = e.clientY - rect.top;

        const s = scale.get();
        const s1 = scale.set(
          numberBetween(1, scale.get() + e.deltaY * -0.005, 2)
        );
        // 1. 计算光标在「当前缩放」下的模型坐标
        const mx = (px - transX.get()) / s;
        const my = (py - transY.get()) / s;
        //2. 以光标为中心更新偏移
        transX.set(px - mx * s1);
        transY.set(py - my * s1);
      });

      Button({
        showDelete() {
          return selectedNode.get() || selectedEdge.get();
        },
        onClickAdd(numberInputs, numberOutputs) {
          const args: NodeArgs<NumberData> = {
            id: `node_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
            x: createSignal(Math.random() * window.innerWidth),
            y: createSignal(Math.random() * window.innerHeight),
            data: {
              numberInputs: createSignal(numberInputs),
              numberOutputs: createSignal(numberOutputs),
            },
            inputs: createSignal(emptyObject),
          };
          selectedNode.set(args);
          nodes.set(
            nodes.get().concat({
              args,
              type: createNumberNodeType(args),
            })
          );
        },
        onClickDelete() {
          if (selectedNode.get()) {
            nodes.set(nodes.get().filter(x => x.args != selectedNode.get()));
            selectedNode.set(undefined);
          }
          const edge = selectedEdge.get();
          if (edge) {
            const o = edge.node.args.inputs.set({
              ...edge.node.args.inputs.get(),
            });
            delete (o as any)[edge.key];
          }
        },
      });
      fdom.div({
        className() {
          return getStyle('main', {
            dragging: grabbingBoard.get(),
          });
        },
        s_transform() {
          return `translate(${transX.get()}px,${transY.get()}px) scale(${scale.get()})`;
        },
        children() {
          renderArray(nodes.get, function (node) {
            node.type.render(node);
            renderRecord(node.args.inputs.get, function (key, getItem) {
              renderOne(getItem, function (item) {
                const from = node.type.inputLocation(key);
                const to = item.fromNode.type.outputLocation(item.fromKey);
                if (from && to) {
                  Edge({
                    fromX: from.x,
                    fromY: from.y,
                    toX: to.x,
                    toY: to.y,
                    selected() {
                      const e = selectedEdge.get();
                      return e && e.node == node && e.key == key;
                    },
                    onPointerDown(e) {
                      selectedEdge.set({
                        node,
                        key,
                      });
                    },
                  });
                }
              });
            });
          });
          renderOne(newEdge.get, function (edge) {
            if (edge) {
              Edge({
                isNew: true,
                toX: edge.location.x,
                toY: edge.location.y,
                fromX: edge.toPointX.get,
                fromY: edge.toPointY.get,
              });
            }
          });
        },
      });
    },
  });
}

const board = createStyle(
  token => {
    return {
      wrapper: {},
      main: {
        base: {
          position: 'absolute',
          //关键点
          transformOrigin: '0 0',
          width: '100%',
          height: '100%',
          backgroundSize: '30px 30px',
          backgroundImage:
            'radial-gradient(circle, #b8b8b8bf 1px,rgba(0, 0, 0, 0) 1px )',
        },
        variants: {
          dragging: {
            true: {
              cursor: 'grab',
            },
            false: {
              cursor: 'grabbing',
            },
          },
        },
      },
    };
  },
  {
    wrapper: {},
    main: {},
  }
);
