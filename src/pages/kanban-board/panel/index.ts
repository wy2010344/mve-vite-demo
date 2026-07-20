import {
  addEffect,
  createLateSignal,
  createSignal,
  extendMaterialScheme,
  objectMap,
} from 'wy-helper';
import { fdom } from 'mve-dom';
import {
  ComponentShowcase,
  createWindow,
  hookRewriteTheme,
  hookTheme,
  panel,
  renderWindows,
} from 'daisy-mobile-helper';
import { navigation } from 'wy-dom-helper/window-theme';

import {
  argbFromHex,
  hexFromArgb,
  themeFromSourceColor,
} from '@material/material-color-utilities';
import { level, scheme, sourceColor } from './context';
export default function () {
  const getCls = hookTheme(navigation);
  hookRewriteTheme(oldtheme => {
    const theme = themeFromSourceColor(argbFromHex(sourceColor.get()));
    const v = theme.schemes[scheme.get()];
    const tokens = Object.assign(
      extendMaterialScheme(theme, scheme.get(), level.get() as 0),
      v.toJSON()
    );
    const newTokens = {
      ...oldtheme.tokens,

      colorSuccess: hexFromArgb(tokens.tertiary),
      colorOnSuccess: hexFromArgb(tokens.onTertiary),

      // 将 warning 映射到 secondary 或使用 error 的变体
      colorWarning: hexFromArgb(tokens.secondary),
      colorOnWarning: hexFromArgb(tokens.onSecondary),
    };
    objectMap(tokens, (token, key) => {
      newTokens[
        ('color' + key[0].toUpperCase() + key.slice(1)) as 'colorPrimary'
      ] = hexFromArgb(token);
    });

    console.log('token', newTokens, tokens);
    return {
      ...oldtheme,
      tokens: newTokens,
    };
  });
  fdom.div({
    className: 'w-full h-full flex flex-col overflow-hidden',
    children() {
      fdom.header({
        className: getCls('nav'),
        children() {
          fdom.button({
            className: getCls('navItem'),
            children: '组件',
            onClick() {
              createWindow(showCase.panel);
            },
          });
          fdom.button({
            className: getCls('navItem'),
            children: '主题',
            onClick() {
              import('./themeChooser').then(o => {
                createWindow(o.themeChooser.panel);
              });
            },
          });
        },
      });

      addEffect(() => {});
      fdom.div({
        className: 'flex-1 min-h-0',
        children: renderWindows,
      });
    },
  });
}
const showCase = panel(function () {
  return {
    title: 'Material Design 3.0 组件展示',
    typeIcon: '🧩',
    width: createLateSignal(1200),
    height: createLateSignal(800),
    children: ComponentShowcase,
  };
});
