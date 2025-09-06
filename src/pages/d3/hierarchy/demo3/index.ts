import { fsvg } from 'mve-dom'
import data from './data.json'
import * as d3 from 'd3'
/**
 * https://observablehq.com/@d3/radial-tree/2
 */
export default function () {
  // Specify the chart’s dimensions.
  const width = 928
  const height = width
  const cx = width * 0.5 // adjust as needed to fit
  const cy = height * 0.59 // adjust as needed to fit
  const radius = Math.min(width, height) / 2 - 30

  // Create a radial tree layout. The layout’s first dimension (x)
  // is the angle, while the second (y) is the radius.
  const tree = d3
    .tree()
    .size([2 * Math.PI, radius])
    .separation((a, b) => (a.parent == b.parent ? 1 : 2) / a.depth)

  // Sort the tree and apply the layout.
  const root = tree(
    d3.hierarchy(data).sort((a, b) => d3.ascending(a.data.name, b.data.name))
  )

  fsvg.svg({
    width,
    height,
    viewBox: [-cx, -cy, width, height].join(' '),
    s_width: '100%',
    s_height: 'auto',
    s_font: '10px sans-serif',
    children() {
      fsvg.g({
        fill: 'none',
        stroke: '#555',
        strokeOpacity: 0.4,
        strokeWidth: 1.5,
        children() {
          root.links().forEach((d) => {
            fsvg.path({
              d: d3
                .linkRadial()
                .angle((d) => d.x)
                .radius((d) => d.y)(d),
            })
          })
        },
      })
      fsvg.g({
        children() {
          root.descendants().forEach(function (d) {
            fsvg.circle({
              r: 2.5,
              fill: d.children ? '#555' : '#999',
              transform: `rotate(${(d.x * 180) / Math.PI - 90}) translate(${
                d.y
              },0)`,
            })
          })
        },
      })
      fsvg.g({
        strokeLinejoin: 'round',
        strokeWidth: 3,
        children() {
          root.descendants().forEach(function (d) {
            fsvg.text({
              transform: `rotate(${(d.x * 180) / Math.PI - 90}) translate(${
                d.y
              },0) rotate(${d.x >= Math.PI ? 180 : 0})`,
              dy: '0.31em',
              x: d.x < Math.PI === !d.children ? 6 : -6,
              textAnchor: d.x < Math.PI === !d.children ? 'start' : 'end',
              paintOrder: 'stroke',
              stroke: 'white',
              fill: 'currentColor',
              children: d.data.name,
            })
          })
        },
      })
    },
  })
}
