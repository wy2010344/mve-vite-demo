import { fdom } from "mve-dom";
import { renderMobileView } from "../../onlyMobile";
import { createSignal, simpleEqualsNotEqual, YearMonthDayVirtualView, batchSignalEnd, DAYMILLSECONDS, ClampingScrollFactory, dragSnapWithList } from "wy-helper";
import fixRightTop from "../../fixRightTop";
import themeDropdown from "../../themeDropdown";
import firstDayOfWeek from "./firstDayOfWeek";
import renderHeader from "./renderHeader";
import renderPageList from "./renderPageList";
import { topContext } from "./context";
import { animateSignal } from "wy-dom-helper";
import renderScrollYear from "./renderYearMonthChoose";
import { hookDestroy } from "mve-helper";
import { defaultGetPageSnap, OnScroll } from "mve-dom-helper";

// const fc = new FrictionalFactory()
const bs = ClampingScrollFactory.get()
export default function () {

  renderMobileView(function ({
    width: getFullWidth
  }, mock) {
    if (mock) {
      fixRightTop(function () {
        firstDayOfWeek()
        themeDropdown()
      })
    }
    const now = YearMonthDayVirtualView.fromDate(new Date())
    const today = createSignal(now, simpleEqualsNotEqual)
    const interval = setInterval(() => {
      today.set(YearMonthDayVirtualView.fromDate(new Date()))
    }, DAYMILLSECONDS / 2)
    hookDestroy(() => {
      clearInterval(interval)
    })
    const date = createSignal(now, simpleEqualsNotEqual)

    //展示日历
    // const showCalendar = createSignal(false)

    function calendarOpenHeight() {
      return 5 * getFullWidth() / 7
      // return 6 * getFullWidth() / 7
    }
    function scrollYearMonthOpenHeight() {
      return 44 * 3
      // return 3 * getFullWidth() / 7
    }
    //日历滚动,只用这个表达开关
    const calendarScrollY = new OnScroll('y', {
      init: calendarOpenHeight(),
      maxScroll: calendarOpenHeight,
      targetSnap: dragSnapWithList([
        {
          beforeForce: 1,
          size: calendarOpenHeight(),
          afterForce: 1
        }
      ])
    })

    //年月picker的滚动,默认滚动到最大
    const yearMonthScrollY = new OnScroll('y', {
      init: scrollYearMonthOpenHeight(),
      maxScroll: scrollYearMonthOpenHeight,
      targetSnap: dragSnapWithList([
        {
          beforeForce: 1,
          size: scrollYearMonthOpenHeight(),
          afterForce: 1
        }
      ])
    })

    yearMonthScrollY.maxNextScroll = calendarScrollY
    calendarScrollY.minNextScroll = yearMonthScrollY
    // animateSignal(scrollYearMonthOpenHeight())

    function showYearMonth() {
      return yearMonthScrollY.get() != scrollYearMonthOpenHeight()
    }
    topContext.provide({
      yearMonthScrollY,
      showYearMonth,
      scrollYearMonthOpenHeight,
      calendarScrollY,
      calendarOpenHeight,
      today: today.get,
      showCalendar() {
        return calendarScrollY.get() != calendarOpenHeight()
      },
      async calendarClose() {
        if (showYearMonth()) {
          yearMonthScrollY.animateTo(scrollYearMonthOpenHeight())
          calendarScrollY.animateTo(calendarOpenHeight())
        } else {
          calendarScrollY.animateTo(calendarOpenHeight())
        }
      },
    })
    fdom.div({
      className: 'absolute inset-0 flex flex-col select-none touch-none',
      children() {
        renderScrollYear(date)
        renderHeader(date, getFullWidth)
        renderPageList(date)
      }
    })
  })

}
