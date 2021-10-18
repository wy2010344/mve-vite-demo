import { hexFromBgColor } from "../color";
import { GlobalParam, BranchNodeParam, leafNode, RectNode, breachNode, Rect, BaseLeafNodeParam, BaseBranchNodeParam, LeafNodeParam } from "./gui";
import { EOChild } from "./xvc/childrenBuilder";
import { modelChildren } from "./xvc/modelChildren";
import { ArrayModel } from "./xvc/util";


function random255() {
	return Math.round(Math.random() * 255)
}
function randomColor() {
	return hexFromBgColor({
		red: random255(),
		green: random255(),
		blue: random255(),
		alpha: random255(),
	})
}
const loc = {
	x: 0, y: 0, width: 200, height: 200
}

export function testRoot(g: GlobalParam): BranchNodeParam {

	const models = ArrayModel.of<string>()

	let offsetTop = 0
	return {
		config() {
			return {
				x: 0,
				y: 0,
				width: g.width,
				height: g.height
			}
		},
		children: [
			leafNode({
				config(ctx) {
					ctx.fillRect(20, 20, 100, 20)
					return loc
				},
				mouseDown() {
					models.push(randomColor())
				}
			}),
			modelChildren(models, function (row, i) {
				return leafNode({
					config(ctx) {
						ctx.fillStyle(row)
						ctx.fillRect(0, 0, 20, 15)
						return {
							x: 10, y: i() * 20 + offsetTop,
							width: 30, height: 15
						}
					}
				})
			}),
			leafNode({
				config(ctx) {
					ctx.strokeStyle("blue")
					ctx.lineWidth(20)
					ctx.strokeRect(0, 0, g.width, g.height)
					return {
						x: 0,
						y: 0,
						width: g.width,
						height: g.height
					}
				},
				wheel(e) {
					offsetTop += e.deltaY
				}
			}),
		]
	}
}