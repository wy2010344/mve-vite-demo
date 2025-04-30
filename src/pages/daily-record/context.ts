import { createContext } from "mve-core";
import { AnimateSignal, YearMonthDayVirtualView } from "wy-helper";

export const topContext = createContext<{
  today(): YearMonthDayVirtualView
  yearMonthScrollY: AnimateSignal,
  scrollYearMonthOpenHeight(): number
  calendarScrollY: AnimateSignal
  showCalendar(): boolean
  calendarOpenHeight(): number
  calendarScroll(delta: number, velocity: number): void
  calendarFinish(velocity: number): void
  calendarClose(): void
}>(undefined as any)