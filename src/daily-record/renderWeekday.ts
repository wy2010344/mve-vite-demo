import { fdom, mdom } from "mve-dom"
import { dateFromYearMonthDay, GetValue, getWeekOfYear, StoreRef, tw, WeekVirtualView, YearMonthDay, yearMonthDayEqual, YearMonthDayVirtualView } from "wy-helper"
import { firstDayOfWeekIndex, WEEKS } from "./firstDayOfWeek"
import { LunarDay, SolarDay } from "tyme4ts"
import { selectShadowCell } from "./renderCalendar"
import { renderIf } from "mve-helper"
import { cns } from "wy-dom-helper"


export function renderWeekHeader(renderCell: (i: number) => string) {
  fdom.div({
    className: 'flex bg-base-100 z-10 relative',
    children() {
      for (let i = 0; i < 7; i++) {
        fdom.div({
          className: 'flex-1 aspect-square flex items-center justify-center text-base-content',
          childrenType: "text",
          children() {
            return renderCell(i)
          }
        })
      }
    }
  })
}


export function renderFirstDayWeek(x: number, ym: YearMonthDay) {
  if (x == 0) {
    fdom.div({
      className: 'absolute left-0 text-label-small',
      childrenType: 'text',
      children() {
        return getWeekOfYear(dateFromYearMonthDay(ym), firstDayOfWeekIndex.get())
      }
    })
  }
}

export function renderCell({
  day,
  lunarDay,
  hide,
  selected,
  onClick
}: {
  day: number
  hide: GetValue<boolean>
  lunarDay: LunarDay,
  selected: GetValue<boolean>
  onClick(): void
}) {

  fdom.div({
    className() {
      return cns(
        `flex-1 aspect-square cursor-pointer
                        flex flex-col items-center justify-center gap-1 `,
        hide() && 'opacity-30'
      )
    },
    onClick,
    children() {
      fdom.div({
        className: 'flex items-center justify-center relative aspect-square p-1',
        children() {
          renderIf(selected, () => {
            fdom.div({
              id: selectShadowCell,
              className() {
                return cns(
                  `absolute inset-0 ring-1 rounded-full ring-accent`
                )
              }
            })
          })
          fdom.span({
            className: 'relative text-base-content/80  text-label-large',
            childrenType: 'text',
            children: day
          })
        }
      })
      fdom.div({
        className: 'text-label-small  text-base-content/60',
        childrenType: "text",
        children: lunarDay.getName()
      })
    }
  })


}




export default function (
  week: WeekVirtualView,
  getIndex: GetValue<number>,
  date: StoreRef<YearMonthDayVirtualView>
) {
  mdom.div({
    attrs(v) {
      const i = getIndex()
      if (i == 1) {

      } else {
        v.s_position = 'absolute'
        v.s_inset = 0
        v.s_transform = `translateX(${(i - 1) * 100}%)`
      }
    },
    children() {
      renderWeekHeader(function (i) {
        return WEEKS[week.weekDay(i)]
      })
      fdom.div({
        className: 'flex items-center justify-center relative',
        children() {
          for (let x = 0; x < 7; x++) {
            const md = week.cells[x]
            renderFirstDayWeek(x, md)

            const sd = SolarDay.fromYmd(md.year, md.month, md.day)
            const lunarDay = sd.getLunarDay()
            renderCell({
              hide() {
                return false;
              },
              day: md.day,
              lunarDay,
              selected() {
                return yearMonthDayEqual(md, date.get())
              },
              onClick() {
                date.set(md)
              },
            })
          }
        }
      })
    }
  })

}