import { fdom } from "mve-dom";
import { renderMobileView } from "../../onlyMobile";
import { ClampingScrollFactory } from "wy-helper";
import fixRightTop from "../../fixRightTop";
import themeDropdown from "../../themeDropdown";
import { chooseFirstDayOfWeek, dailyRecord } from 'daisy-mobile-helper'
import demoList from "./demoList";
import { faker } from "@faker-js/faker";
// const fc = new FrictionalFactory()
const bs = ClampingScrollFactory.get()
export default function () {

  renderMobileView(function ({
    width: getFullWidth
  }, mock) {
    if (mock) {
      fixRightTop(function () {
        chooseFirstDayOfWeek()
        themeDropdown()
      })
    }

    dailyRecord({
      getFullWidth,
      renderHeaderRight() {

        fdom.div({
          className: 'text-base-content',
          children() {
            fdom.span({
              className: 'mr-[0.125em] text-2xl',
              childrenType: 'text',
              children: '¥'
            })
            fdom.span({
              className: 'text-2xl',
              childrenType: 'text',
              children: '23'
            })
            fdom.sup({
              className: 'opacity-50 text-[0.75em] -top-[0.75em]',
              childrenType: 'text',
              children: '.00'
            })
          }
        })
      },
      renderContent(w) {
        demoList(faker.number.int({
          min: 1,
          max: 58
        }))
      },
    })
  })

}
