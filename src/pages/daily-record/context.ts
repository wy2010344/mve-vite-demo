import { createContext } from "mve-core";
import { OnScroll } from "mve-dom-helper";
import { AnimateSignal, YearMonthDayVirtualView } from "wy-helper";

export const topContext = createContext<{
  today(): YearMonthDayVirtualView
  yearMonthScrollY: OnScroll,
  scrollYearMonthOpenHeight(): number
  calendarScrollY: OnScroll
  showYearMonth(): boolean
  showCalendar(): boolean
  calendarOpenHeight(): number
  // calendarScroll(delta: number, velocity: number): void
  // calendarFinish(velocity: number): void
  calendarClose(): void
}>(undefined as any)