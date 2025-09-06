import { fdom, fsvg, renderText } from 'mve-dom'
import { Newick, parseNewick } from '../parseNewick'
import life from './life.txt?raw'
import * as d3 from 'd3'
import { hookAnimateSignal, renderInputBool } from 'mve-dom-helper'
import { createSignal, emptyArray, memo } from 'wy-helper'
/**
 * 参考:https://observablehq.com/@d3/tree-of-life
 */
export default function () {
  const data = parseNewick(life)
  const width = 954
  const outerRadius = width / 2
  const innerRadius = outerRadius - 170

  // console.log('sd', d3.hierarchy)
  /**
   * 转换成一种Node节点,有
   * parent,
   * depth,叶子是深度,顶层是0
   * height,叶子是0,深度
   * value,子结点的和,叶子是1
   */
  const root = d3
    .hierarchy(data, (d) => d.branchset)
    .sum((d) => (d.branchset ? 0 : 1))
    .sort((a, b) => {
      return a.value - b.value || d3.ascending(a.data.length, b.data.length)
    })

  /**
D3 提供的 树形布局生成器。
和 d3.tree() 类似，但区别在于：
  tree 尽量让树的深度均匀分布在矩形区域。
  cluster 更像是“紧凑”的树，把兄弟节点紧贴排列，适合做 径向树 / 辐射树。
root 里的每个节点都被计算出 x 和 y 坐标：

node.x = 节点的角度（0–360）
node.y = 节点的半径（0–innerRadius）
*/
  d3
    .cluster()
    //设置布局范围（角度范围 0–360°，半径 0–innerRadius
    .size([360, innerRadius])
    // 定义兄弟节点之间的间隔。默认是 (a, b) => (a.parent == b.parent ? 1 : 2) / a.depth，兄弟更紧密、堂兄弟更疏远。
    .separation((a, b) => 1)(root)

  //计算最长路径长度
  //整体效果：找到 从当前节点到最深叶子 的总 branch length。
  function maxLength(d: d3.HierarchyNode<Newick>): number {
    return d.data.length + (d.children ? d3.max(d.children, maxLength) : 0)
  }

  //把 branch length 转换成半径
  /**
y0：当前路径累计的 branch length。
d.data.length：当前节点的 branch length。
k：缩放比例，把 branch length 映射到画布半径。
d.radius = (y0 += d.data.length) * k：
累加路径长度 y0，
然后乘以缩放因子 k，
得到当前节点在径向布局中的 极坐标半径。
   * @param d 
   * @param y0 
   * @param k 
   */
  function setRadius(d: d3.HierarchyNode<Newick>, y0: number, k: number) {
    d.radius = (y0 += d.data.length) * k
    if (d.children) d.children.forEach((d) => setRadius(d, y0, k))
  }

  setRadius(root, (root.data.length = 0), innerRadius / maxLength(root))

  const color = d3
    .scaleOrdinal()
    .domain(['Bacteria', 'Eukaryota', 'Archaea'])
    .range(d3.schemeCategory10)
  function setColor(d) {
    var name = d.data.name
    d.color =
      color.domain().indexOf(name) >= 0
        ? color(name)
        : d.parent
        ? d.parent.color
        : null
    if (d.children) d.children.forEach(setColor)
  }
  setColor(root)

  const check = createSignal(false)
  fdom.label({
    className: 'flex items-center gap-1',
    s_font: ' 12px sans-serif',
    children() {
      renderInputBool(
        check.get,
        check.set,
        fdom.input({
          type: 'checkbox',
        })
      )

      fdom.span({
        children: `Show branch length`,
      })
    },
  })
  const current = createSignal<d3.HierarchyNode<Newick> | undefined>(undefined)
  fsvg.svg({
    viewBox: [-outerRadius, -outerRadius, width, width].join(' '),
    fontFamily: 'sans-serif',
    fontSize: '10',
    children() {
      fsvg.g({
        children() {
          color.domain().forEach((d, i) => {
            fsvg.g({
              transform: `translate(${-outerRadius},${-outerRadius + i * 20})`,
              children() {
                fsvg.rect({
                  width: 18,
                  height: 18,
                  fill: color(d),
                })
                fsvg.text({
                  x: 24,
                  y: 9,
                  dy: '0.35em',
                  children: d,
                })
              },
            })
          })
        },
      })
      fdom.style({
        children: `
.link--active {
  stroke: #000 !important;
  stroke-width: 1.5px;
}

.link-extension--active {
  stroke-opacity: .6;
}

.label--active {
  font-weight: bold;
}

          `,
      })
      function linkStep(
        startAngle: number,
        startRadius: number,
        endAngle: number,
        endRadius: number
      ) {
        const c0 = Math.cos((startAngle = ((startAngle - 90) / 180) * Math.PI))
        const s0 = Math.sin(startAngle)
        const c1 = Math.cos((endAngle = ((endAngle - 90) / 180) * Math.PI))
        const s1 = Math.sin(endAngle)
        let infix = ''
        if (startAngle != endAngle) {
          infix = `A${startRadius},${startRadius} 0 0 ${
            endAngle > startAngle ? 1 : 0
          } ${startRadius * c1},${startRadius * s1}`
        }
        return `M${startRadius * c0},${startRadius * s0} ${infix} L${
          endRadius * c1
        },${endRadius * s1}`
      }
      const parentList = memo<d3.HierarchyNode<Newick>[]>(() => {
        let c = current.get()
        if (c) {
          const list = []
          while (c) {
            list.push(c)
            c = c.parent
          }
          return list
        }
        return emptyArray
      })
      //最外边一圈的连接
      fsvg.g({
        fill: 'none',
        stroke: '#000',
        strokeOpacity: '0.25',
        children() {
          root
            .links()
            .filter((d) => !d.target.children)
            .forEach((d) => {
              const y = hookAnimateSignal(() =>
                check.get() ? d.target.radius : d.target.y
              )
              fsvg.path({
                className() {
                  return current.get() == d.target
                    ? 'link-extension--active'
                    : ''
                },
                d() {
                  return linkStep(d.target.x!, y(), d.target.x!, innerRadius)
                },
              })
            })
        },
      })
      //所有连接
      fsvg.g({
        fill: 'none',
        stroke: '#000',
        children() {
          root.links().forEach((d) => {
            const sy = hookAnimateSignal(() =>
              check.get() ? d.source.radius : d.source.y
            )
            const ty = hookAnimateSignal(() =>
              check.get() ? d.target.radius : d.target.y
            )
            fsvg.path({
              className() {
                return parentList().includes(d.target) ? 'link--active' : ''
              },
              d() {
                return linkStep(d.source.x!, sy(), d.target.x!, ty())
              },
              stroke: d.target.color,
            })
          })
        },
      })
      //最外层的文字树结构
      fsvg.g({
        children() {
          root.leaves().forEach((d) => {
            fsvg.text({
              className() {
                return current.get() == d ? 'label--active' : ''
              },
              dy: '0.31em',
              transform: `rotate(${d.x - 90}) translate(${innerRadius + 4},0)${
                d.x < 180 ? '' : ' rotate(180)'
              }`,
              textAnchor: d.x < 180 ? 'start' : 'end',
              children: d.data.name.replace(/_/g, ' '),
              onMouseOver() {
                current.set(d)
              },
              onMouseOut() {
                current.set(undefined)
              },
            })
          })
        },
      })
    },
  })
}
