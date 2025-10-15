import { dom, renderText } from 'mve-dom';
import { genTemplateStringS1, VType } from 'wy-helper';
import { marked } from 'marked';
export default function (ts: TemplateStringsArray, ...vs: (string | number)[]) {
  const str = genTemplateStringS1(ts, vs);

  dom
    .article({
      className: 'daisy-prose prose',
    })
    .renderInnerHTML(
      marked.parse(str, {
        async: false,
      })
    );
}
