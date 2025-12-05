import { dom } from 'mve-dom';
import { NotfoundLoaderParam } from 'mve-helper';

export default function (a: NotfoundLoaderParam) {
  dom.div({})
    .renderText`${() => JSON.stringify(a.getQuery())} -- ${() => a.get().nodes.slice(a.get().index).join('/')}`;
}
