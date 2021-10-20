import { dom } from "mve-dom";
import { mve } from 'mve-core/util'
import { CanvasGUI, CanvasInputEvent, copyRect, emptyRect, equalRect, InputValue, Point, Rect } from "./gui";
import { testRoot } from "./test";
import { run } from "./xvc/util";


export function canvasReact(me: mve.LifeModel) {

	const inputEvent = mve.valueOf<Point | undefined>(undefined)
	let globalInput: (e: InputValue) => void
	return dom({
		type: "div",
		style: {
			display: "flex",
			position: "fixed",
			width: '100%',
			height: '100%',
			'justify-content': 'center',
			'align-items': 'center',
			background: '#00ffff2e'
		},
		children: [
			dom({
				type: "div",
				style: {
					position: "relative"
				},
				children: [
					dom({
						type: "canvas",
						init(rootCanvas: HTMLCanvasElement) {
							const rootCtx = rootCanvas.getContext("2d")
							const lastRect = emptyRect()
							let lastCanvas: HTMLCanvasElement
							const fun = CanvasGUI({
								draw(rect) {
									const nRect = rect.rect
									if (rect.cache != lastCanvas || !equalRect(lastRect, nRect)) {
										rootCtx.clearRect(0, 0, rootCanvas.width, rootCanvas.height)
										lastCanvas = rect.cache
										copyRect(lastRect, nRect)
										rootCtx.drawImage(rect.cache, nRect.x, nRect.y, nRect.width, nRect.height)
									}
								},
								setInput(e) {
									inputEvent(e)
								}
							})
							const o = fun(testRoot)
							globalInput = o.input
							rootCanvas.addEventListener("mousedown", function (e) {
								o.mousedown({
									x: e.offsetX,
									y: e.offsetY
								})
							})
							rootCanvas.addEventListener("mouseup", function (e) {
								o.mouseup({
									x: e.offsetX,
									y: e.offsetY
								})
							})
							rootCanvas.addEventListener("mousemove", function (e) {
								o.mousemove({
									x: e.offsetX,
									y: e.offsetY
								})
							})
							rootCanvas.addEventListener("wheel", function (e) {
								o.wheel({
									x: e.offsetX,
									y: e.offsetY,
									deltaY: e.deltaY
								})
								e.preventDefault()
								e.stopPropagation()
							})
							o.resize({
								width: rootCanvas.width,
								height: rootCanvas.height
							})
						},
						style: {
							background: 'white'
						},
						attr: {
							width: "800",
							height: "600"
						}
					}),
					run(function () {
						let inputStatus: 'CHINESE_TYPING' | 'CHAR_TYPING' = 'CHAR_TYPING'
						return dom({
							type: "input",
							style: {
								position: "absolute",
								display() {
									return inputEvent() ? '' : 'none'
								},
								left() {
									return (inputEvent()?.x || 0) + "px"
								},
								top() {
									return (inputEvent()?.y || 0) + "px"
								},
								width: "0px",
								height: "0px"
							},
							event: {
								compositionstart() {
									inputStatus = "CHINESE_TYPING"
								},
								compositionend(e: CompositionEvent) {
									if (inputStatus == "CHINESE_TYPING") {
										if (globalInput) {
											globalInput({
												value: e.data
											})
											e.stopPropagation()
											e.preventDefault()
											inputStatus = "CHAR_TYPING"
										}
									}
								},
								input(e: InputEvent) {
									if (inputStatus == "CHAR_TYPING") {
										if (globalInput) {
											globalInput({
												value: e.data
											})
											e.stopPropagation()
											e.preventDefault()
										}
									}
								}
							}
						})
					}),

				]
			})
		]
	})
}