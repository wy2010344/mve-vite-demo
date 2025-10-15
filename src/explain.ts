import { dom, fdom } from 'mve-dom';
import { cns } from 'wy-dom-helper';
import { createSignal, EmptyFun } from 'wy-helper';
import { MdOutlineDescription } from 'mve-icons/md';
import { renderSizeSvg } from './mve-icon';
import { IoMdCloseCircleOutline } from 'mve-icons/io';

export default function explain(renderBody: EmptyFun) {
  const show = createSignal(false);

  fdom.button({
    className:
      'daisy-btn daisy-btn-ghost daisy-btn-circle absolute bottom-1 right-1',
    onClick() {
      show.set(true);
    },
    aria_label: 'explain',
    title: 'explain',
    children() {
      MdOutlineDescription();
    },
  });
  fdom.div({
    className() {
      return cns('daisy-modal', show.get() && 'daisy-modal-open');
    },
    role: 'dialog',
    id: 'explain',
    children() {
      fdom.div({
        className: 'daisy-modal-box',
        children() {
          renderBody();
          fdom.div({
            className: 'daisy-modal-action',
            children() {
              fdom.button({
                className: 'daisy-btn daisy-btn-ghost daisy-btn-circle',
                onClick() {
                  show.set(false);
                },
                children() {
                  IoMdCloseCircleOutline();
                },
              });
            },
          });
        },
      });
    },
  });
}
