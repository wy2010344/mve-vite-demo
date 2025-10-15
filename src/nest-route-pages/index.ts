import { routerProvide } from 'mve-dom-helper/history';
import { createHashHistory } from 'history';
import { createRoot, svg } from 'mve-dom';
import { renderPop } from 'mve-dom-helper';
import {
  argForceNumber,
  createTreeRoute,
  getBranchKey,
  renderOneKey,
} from 'mve-helper';
import { IconContext } from 'mve-icons';
import { loadContext } from './loadContext';
const app = document.querySelector<HTMLDivElement>('#app')!;
const pages = import.meta.glob('./pages/**');
const { renderBranch, getBranch, preLoad } = createTreeRoute({
  treeArg: {
    number: argForceNumber,
  },
  pages,
  prefix: './pages/',
});
/**
 * 虽说是层级加载,复用layout
 * 其实是预知了存在
 *
 * 像react,子层级其实要作为数据传入容器,才能体现出差异性
 * 这里,当然,是同路径的区域,状态要保留
 */
const destroy = createRoot(app, () => {
  const { getHistoryState } = routerProvide(createHashHistory());
  IconContext.provide({
    renderItem(tag, attrs, children) {
      svg[tag as 'svg'](attrs).render(children);
    },
    renderRoot(fun, attrs, children) {
      svg
        .svg({
          ...attrs,
          fill: 'currentColor',
          stroke: 'currentColor',
          strokeWidth: '0',
        })
        .render(children);
    },
  });
  loadContext.provide({
    renderBranch,
    getBranch,
    preLoad,
  });
  renderOneKey(
    getBranch(() => getHistoryState().pathname),
    getBranchKey,
    function (key, branch) {
      renderBranch(branch);
    }
  );
  renderPop();
});
