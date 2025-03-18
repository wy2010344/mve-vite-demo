import { fdom } from "mve-dom";
import { renderMobileView } from "../onlyMobile";
import { createSignal, simpleEqualsNotEqual, YearMonthDayVirtualView, batchSignalEnd, WeightMeasure, FrictionalFactory, DAYMILLSECONDS } from "wy-helper";
import fixRightTop from "../fixRightTop";
import themeDropdown from "../themeDropdown";
import firstDayOfWeek from "./firstDayOfWeek";
import renderHeader from "./renderHeader";
import renderPageList from "./renderPageList";
import { topContext } from "./context";
import { signalAnimateFrame } from "wy-dom-helper";
import renderScrollYear from "./renderYearMonthChoose";
import { getPageSnap } from "./movePage";
import { hookDestroy } from "mve-helper";

// const fc = new FrictionalFactory()
const bs = FrictionalFactory.get()
export default function () {

  renderMobileView(function (getFullWidth, mock) {
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
    const calendarScrollY = signalAnimateFrame(calendarOpenHeight())
    const yearMonthScrollY = signalAnimateFrame(scrollYearMonthOpenHeight())

    function showYearMonth() {
      return yearMonthScrollY.get() != scrollYearMonthOpenHeight()
    }
    topContext.provide({
      yearMonthScrollY,
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
      calendarScroll(delta, velocity) {
        if (showYearMonth()) {
          //操作年月
          const wValue = yearMonthScrollY.get() + delta
          if (wValue >= scrollYearMonthOpenHeight()) {
            //回到顶问她
            yearMonthScrollY.changeTo(scrollYearMonthOpenHeight())
            batchSignalEnd()
          } else if (wValue <= 0) {
            //有惯性
            yearMonthScrollY.changeTo(yearMonthScrollY.get() + delta / 3)
          } else {
            yearMonthScrollY.changeTo(wValue)
          }
        } else {
          const wValue = calendarScrollY.get() + delta
          if (wValue >= calendarOpenHeight()) {
            //回到顶部
            // showCalendar.set(false)
            calendarScrollY.changeTo(calendarOpenHeight())
            batchSignalEnd()
          } else if (wValue <= 0) {
            //向下拉,可能带动更上一层的滚动
            //自身清零
            calendarScrollY.changeTo(0)
            //将偏移量给上位
            yearMonthScrollY.changeDiff(wValue)
          } else {
            calendarScrollY.changeTo(wValue)
          }
        }
      },
      calendarFinish(velocity) {
        if (showYearMonth()) {
          const dis = bs.getFromVelocity(velocity)
          const targetDis = dis.distance + yearMonthScrollY.get()
          if (targetDis > scrollYearMonthOpenHeight() / 2) {
            yearMonthScrollY.changeTo(scrollYearMonthOpenHeight(),
              getPageSnap(velocity))
          } else {
            yearMonthScrollY.changeTo(0,
              getPageSnap(velocity))
          }
        } else {
          const dis = bs.getFromDistance(velocity)
          const targetDis = dis.distance + calendarScrollY.get()
          if (targetDis > calendarOpenHeight() / 2) {
            calendarScrollY.changeTo(calendarOpenHeight(),
              getPageSnap(velocity))
          } else {
            calendarScrollY.changeTo(0,
              getPageSnap(velocity),
            )
          }
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
