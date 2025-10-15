import { fdom } from 'mve-dom';
import { BranchLoaderParam, getBranchKey, renderOneKey } from 'mve-helper';
import { loadContext } from '../loadContext';
import { renderMobileView } from '~/onlyMobile';

export default function (arg: BranchLoaderParam) {
  const { renderBranch } = loadContext.consume();
  renderMobileView(function ({ width, height }, mock) {
    fdom.div({
      children() {
        renderOneKey(arg.getChildren, getBranchKey, function (key) {
          renderBranch(arg.getChildren);
        });
      },
    });
  });
}
