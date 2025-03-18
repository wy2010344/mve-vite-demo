import { createContext } from "mve-core";
import { SignalAnimateFrameValue, YearMonthDayVirtualView } from "wy-helper";

export const topContext = createContext<{
  today(): YearMonthDayVirtualView
  yearMonthScrollY: SignalAnimateFrameValue,
  scrollYearMonthOpenHeight(): number
  calendarScrollY: SignalAnimateFrameValue
  showCalendar(): boolean
  calendarOpenHeight(): number
  calendarScroll(delta: number, velocity: number): void
  calendarFinish(velocity: number): void
  calendarClose(): void
}>(undefined as any)