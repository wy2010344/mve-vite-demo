import { fdom, renderText, renderTextContent } from 'mve-dom';
import { GetValue } from 'wy-helper';

export default function (arg: GetValue<{}>) {
  fdom.div({
    children() {
      renderTextContent(() => {
        return ` -主页- `;
      });
    },
  });
}
