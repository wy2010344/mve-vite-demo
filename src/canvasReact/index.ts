import { dom } from "mve-dom";
import { mve } from 'mve-core/util'
import { CanvasGUI, copyRect, emptyRect, equalRect, Rect } from "./gui";
import { testRoot } from "./test";


export function canvasReact(me: mve.LifeModel) {

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
				type: "canvas",
				init(rootCanvas: HTMLCanvasElement) {
					const rootCtx = rootCanvas.getContext("2d")
					const lastRect = emptyRect()
					let lastCanvas: HTMLCanvasElement
					const fun = CanvasGUI(function (rect) {
						const nRect = rect.rect
						if (rect.cache != lastCanvas || !equalRect(lastRect, nRect)) {
							rootCtx.clearRect(0, 0, rootCanvas.width, rootCanvas.height)
							lastCanvas = rect.cache
							copyRect(lastRect, nRect)
							rootCtx.drawImage(rect.cache, nRect.x, nRect.y, nRect.width, nRect.height)
						}
					})
					const o = fun(testRoot)
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
			})
		]
	})
}