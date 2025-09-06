import { fdom, fsvg } from 'mve-dom'
import csv from './data.csv?raw'
import * as d3 from 'd3'
import { createSignal, emptyArray, memo } from 'wy-helper'
import { renderArray, renderArrayKey } from 'mve-helper'
/**
 * https://observablehq.com/@kerryrodden/sequences-sunburst
 * @param csv
 * @returns
 */
function buildHierarchy(csv: any[][]) {
  // Helper function that transforms the given CSV into a hierarchical format.
  const root = { name: 'root', children: [] }
  for (let i = 0; i < csv.length; i++) {
    const sequence = csv[i][0]
    const size = +csv[i][1]
    if (isNaN(size)) {
      // e.g. if this is a header row
      continue
    }
    const parts = sequence.split('-')
    let currentNode = root
    for (let j = 0; j < parts.length; j++) {
      const children: any[] = currentNode['children']
      const nodeName = parts[j]
      let childNode = null
      if (j + 1 < parts.length) {
        // Not yet at the end of the sequence; move down the tree.
        let foundChild = false
        for (let k = 0; k < children.length; k++) {
          if (children[k]['name'] == nodeName) {
            childNode = children[k]
            foundChild = true
            break
          }
        }
        // If we don't already have a child node for this branch, create it.
        if (!foundChild) {
          childNode = { name: nodeName, children: [] }
          children.push(childNode)
        }
        currentNode = childNode
      } else {
        // Reached the end of the sequence; create a leaf node.
        childNode = { name: nodeName, value: size }
        children.push(childNode)
      }
    }
  }
  return root
}

type TreeNode =
  | {
      name: string
      children: TreeNode[]
    }
  | {
      name: string
      value: number
    }
const data = buildHierarchy(d3.csvParseRows(csv)) as TreeNode
console.log(data)
export default function () {
  const width = 640
  const radius = width / 2
  const root = d3.partition().size([2 * Math.PI, radius * radius])(
    d3
      .hierarchy(data)
      .sum((d) => d.value)
      .sort((a, b) => b.value - a.value)
  )
  console.log(root)
  const color = d3
    .scaleOrdinal()
    .domain(['home', 'product', 'search', 'account', 'other', 'end'])
    .range(['#5d85cf', '#7c6561', '#da7847', '#6fb971', '#9e70cf', '#bbbbbb'])
  const arc = d3
    .arc()
    .startAngle((d) => d.x0)
    .endAngle((d) => d.x1)
    .padAngle(1 / radius)
    .padRadius(radius)
    .innerRadius((d) => Math.sqrt(d.y0))
    .outerRadius((d) => Math.sqrt(d.y1) - 1)

  const mousearc = d3
    .arc()
    .startAngle((d) => d.x0)
    .endAngle((d) => d.x1)
    .innerRadius((d) => Math.sqrt(d.y0))
    .outerRadius(radius)

  const current = createSignal<
    d3.HierarchyRectangularNode<unknown> | undefined
  >(undefined)
  const sequence = memo(() => {
    const c = current.get()
    if (c) {
      return c.ancestors().reverse().slice(1)
    }
    return emptyArray
  })
  const percentage = memo(() => {
    const d = current.get()
    if (d) {
      return ((100 * d.value) / root.value).toPrecision(3) + '%'
    }
    return ''
  })

  const breadcrumbWidth = 75
  const breadcrumbHeight = 30
  fsvg.svg({
    viewBox: [0, 0, breadcrumbWidth * 10, breadcrumbHeight].join(' '),
    s_font: '12px sans-serif',
    s_margin: '5px',
    children() {
      function breadcrumbPoints(d, i) {
        const tipWidth = 10
        const points = []
        points.push('0,0')
        points.push(`${breadcrumbWidth},0`)
        points.push(`${breadcrumbWidth + tipWidth},${breadcrumbHeight / 2}`)
        points.push(`${breadcrumbWidth},${breadcrumbHeight}`)
        points.push(`0,${breadcrumbHeight}`)
        if (i > 0) {
          // Leftmost breadcrumb; don't include 6th vertex.
          points.push(`${tipWidth},${breadcrumbHeight / 2}`)
        }
        return points.join(' ')
      }

      renderArray(sequence, function (d, i) {
        fsvg.g({
          transform() {
            return `translate(${i() * breadcrumbWidth}, 0)`
          },
          children() {
            fsvg.polygon({
              points: breadcrumbPoints(d, i),
              fill: color(d.data.name),
              stroke: 'white',
            })
            fsvg.text({
              x: (breadcrumbWidth + 10) / 2,
              y: 15,
              dy: '0.35em',
              textAnchor: 'middle',
              fill: 'white',
              children: d.data.name,
            })
          },
        })
        fsvg.text({
          x() {
            return (sequence().length + 0.5) * breadcrumbWidth
          },
          y: breadcrumbHeight / 2,
          dy: '0.35em',
          textAnchor: 'middle',
          childrenType: 'text',
          children: percentage,
        })
      })
    },
  })
  fsvg.svg({
    viewBox: [-radius, -radius, width, width].join(' '),
    s_maxWidth: `${width}px`,
    s_font: '12px sans-serif',
    children() {
      fsvg.g({
        textAnchor: 'middle',
        fill: '#888',
        visibility() {
          return current.get() ? '' : 'hidden'
        },
      })

      fsvg.text({
        textAnchor: 'middle',
        fill: '#888',
        visibility() {
          return current.get() ? '' : 'hidden'
        },
        children() {
          fsvg.tspan({
            className: 'percentage',
            x: 0,
            y: 0,
            dy: '-0.1em',
            fontSize: '3em',
            childrenType: 'text',
            children: percentage,
          })
          fsvg.tspan({
            x: '0',
            y: '0',
            dy: '1.5em',
            children: 'of visits begin with this sequence',
          })
        },
      })

      fsvg.g({
        children() {
          root.descendants().forEach((d) => {
            //// 不绘制根节点，为了提高效率，过滤掉太小而看不见的节点
            if (d.depth && d.x1 - d.x0 > 0.001) {
              fsvg.path({
                fill: color(d.data.name),
                d: arc(d),
                fillOpacity() {
                  if (current.get()) {
                    if (sequence().includes(d)) {
                      return 1
                    }
                    return 0.3
                  }
                  return 1
                },
              })
            }
          })
        },
      })
      fsvg.g({
        fill: 'none',
        pointerEvents: 'all',
        onMouseLeave() {
          current.set(undefined)
        },
        children() {
          root.descendants().forEach((d) => {
            if (d.depth && d.x1 - d.x0 > 0.001) {
              fsvg.path({
                d: mousearc(d),
                onMouseEnter(e) {
                  current.set(d)
                },
              })
            }
          })
        },
      })
    },
  })
}
