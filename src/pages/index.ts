import { fdom } from "mve-dom";
import { FaArrowRight } from "mve-icons/fa";
import { renderSizeSvg } from "../mve-icon";
import { fLink } from 'daisy-mobile-helper'
import themes from "daisyui/functions/themeOrder"
import { faker } from "@faker-js/faker";
import fixRightTop from "../fixRightTop";
import themeDropdown, { randomTheme } from "../themeDropdown";
import explain from "../explain";
import markdown from "../markdown";
import { renderMobileView } from "../onlyMobile";

export default function () {
  renderMobileView(function ({
    width,
    height
  }, mock) {
    renderCard()
  })
}


function renderCard() {
  fixRightTop(function () {
    themeDropdown()
  })

  fdom.div({
    className: 'w-full h-full overflow-y-auto flex flex-col items-center gap-1 pt-1 pb-1',
    children() {
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
                children: '日历相关',
              })
              fdom.div({
                className: "grid grid-cols-2 gap-1",
                children() {
                  fLink({
                    href: '/daily-record',
                    className: "daisy-btn",
                    childrenType: 'text',
                    data_theme: randomTheme(),
                    children: 'daily-record'
                  })
                  fLink({
                    href: '/calendar',
                    className: "daisy-btn",
                    childrenType: 'text',
                    data_theme: randomTheme(),
                    children: '简单的日历'
                  })
                }
              })
            }
          })

        }
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
                children: '虚拟列表',
              })
              fdom.div({
                className: "grid grid-cols-2 gap-1",
                children() {
                  fLink({
                    href: '/virtual-list',
                    className: "daisy-btn",
                    childrenType: 'text',
                    data_theme: randomTheme(),
                    children: '原生滚动,动态高度'
                  })
                  fLink({
                    href: '/virtual-list/fix-height',
                    className: "daisy-btn",
                    childrenType: 'text',
                    data_theme: randomTheme(),
                    children: '自定义滚动,固定高度'
                  })
                  fLink({
                    href: '/virtual-list/dynamic-height',
                    className: "daisy-btn",
                    childrenType: 'text',
                    data_theme: randomTheme(),
                    children: '自定义滚动,动态高度'
                  })
                  fLink({
                    href: '/virtual-list/fix-height-reverse',
                    className: "daisy-btn",
                    childrenType: 'text',
                    data_theme: randomTheme(),
                    children: '自定义滚动,固定高度,自底向顶'
                  })
                }
              })
            }
          })
        }
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
      card({
        href: '/rich-text',
        title: '简单文本编辑与渲染',
        description: `contentEditable自定义输入框`
      })
      card({
        href: '/animation-view',
        title: `动画曲线查看`,
        description: `一些动画曲线的查看`
      })
      card({
        href: '/mve-canvas',
        title: `canvas上绘制的列表`,
        description: `受react-canvas启发,基于mve`
      })
      card({
        href: '/magnified-dock',
        title: `magnified-dock`,
        description: `一个类似mac上的dock的实现`
      })
      card({
        href: '/taro-cards',
        title: `塔罗卡片`,
        description: `展示使用mve拖拽信号的灵活`
      })

      card({
        href: '/onboard',
        title: '导航动画',
        description: '一个导航动画'
      })

      card({
        href: '/bigspin',
        title: '大转盘抽奖',
        description: ''
      })

      card({
        href: '/adjust-tag',
        title: '自适应tag标签',
        description: '展示的tag与宽度相匹配'
      })
      card({
        href: '/kanban-board',
        title: '看板拖拽',
        description: `在不同面板拖动与调整顺序`
      })
      card({
        href: '/staggered-grid-animation',
        title: '点击效果',
        description: ''
      })
      card({
        href: '/resize-panel',
        title: '自动高度面板',
        description: ''
      })
      card({
        href: '/swipe-tabs',
        title: '嵌套侧滑',
        description: ''
      })
    }
  })
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