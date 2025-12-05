import { fdom, renderText } from 'mve-dom';

export default function () {
  fdom.div({
    children() {
      renderText`cc`;
    },
  });
}
