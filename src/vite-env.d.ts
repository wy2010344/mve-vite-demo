/// <reference types="vite/client" />


declare module 'scroller';
declare module 'daisyui/functions/themeOrder';

declare namespace JSX {
  type IntrinsicElements = import("mve-dom-helper").mve.IntrinsicElements
  type Element = import("mve-dom-helper").mve.Element
  type ElementChildrenAttribute = import("mve-dom-helper").mve.ElementChildrenAttribute
  type IntrinsicAttributes = import("mve-dom-helper").mve.IntrinsicAttributes
}