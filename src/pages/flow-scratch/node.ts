import { hookTheme } from 'daisy-mobile-helper';
import { fdom } from 'mve-dom';
import { createStyle } from 'wy-dom-helper/window-theme';
import {
  GetValue,
  StoreRef,
  arrayCountCreateWith,
  createSignal,
  memo,
} from 'wy-helper';
import { Node, NodeArgs, NodeType, context } from './context';
import { pointerMove } from 'wy-dom-helper';
import { renderArray } from 'mve-helper';

export interface NumberData {
  numberInputs: StoreRef<number>;
  numberOutputs: StoreRef<number>;
}

/**
 *
 */
export function createNumberNodeType(data: NodeArgs<NumberData>): NodeType {
  const { numberInputs, numberOutputs } = data.data;
  const inputs = memo(() =>
    arrayCountCreateWith(numberInputs.get(), i => i.toString())
  );
  const outputs = memo(() =>
    arrayCountCreateWith(numberOutputs.get(), i => i.toString())
  );

  const totalHeight = () => {
    return Math.max(inputs().length, outputs().length) * 24 + 12 + 4;
  };
  const yInputsBegin = memo(() => {
    //height:120,padding:4,gap:12,radius:6
    return (totalHeight() - inputs().length * 24) / 2;
  });
  const yOutputsBegin = memo(() => {
    //height:120,padding:4,gap:12,radius:6
    return (totalHeight() - outputs().length * 24) / 2;
  });
  const inputLocations = memo(() => {
    return inputs().map((_, i) => {
      return {
        x() {
          //24,包含直径12
          return data.x.get() - 18;
        },
        y() {
          //height:120,padding:4,gap:12,
          return data.y.get() + yInputsBegin() + i * 24;
        },
      };
    });
  });
  const outputLocations = memo(() => {
    return outputs().map((_, i) => {
      return {
        x() {
          //120的宽度，24的间隔，-6的半径
          return data.x.get() + 138;
        },
        y() {
          return data.y.get() + yOutputsBegin() + i * 24;
        },
      };
    });
  });
  function inputLocation(x: string) {
    const vs = inputs();
    let idx = vs.indexOf(x);
    if (idx < 0) {
      return;
    }
    return inputLocations()[idx];
  }
  function outputLocation(x: string) {
    const vs = outputs();
    let idx = vs.indexOf(x);
    if (idx < 0) {
      return;
    }
    return outputLocations()[idx];
  }
  return {
    render(it) {
      const getStyle = hookTheme(node);
      const {
        onPointerEnterInput,
        onPointerLeaveInput,
        onPointerDownOutput,
        scale,
        selectedNode,
      } = context.consume();
      fdom.div({
        className() {
          return getStyle('node', {
            selected: selectedNode.get() == data,
          });
        },
        s_transform() {
          return `translate(${data.x.get()}px, ${data.y.get()}px)`;
        },
        onPointerDown(lastE: PointerEvent) {
          lastE.stopPropagation();
          selectedNode.set(data);
          pointerMove({
            onMove(e) {
              const s = scale.get();
              data.x.set(data.x.get() + (e.pageX - lastE.pageX) / s);
              data.y.set(data.y.get() + (e.pageY - lastE.pageY) / s);
              lastE = e;
            },
          });
        },
        children() {
          fdom.div({
            className: getStyle('inputsWrapper'),
            children() {
              renderArray(inputs, function (x) {
                fdom.div({
                  className: getStyle('input'),
                  onPointerEnter(e) {
                    onPointerEnterInput(e, it, x);
                  },
                  onPointerLeave(e) {
                    onPointerLeaveInput(e, it, x);
                  },
                });
              });
              fdom.button({
                className: getStyle('plus'),
                onClick() {
                  numberInputs.set(numberInputs.get() + 1);
                },
              });
            },
          });

          fdom.div({
            className: getStyle('outputsWrapper'),
            children() {
              renderArray(outputs, function (x) {
                fdom.div({
                  className: getStyle('output'),
                  onPointerDown(e) {
                    e.stopPropagation();
                    onPointerDownOutput(e, it, x);
                  },
                });
              });
              fdom.button({
                className: getStyle('plus'),
                onClick() {
                  numberOutputs.set(numberOutputs.get() + 1);
                },
              });
            },
          });
        },
      });
    },
    inputLocation,
    outputLocation,
  };
}

const node = createStyle(
  token => {
    return {
      node: {
        base: {
          display: 'flex',
          justifyContent: 'space-between',
          position: 'absolute',
          cursor: 'grab',
          backgroundColor: 'white',
          border: '2px solid #c4c4c4',
          borderRadius: '6px',
          boxShadow: '1px 1px 11px -6px rgba(0, 0, 0, 0.75)',
          userSelect: 'none',
          zIndex: 1,
          transition: 'border ease 0.2s, box-shadow ease 0.2s',
          width: '120px',
          '&:hover': {
            boxShadow: '2px 2px 12px -6px rgba(0, 0, 0, 0.75)',
          },
        },
        variants: {
          selected: {
            true: {
              border: '2px solid #e38c29',
              '&:hover': {
                boxShadow: '2px 2px 12px -6px rgba(0, 0, 0, 0.75)',
              },
            },
          },
        },
      },
      inputsWrapper: {
        base: {
          position: 'relative',
          left: '-24px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '12px',
          width: '12px',
          pointerEvents: 'none',
        },
      },
      input: {
        base: {
          width: '12px',
          height: '12px',
          borderRadius: '100%',
          backgroundColor: '#e38c29',
          cursor: 'crosshair',
          pointerEvents: 'all',
        },
      },
      outputsWrapper: {
        base: {
          position: 'relative',
          right: '-24px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '12px',
          width: '12px',
          pointerEvents: 'none',
        },
      },
      output: {
        base: {
          width: '12px',
          height: '12px',
          borderRadius: '100%',
          backgroundColor: '#e38c29',
          cursor: 'crosshair',
          pointerEvents: 'all',
        },
      },
      plus: {
        base: {
          position: 'absolute',
          bottom: '-24px',
          width: '12px',
          height: '12px',
          borderRadius: '100%',
          backgroundColor: 'green',
          pointerEvents: 'all',
          opacity: 0.3,
          '&:hover': { opacity: 1 },
        },
      },
    };
  },
  {
    node: {},
    inputsWrapper: {},
    input: {},
    outputsWrapper: {},
    output: {},
    plus: {},
  }
);
