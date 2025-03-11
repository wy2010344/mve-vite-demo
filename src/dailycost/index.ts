import { fdom } from "mve-dom";

export default function () {
  fdom.div({
    className: 'absolute inset-1',
    children() {



      //home页面
      fdom.div({
        className: 'bg-primary absolute inset-0',
        children() {
          fdom.div({
            className: 'w-full h-11',
            children() {
              fdom.h1({
                className: 'text-2xl text-primary-content font-bold',
                childrenType: 'text',
                children: '03-07'
              })

              fdom.div({
                className: 'text-primary-content',
                children() {
                  fdom.span({
                    className: 'mr-[0.125em]',
                    childrenType: 'text',
                    children: '¥'
                  })
                  fdom.span({
                    childrenType: 'text',
                    children: '23'
                  })
                  fdom.span({
                    className: 'relative -top-[0.25em] text-[0.75em] opacity-50',
                    childrenType: 'text',
                    children: '00'
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