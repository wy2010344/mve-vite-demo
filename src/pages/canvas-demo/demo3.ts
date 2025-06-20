import { memo, ValueOrGet, alignSelf } from "wy-helper"
import { hookDrawRect, simpleFlex, hookDrawText, hookDrawUrlImage, hookDrawTextWrap } from "mve-dom-helper/canvasRender";


export default function () {

  hookDrawRect({
    height: 500,
    width: 400,
    // paddingLeft: 10,
    // paddingRight: 20,
    // paddingBottom: 30,
    // paddingTop: 40,
    // width(n) {
    //   return n.getInfo('width') + 50
    // },
    // height(n) {
    //   return n.getInfo('height') + 50
    // },
    layout() {
      return simpleFlex({
        gap: 10,
        direction: 'x',
        reverse: true,
        alignItems: 'center',
        alignFix: true,
        directionFix: "around"
      })
    },
    draw(ctx, n) {
      const path = new Path2D()
      path.rect(0, 0, n.axis.x.size(), n.axis.y.size())
      return {
        path,
        operates: [
          {
            type: "fill",
            style: "yellow"
          }
        ]
      }
    },
    children() {
      hookDrawRect({
        height: 30,
        grow: 1,
        // width: 20,
        draw(ctx, n, path) {
          path.rect(0, 0, n.axis.x.size(), n.axis.y.size())
          return {
            path,
            operates: [
              {
                type: "fill",
                style: "red"
              }
            ]
          }
        },
      })
      hookDrawRect({
        // height: 30,
        width: 20,
        alignSelf: alignSelf('stretch'),
        draw(ctx, n, path) {
          path.rect(0, 0, n.axis.x.size(), n.axis.y.size())
          return {
            path,
            operates: [
              {
                type: "fill",
                style: "green"
              }
            ]
          }
        },
      })
      hookDrawTextWrap({
        width: 100,
        config: {
          text: "abwefw aef aew awe awe awe awefewf aefawe ",
          fontFamily: "serif",
          fontSize: '20px'
        },
        draw(ctx, n, draw) {
          return {
            operates: [
              {
                type: "stroke",
                width: 4,
                style: "green"
              },
              {
                type: "draw",
                callback: draw
              }
            ]
          }
        },
        drawInfo: {
          style: 'red'
        }
      })
      hookDrawUrlImage({
        width: 100,
        relay: "width",
        src: "https://picsum.photos/363/423",
        // ext: {
        //   notFlex: true
        // },
        notInLayout: true,
        draw(ctx, n, draw) {
          return {
            operates: [
              {
                type: "stroke",
                width: 6,
                style: "blue"
              },
              {
                type: "draw",
                callback: draw
              }
            ]
          }
        }
      })
    },
  })
}



