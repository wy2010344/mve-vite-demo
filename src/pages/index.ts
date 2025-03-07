import { svg } from "d3";
import { dom, fdom, fsvg } from "mve-dom";
import { CiCircleInfo } from "mve-icons/ci";
import { EmptyFun } from "wy-helper";
import { FaArrowRight } from "mve-icons/fa";
import { renderSizeSvg } from "../mve-icon";


export default function () {
  renderCard()
}


function renderCard() {
  card({
    href: './magnified-dock',
    title: `magnified-dock`,
    description: `一个类似mac上的dock的实现`
  })
  card({
    href: './calendar',
    title: `拖拽日历`,
    description: `简单拖拽日历`
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

  fdom.a({
    href: href,
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