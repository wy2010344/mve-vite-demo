import { fdom } from "mve-dom";
import { FaArrowRight } from "mve-icons/fa";
import { renderSizeSvg } from "../mve-icon";
import { fLink } from "../history";

import themes from "daisyui/functions/themeOrder"
import { faker } from "@faker-js/faker";

export default function () {
  renderCard()
}


function renderCard() {
  card({
    href: '/magnified-dock',
    title: `magnified-dock`,
    description: `一个类似mac上的dock的实现`
  })
  card({
    href: '/calendar',
    title: `拖拽日历`,
    description: `简单拖拽日历`
  })
  card({
    href: '/exit-animate',
    title: '退出动画',
    description: '入场动画、离场动画'
  })
  fdom.div({

    data_theme: randomTheme(),
    className: 'daisy-card bg-primary text-primary-content w-96',
    children() {

      fdom.div({
        className: 'daisy-card-body',
        children() {
          fdom.h2({
            className: 'daisy-card-title',
            childrenType: 'text',
            children: 'd3相关',
          })
          fdom.div({
            className: "grid grid-cols-2 gap-1",
            children() {

              fLink({
                href: '/d3/force/demo1',
                className: "daisy-btn",
                childrenType: 'text',
                data_theme: randomTheme(),
                children: 'force-demo1'
              })
              fLink({
                href: '/d3/force/demo2',
                className: "daisy-btn",
                childrenType: 'text',
                data_theme: randomTheme(),
                children: 'force-demo2'
              })
              fLink({
                href: '/d3/force/demo3',
                className: "daisy-btn",
                childrenType: 'text',
                data_theme: randomTheme(),
                children: 'force-demo3'
              })
              fLink({
                href: '/d3/force/demo4',
                className: "daisy-btn",
                childrenType: 'text',
                data_theme: randomTheme(),
                children: 'force-demo4'
              })
            }
          })
        }
      })
    }
  })
  card({
    href: '/reorder-demo',
    title: '调整顺序',
    description: '通过拖拽调整顺序、边缘自动滚动'
  })
}


function randomTheme() {
  return themes[faker.number.int({
    max: themes.length - 1
  })]
}

function card({
  href,
  title,
  description
}: {
  href: string
  title: string
  description: string
}) {

  fLink({
    href: href,
    data_theme: randomTheme(),
    className: 'daisy-card bg-primary text-primary-content w-96',
    children() {
      fdom.div({
        className: 'daisy-card-body',
        children() {
          fdom.h2({
            className: 'daisy-card-title',
            childrenType: 'text',
            children: title,
          })
          fdom.p({
            childrenType: 'text',
            children: description,
          })
          fdom.div({
            className: 'daisy-card-actions justify-end',
            children() {
              FaArrowRight(renderSizeSvg, '30px')
            }
          })
        }
      })
    }
  })
}