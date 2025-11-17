import { hookTheme } from 'daisy-mobile-helper';
import { fdom } from 'mve-dom';
import { renderInputTrans } from 'mve-dom-helper';
import { hookDestroy } from 'mve-helper';
import { FaPlus, FaTrash } from 'mve-icons/fa';
import { subscribeEventListener } from 'wy-dom-helper';
import { createStyle } from 'wy-dom-helper/window-theme';
import { GetValue, createSignal, numberStoreTranfrom } from 'wy-helper';
import { renderSizeSvg } from '~/mve-icon';

export function Button({
  showDelete,
  onClickAdd,
  onClickDelete,
}: {
  showDelete: GetValue<any>;
  onClickAdd(numberInputs: number, numberOutputs: number): void;
  onClickDelete(): void;
}) {
  const show = createSignal(false);
  const numberInputs = createSignal(0);
  const numberOutputs = createSignal(0);
  const getStyle = hookTheme(btn);
  fdom.div({
    className: getStyle('wrapper'),
    children() {
      fdom.button({
        className() {
          return getStyle('buttonDelete', {
            hide: !showDelete(),
          });
        },
        onClick: onClickDelete,
        children() {
          FaTrash(renderSizeSvg, '12px');
        },
      });
      fdom.button({
        className: getStyle('buttonAdd'),
        children() {
          FaPlus(renderSizeSvg, '12px');
        },
        onClick(e) {
          e.stopPropagation();
          show.set(!show.get());
        },
      });

      fdom.div({
        className() {
          return getStyle('dropdown', {
            hide: !show.get(),
          });
        },
        children(div: HTMLElement) {
          hookDestroy(
            subscribeEventListener(window, 'click', e => {
              if (div.contains(e.target as any)) {
                return;
              }
              show.set(false);
            })
          );

          fdom.label({
            className: getStyle('label'),
            children: 'Number of inputs',
          });
          renderInputTrans(
            numberStoreTranfrom,
            numberInputs.get,
            numberInputs.set,
            fdom.input({
              className: getStyle('input'),
              type: 'number',
              step: 1,
              value: 0,
              min: 0,
            })
          );
          fdom.label({
            className: getStyle('label'),
            children: 'Number of outputs',
          });
          renderInputTrans(
            numberStoreTranfrom,
            numberOutputs.get,
            numberOutputs.set,
            fdom.input({
              className: getStyle('input'),
              type: 'number',
              step: 1,
              value: 0,
              min: 0,
            })
          );

          fdom.button({
            className: getStyle('buttonRect'),
            onClick(e) {
              e.stopPropagation();
              show.set(false);
              onClickAdd(numberInputs.get(), numberOutputs.get());
              numberInputs.set(0);
              numberOutputs.set(0);
            },
            children: 'Add node',
          });
        },
      });
    },
  });
}

const btn = createStyle(
  token => {
    return {
      wrapper: {
        base: {
          position: 'absolute',
          top: '0px',
          left: '0px',
          width: '100%',
          padding: '24px 38px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          gap: '24px',
          zIndex: 300,
          pointerEvents: 'none',
          boxSizing: 'border-box',
        },
      },
      buttonAdd: {
        base: {
          transition: 'all ease 0.2s',
          backgroundColor: '#4f46e5',
          padding: '12px',
          borderRadius: '100%',
          color: 'white',
          fontSize: '24px',
          cursor: 'pointer',
          pointerEvents: 'all',
          boxShadow: '1px 1px 11px -6px rgba(0, 0, 0, 0.75)',
          outline: 'none',
          border: 'none',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          '&:hover': {
            backgroundColor: '#3730a3',
            boxShadow: '2px 2px 12px -6px rgba(0, 0, 0, 0.75)',
            transform: 'scale(1.05)',
          },
          '&:active': {
            transform: 'scale(0.05)',
          },
        },
      },
      buttonDelete: {
        base: {
          transition: 'all ease 0.2s',
          backgroundColor: 'red',
          padding: '12px',
          borderRadius: '100%',
          color: 'white',
          fontSize: '24px',
          cursor: 'pointer',
          pointerEvents: 'all',
          boxShadow: '1px 1px 11px -6px rgba(0, 0, 0, 0.75)',
          outline: 'none',
          border: 'none',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          '&:hover': {
            backgroundColor: '#3730a3',
            boxShadow: '2px 2px 12px -6px rgba(0, 0, 0, 0.75)',
            transform: 'scale(1.05)',
          },
          '&:active': {
            transform: 'scale(0.05)',
          },
        },
        variants: {
          hide: {
            true: {
              display: 'none',
            },
          },
        },
      },
      dropdown: {
        base: {
          pointerEvents: 'all',
          position: 'absolute',
          top: '86px',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: 'white',
          boxShadow: '1px 1px 11px -6px rgba(0, 0, 0, 0.75)',
          padding: '12px',
          transition: 'all ease 0.2s',
        },
        variants: {
          hide: {
            true: {
              visibility: 'hidden',
              opacity: 0,
              pointerEvents: 'none',
              transform: 'translateX(24px)',
            },
          },
        },
      },
      label: {
        base: {
          lineHeight: '1.5rem',
          fontWghet: 500,
          fontSize: '0.875rem',
          color: '#27272a',
        },
      },
      input: {
        base: {
          lineHeight: '1.5rem',
          fontWghet: 500,
          fontSize: '0.875rem',
          color: '#27272a',
          borderRadius: '0.375rem',
          width: '100%',
          padding: '0.5rem 0.75rem',
          backgroundColor: '#ffffff0d',
          border: '1px solid #b2b3b5',
          boxShadow: '1px 1px 11px -6px rgba(0, 0, 0, 0.75)',
          marginBottom: '12px',
          boxSizing: 'border-box',
        },
      },
      buttonRect: {
        base: {
          transition: 'all ease 0.3s',
          backgroundColor: '#4f46e5',
          padding: '12px',
          borderRadius: '6px',
          color: 'white',
          fontSize: '16px',
          cursor: 'pointer',
          pointerEvents: 'all',
          boxShadow: '1px 1px 11px -6px rgba(0, 0, 0, 0.75)',
          outline: 'none',
          border: 'none',
          '&:hover': {
            backgroundColor: '#3730a3',
            boxShadow: '2px 2px 12px -6px rgba(0, 0, 0, 0.75)',
            transform: 'scale(1.05)',
          },
          '&:active': {
            transform: 'scale(0.95)',
          },
        },
      },
    };
  },
  {
    wrapper: {},
    buttonDelete: {},
    buttonAdd: {},
    dropdown: {},
    label: {},
    input: {},
    buttonRect: {},
  }
);
