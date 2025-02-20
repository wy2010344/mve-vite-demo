import { fdom } from "mve-dom";

export default function () {
  fdom.div({
    className: '@container border p-4',
    children() {
      fdom.div({
        className: 'grid grid-cols-1 @sm:grid-cols-4',
        children() {
          fdom.div({
            className: 'bg-blue-500 h-40'
          })
          fdom.div({
            className: 'bg-green-500 h-40'
          })
          fdom.div({
            className: 'bg-red-500 h-40'
          })
          fdom.div({
            className: 'bg-yellow-500 h-40'
          })
        }
      })
    }
  })
}