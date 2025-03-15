import { fdom } from "mve-dom";
import { renderMobileView } from "../onlyMobile";
import { createSignal, simpleEqualsNotEqual, MomentumIScroll, YearMonthDayVirtualView } from "wy-helper";
import fixRightTop from "../fixRightTop";
import themeDropdown from "../themeDropdown";
import firstDayOfWeek from "./firstDayOfWeek";
import renderHeader from "./renderHeader";
import renderPageList from "./renderPageList";
import { topContext } from "./context";
import { signalAnimateFrame } from "wy-dom-helper";

// const fc = new FrictionalFactory()
const bs = MomentumIScroll.get()
export default function () {

  renderMobileView(function (getFullWidth, mock) {
    if (mock) {
      fixRightTop(function () {
        firstDayOfWeek()
        themeDropdown()
      })
    }
    const date = createSignal(YearMonthDayVirtualView.fromDate(new Date()), simpleEqualsNotEqual)

    topContext.provide({
      calendarScrollY: signalAnimateFrame(0)
    })
    fdom.div({
      className: 'absolute inset-0 flex flex-col select-none',
      children() {
        renderHeader(date, getFullWidth)
        renderPageList(date)
      }
    })
  })

}
