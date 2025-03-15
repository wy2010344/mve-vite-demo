import { createContext } from "mve-core";
import { SignalAnimateFrameValue } from "wy-helper";

export const topContext = createContext<{
  calendarScrollY: SignalAnimateFrameValue
}>(undefined as any)