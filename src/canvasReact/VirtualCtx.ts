






export class VirtualCtx {
	fillStyle(style: string) {
		this.addOp(new FillStyleOp(style))
	}
	strokeStyle(style: string) {
		this.addOp(new StrokeStyleOp(style))
	}
	lineWidth(width: number) {
		this.addOp(new LineWidthOp(width))
	}
	drawImage(image: CanvasImageSource, x: number, y: number, width: number, height: number) {
		this.addOp(new ImageOp(image, x, y, width, height))
	}
	fillRect(x: number, y: number, width: number, height: number) {
		this.addOp(new FillRectOp(x, y, width, height))
	}

	strokeRect(x: number, y: number, width: number, height: number) {
		this.addOp(new StrokeRectOp(x, y, width, height))
	}
	moveTo(x: number, y: number) {
		this.addOp(new MoveToOp(x, y))
	}

	lineTo(x: number, y: number) {
		this.addOp(new LineToOp(x, y))
	}

	beginPath() {
		this.addOp(BeginPathOp.beginPath)
	}

	arc(x: number, y: number, radius: number, startAngle: number, endAngle: number, counterclockwise = false) {
		this.addOp(new ArcOp(x, y, radius, startAngle, endAngle, counterclockwise))
	}

	stroke() {
		this.addOp(StrokeOp.stroke)
	}

	font(f: string) {
		this.addOp(new FontOp(f))
	}

	fillText(text: string, x: number, y: number, maxWidth?: number) {
		this.addOp(new FillTextOp(text, x, y, maxWidth))
	}

	strokeText(text: string, x: number, y: number, maxWidth?: number) {
		this.addOp(new StrokeTextOp(text, x, y, maxWidth))
	}

	private addOp(op: Op) {
		this.ops.push(op)
	}
	private ops: Op[] = []

	equals(before?: VirtualCtx) {
		const length = this.ops.length
		if (length == before.ops.length) {
			for (let i = 0; i < length; i++) {
				if (!this.ops[i].equals(before.ops[i])) {
					return false
				}
			}
			return true
		}
		return false
	}


	redraw(w: number, h: number) {
		const canvas = document.createElement("canvas")
		canvas.width = w
		canvas.height = h
		const ctx = canvas.getContext("2d")
		for (const op of this.ops) {
			op.draw(ctx)
		}
		return canvas
	}
}

interface Op {
	equals(v: Op): boolean
	draw(v: CanvasRenderingContext2D): void
}

class FillStyleOp implements Op {
	constructor(public readonly style: string) { }
	equals(v: Op) {
		return v instanceof FillStyleOp && v.style == this.style
	}
	draw(v: CanvasRenderingContext2D) {
		v.fillStyle = this.style
	}
}

class StrokeStyleOp implements Op {
	constructor(public readonly style: string) { }
	equals(v: Op) {
		return v instanceof StrokeStyleOp && v.style == this.style
	}
	draw(v: CanvasRenderingContext2D) {
		v.strokeStyle = this.style
	}
}
class LineWidthOp implements Op {
	constructor(public readonly width: number) { }
	equals(v: Op) {
		return v instanceof LineWidthOp && v.width == this.width
	}
	draw(v: CanvasRenderingContext2D) {
		v.lineWidth = this.width
	}
}
class ImageOp implements Op {
	constructor(
		public readonly image: CanvasImageSource,
		public readonly x: number,
		public readonly y: number,
		public readonly width: number,
		public readonly height: number
	) { }
	equals(v: Op) {
		return v instanceof ImageOp && v.image == this.image && v.x == this.x && v.y == this.y && v.width == this.width && v.height == this.height
	}
	draw(v: CanvasRenderingContext2D) {
		v.drawImage(this.image, this.x, this.y, this.width, this.height)
	}
}

class FillRectOp implements Op {
	constructor(
		public readonly x: number,
		public readonly y: number,
		public readonly width: number,
		public readonly height: number
	) { }
	equals(v: Op): boolean {
		return v instanceof FillRectOp && v.x == this.x && v.y == this.y && v.width == this.width && v.height == this.height
	}
	draw(v: CanvasRenderingContext2D): void {
		v.fillRect(this.x, this.y, this.width, this.height)
	}
}

class StrokeRectOp implements Op {
	constructor(
		public readonly x: number,
		public readonly y: number,
		public readonly width: number,
		public readonly height: number
	) { }
	equals(v: Op): boolean {
		return v instanceof StrokeRectOp && v.x == this.x && v.y == this.y && v.width == this.width && v.height == this.height
	}
	draw(v: CanvasRenderingContext2D): void {
		v.strokeRect(this.x, this.y, this.width, this.height)
	}
}

class MoveToOp implements Op {
	constructor(
		public readonly x: number,
		public readonly y: number
	) { }
	equals(v: Op): boolean {
		return v instanceof MoveToOp && v.x == this.x && v.y == this.y
	}
	draw(v: CanvasRenderingContext2D): void {
		v.moveTo(this.x, this.y)
	}
}

class LineToOp implements Op {
	constructor(
		public readonly x: number,
		public readonly y: number
	) { }
	equals(v: Op): boolean {
		return v instanceof LineToOp && v.x == this.x && v.y == this.y
	}
	draw(v: CanvasRenderingContext2D): void {
		v.lineTo(this.x, this.y)
	}

}

class BeginPathOp implements Op {
	private constructor() { }
	static readonly beginPath = new BeginPathOp()
	equals(v: Op): boolean {
		return v == BeginPathOp.beginPath
	}
	draw(v: CanvasRenderingContext2D): void {
		v.beginPath()
	}
}

class StrokeOp implements Op {
	private constructor() { }
	static readonly stroke = new StrokeOp()
	equals(v: Op): boolean {
		return v == StrokeOp.stroke
	}
	draw(v: CanvasRenderingContext2D): void {
		v.stroke()
	}
}

class ArcOp implements Op {
	constructor(
		public readonly x: number,
		public readonly y: number,
		public readonly radius: number,
		public readonly startAngle: number,
		public readonly endAngle: number,
		public readonly counterclockwise = false
	) { }
	equals(v: Op): boolean {
		return v instanceof ArcOp && v.x == this.x && v.y == this.y && v.startAngle == this.startAngle && v.endAngle == this.endAngle && v.counterclockwise == this.counterclockwise
	}
	draw(v: CanvasRenderingContext2D): void {
		v.arc(this.x, this.y, this.radius, this.startAngle, this.endAngle, this.counterclockwise)
	}
}

class FontOp implements Op {
	constructor(
		public readonly font: string
	) { }
	equals(v: Op): boolean {
		return v instanceof FontOp && v.font == this.font
	}
	draw(v: CanvasRenderingContext2D): void {
		v.font = this.font
	}
}

class FillTextOp implements Op {
	constructor(
		public readonly text: string,
		public readonly x: number,
		public readonly y: number,
		public readonly maxWidth?: number
	) { }
	equals(v: Op): boolean {
		return v instanceof FillTextOp && v.text == this.text && v.x == this.x && v.y == this.y && v.maxWidth == this.maxWidth
	}
	draw(v: CanvasRenderingContext2D): void {
		v.fillText(this.text, this.x, this.y, this.maxWidth)
	}
}

class StrokeTextOp implements Op {
	constructor(
		public readonly text: string,
		public readonly x: number,
		public readonly y: number,
		public readonly maxWidth?: number
	) { }
	equals(v: Op): boolean {
		return v instanceof StrokeTextOp && v.text == this.text && v.x == this.x && v.y == this.y && v.maxWidth == this.maxWidth
	}
	draw(v: CanvasRenderingContext2D): void {
		v.strokeText(this.text, this.x, this.y, this.maxWidth)
	}
}