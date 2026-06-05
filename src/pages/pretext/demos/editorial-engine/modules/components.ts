import { fdom } from 'mve-dom';
import { orbs, committedTextProjection } from './state';
import { orbDefs } from './constants';
import { DROP_CAP_FONT, DROP_CAP_SIZE, DROP_CAP_TEXT } from '../prepared';

// 创建球体元素
export function createOrbElements() {
  return orbDefs.map(({ color }, index) => {
    return fdom.div({
      className: 'orb absolute rounded-full pointer-events-none z-10',
      s_background: `radial-gradient(circle at 35% 35%, rgba(${color[0]},${color[1]},${color[2]},0.35), rgba(${color[0]},${color[1]},${color[2]},0.12) 55%, transparent 72%)`,
      s_boxShadow: `0 0 60px 15px rgba(${color[0]},${color[1]},${color[2]},0.18), 0 0 120px 40px rgba(${color[0]},${color[1]},${color[2]},0.07)`,
      s_left: () => {
        const orb = orbs.get()[index];
        return orb ? `${orb.x - orb.r}px` : '0px';
      },
      s_top: () => {
        const orb = orbs.get()[index];
        return orb ? `${orb.y - orb.r}px` : '0px';
      },
      s_width: () => {
        const orb = orbs.get()[index];
        return orb ? `${orb.r * 2}px` : '0px';
      },
      s_height: () => {
        const orb = orbs.get()[index];
        return orb ? `${orb.r * 2}px` : '0px';
      },
      s_opacity: () => {
        const orb = orbs.get()[index];
        return orb ? (orb.paused ? '0.45' : '1') : '0';
      },
    });
  });
}

// 创建首字母大写元素
export function createDropCapElement() {
  return fdom.div({
    className: 'drop-cap absolute pointer-events-none z-2',
    s_font: DROP_CAP_FONT,
    s_lineHeight: `${DROP_CAP_SIZE}px`,
    children: DROP_CAP_TEXT,
  });
}

// 创建标题行元素
export function createHeadlineLines(container: HTMLElement) {
  const projection = committedTextProjection.get();
  if (!projection) return [];

  const lines = projection.headlineLines;
  const elements: HTMLElement[] = [];

  for (let index = 0; index < lines.length; index++) {
    const line = lines[index];
    const element = document.createElement('span');
    element.className =
      'headline-line absolute whitespace-pre font-bold text-white tracking-[-0.5px] z-2 select-text';
    element.textContent = line.text;
    element.style.left = `${projection.headlineLeft + line.x}px`;
    element.style.top = `${projection.headlineTop + line.y}px`;
    element.style.font = projection.headlineFont;
    element.style.lineHeight = `${projection.headlineLineHeight}px`;
    container.appendChild(element);
    elements.push(element);
  }

  return elements;
}

// 创建正文行元素
export function createBodyLines(container: HTMLElement) {
  const projection = committedTextProjection.get();
  if (!projection) return [];

  const lines = projection.bodyLines;
  const elements: HTMLElement[] = [];

  for (let index = 0; index < lines.length; index++) {
    const line = lines[index];
    const element = document.createElement('span');
    element.className =
      'line absolute whitespace-pre z-1 text-[#e8e4dc] select-text';
    element.textContent = line.text;
    element.style.left = `${line.x}px`;
    element.style.top = `${line.y}px`;
    element.style.font = projection.bodyFont;
    element.style.lineHeight = `${projection.bodyLineHeight}px`;
    container.appendChild(element);
    elements.push(element);
  }

  return elements;
}

// 创建引用文本行元素
export function createPullquoteLines(container: HTMLElement) {
  const projection = committedTextProjection.get();
  if (!projection) return [];

  const lines = projection.pullquoteLines;
  const elements: HTMLElement[] = [];

  for (let index = 0; index < lines.length; index++) {
    const line = lines[index];
    const element = document.createElement('span');
    element.className =
      'pullquote-line absolute whitespace-pre italic text-[#e8a070] select-text';
    element.textContent = line.text;
    element.style.left = `${line.x}px`;
    element.style.top = `${line.y}px`;
    element.style.font = projection.pullquoteFont;
    element.style.lineHeight = `${projection.pullquoteLineHeight}px`;
    container.appendChild(element);
    elements.push(element);
  }

  return elements;
}

// 创建引用文本框元素
export function createPullquoteBoxes(
  container: HTMLElement,
  pullquoteRects: any[]
) {
  const elements: HTMLElement[] = [];

  for (let index = 0; index < pullquoteRects.length; index++) {
    const pullquote = pullquoteRects[index];
    const element = document.createElement('div');
    element.className = 'pullquote-box';
    element.style.left = `${pullquote.x}px`;
    element.style.top = `${pullquote.y}px`;
    element.style.width = `${pullquote.w}px`;
    element.style.height = `${pullquote.h}px`;
    container.appendChild(element);
    elements.push(element);
  }

  return elements;
}
