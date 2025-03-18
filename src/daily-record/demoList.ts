import { faker } from "@faker-js/faker"
import { fdom, fsvg } from "mve-dom"

export default function (time: number) {
  fdom.ul({
    className: 'daisy-list bg-base-100 rounded-box shadow-md',
    children() {
      // fdom.li({
      //   className: 'p-4 pb-2 text-xs opacity-60 tracking-wide',
      //   childrenType: 'text',
      //   children: `Most played songs this week`,
      // })
      for (let i = 0; i < time; i++) {

        fdom.li({
          className: 'daisy-list-row',
          children() {
            fdom.div({
              className: 'text-4xl font-thin opacity-30 tabular-nums',
              childrenType: 'text',
              children: `0${i + 1}`,
            })
            fdom.div({
              children() {
                fdom.img({
                  className: 'size-10 rounded-box',
                  src: faker.image.avatar(),
                })
              }
            })
            fdom.div({
              className: 'daisy-list-col-grow',
              children() {
                fdom.div({
                  childrenType: 'text',
                  children: faker.music.artist(),
                })
                fdom.div({
                  className: 'text-xs uppercase font-semibold opacity-60',
                  childrenType: 'text',
                  children: faker.music.songName(),
                })
              }
            })
            fdom.button({
              className: 'daisy-btn daisy-btn-square daisy-btn-ghost',
              children() {
                fsvg.svg({
                  className: 'size-[1.2em]',
                  xmlns: 'http://www.w3.org/2000/svg',
                  viewBox: '0 0 24 24',
                  children() {
                    fsvg.g({
                      strokeLinejoin: 'round',
                      strokeLinecap: 'round',
                      strokeWidth: 2,
                      fill: 'none',
                      stroke: 'currentColor',
                      children() {
                        fsvg.path({
                          d: 'M6 3L20 12 6 21 6 3z',
                        })
                      }
                    })
                  }
                })
              }
            })
          }
        })
      }
    }
  })
}