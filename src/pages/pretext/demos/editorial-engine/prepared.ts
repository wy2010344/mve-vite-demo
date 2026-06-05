import { prepareWithSegments, walkLineRanges } from '@chenglou/pretext';
import { BODY_TEXT, PULLQUOTE_TEXTS } from './BODY_TEXT';
import {
  BODY_FONT,
  PQ_FONT,
  HEADLINE_FONT_FAMILY,
  BODY_LINE_HEIGHT,
  DROP_CAP_LINES,
} from './modules/constants';

// 预准备正文文本
export const preparedBody = prepareWithSegments(BODY_TEXT, BODY_FONT);

// 预准备引用文本
export const preparedPullquotes = PULLQUOTE_TEXTS.map(text =>
  prepareWithSegments(text, PQ_FONT)
);

// 引用文本规格
export const pullquoteSpecs = [
  {
    prepared: preparedPullquotes[0]!,
    placement: { colIdx: 0, yFrac: 0.48, wFrac: 0.52, side: 'right' as const },
  },
  {
    prepared: preparedPullquotes[1]!,
    placement: { colIdx: 1, yFrac: 0.32, wFrac: 0.5, side: 'left' as const },
  },
];

// 预准备首字母大写
export const DROP_CAP_SIZE = BODY_LINE_HEIGHT * DROP_CAP_LINES - 4;
export const DROP_CAP_FONT = `700 ${DROP_CAP_SIZE}px ${HEADLINE_FONT_FAMILY}`;
export const DROP_CAP_TEXT = BODY_TEXT[0]!;
export const preparedDropCap = prepareWithSegments(
  DROP_CAP_TEXT,
  DROP_CAP_FONT
);

// 计算首字母大写宽度
let dropCapWidth = 0;
walkLineRanges(preparedDropCap, 9999, line => {
  dropCapWidth = line.width;
});
export const DROP_CAP_TOTAL_W = Math.ceil(dropCapWidth) + 10;

// 导出 DROP_CAP_LINES 以便其他模块使用
export { DROP_CAP_LINES };
