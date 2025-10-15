import { dom, fdom } from 'mve-dom';
import { GetValue } from 'wy-helper';

export default function (
  getQuery: GetValue<Record<string, any>>,
  getNodes: GetValue<string[]>
) {
  dom.div({})
    .renderText`${() => JSON.stringify(getQuery())} -- ${() => getNodes().join('/')}`;
}
