



/**
 * 普通操作在绘制后完成
 *
 * 带子层视图的（最简单的）受ArrayModel控制，动态增加，但内部仍然是事件后绘制
 * 不一定有子层视图
 * 也可能有多种子层视图
 *
 *
 * 仍然有父子问题，
 * 1.先通知层层向下计算必要的更新参数，如果更新了，绘制自视图，这是重绘。
 * 2.布局改变，需要对比先后的布局，这是回流。
 * 3.父子组件，图层合并，才算提供给上层的组件。合并有背景和多个子层，子层不能超过背景。
 * 4.是否复用旧视图？每次clearRect？不如新建一个，这样drawImage就是相同的了
 * 5.只设计一种，因为组件内部只会有一层同级，不会有多种，是树。其它的只是布局。
 * 
 * 下一步优化：鼠标移动事件，不一定有用户函数执行，需要判断出来，然后不触发重比较。覆盖
 * 
 * 
 * 或者作为容器与叶子视图区分
 * 容器只做枝节点，叶子只作子节点。
 * 容器只是将视图层叠起来。
 * 
 * 作为容器，只有尺寸可以统一重写，或外加一些包装。
 * 叶子节点是自定义了。
 * 尺寸自定义，只是为了将子层限制在内，其实也相当于是一种包装。
 * 
 * 相当于无论枝叶，部分位置参数作父作用域决定
 * 即容器其实为叶子提供了一个回调，这个回调里是继续作容器，还是作叶子，自己定义。
 * 
 * 但是这样层层向下定义容器，子容器是否还有toLeaf方法，
 * 因为子容器即要实现父容器的接口（被重写，无toLeaf），也要为自己的子容器提供重写方法，有toLeaf。
 * 
 * 
 * 
 * 关于输入法，键盘响应
 * 键盘是全局的，没有坐标。当某个状态时，获得全局的输入，并呈现在某个视图上。
 * 现在用一个输入框去拦截键盘，需要给输入框一个位置。需要使输入框focus，需要接受输入框的内容状态
 * 因为输入框的事件无法获得，所以只有每次取输入框的值状态。
 * 
 * 想要更换输入框，替换全局输入框内容并focus，并set输入的index，然后每次输入完成后要调整输入框的位置。
 * 
 * 每次输入完成，其实是一次事件，但这个事件应该只被局部捕获到。获得事件后，对模型一定操作，并更新输入框的位置。
 * 
 * 需要核心支持，即变成两部分，展示的部分与输入的部分。把展示的部分丢给全局即focus，
 * 
 * 还是要把实例暴露出来，触发focus。如果用状态返回focus，可能被后继冲掉。然后绑定相当的键盘事件。是一开始就计算返回实例，还是init事件返回？
 * 一开始计算返回。
 * 相当于外部控制内部状态。
 * 
 * 
 * 任何事物都可以成为状态，包括实例的计算结果。
 * 动作为实例提供状态。
 * 
 */

import { VirtualCtx } from "./VirtualCtx"
import { childrenBuilder, EOChild } from "./xvc/childrenBuilder"
import { BuildResult, EmptyFun, quote, RefreshFun, SimpleArray } from "./xvc/util"
import { VirtualChildParam } from "./xvc/virtualTreeChildren"

export interface Rect {
	x: number
	y: number
	width: number
	height: number
}
export function copyRect(a: Rect, b: Rect) {
	a.x = b.x
	a.y = b.y
	a.width = b.width
	a.height = b.height
}
export function equalRect(a: Rect, b: Rect) {
	return a.x == b.x && a.y == b.y && a.width == b.width && a.height == b.height
}
export function emptyRect(): Rect {
	return {
		x: 0,
		y: 0,
		width: 0,
		height: 0
	}
}
export interface ParentInfo extends Rect {
	absoluteX: number
	absoluteY: number
}

export type ReadParentInfo = Readonly<ParentInfo>
function emptyParentInfo(): ParentInfo {
	return {
		x: 0,
		y: 0,
		width: 0,
		height: 0,
		absoluteX: 0,
		absoluteY: 0
	}
}
/**
 * 点在矩形内部
 * @param row 
 * @param p 
 * @returns 
 */
function inRect(row: Rect, p: Point) {
	return p.x > 0 && p.y > 0 && p.x < row.width && p.y < row.height
}

export interface RectNode extends BuildResult<ReadParentInfo> {
	parent?: RectNode
	cache: HTMLCanvasElement
	/**相对位置*/
	readonly rect: ParentInfo
	/**鼠标下击*/
	mousedown(e: Point, meetUserCall: () => void): boolean | void
	/**鼠标举起事件 */
	mouseup(e: Point, meetUserCall: () => void): boolean | void
	/**鼠标滚动事件 */
	wheel(e: PointWheel, meetUserCall: () => void): boolean | void
	/**鼠标移动事件 */
	mousemove(e: Point, meetUserCall: () => void): boolean | void
}
function copyLocation(that: RectNode, newRect: Rect) {
	const rect = that.rect
	copyRect(rect, newRect)
	const parentRect = that.parent?.rect
	if (parentRect) {
		rect.absoluteX = parentRect.absoluteX + rect.x
		rect.absoluteY = parentRect.absoluteY + rect.y
	} else {
		rect.absoluteX = rect.x
		rect.absoluteX = rect.y
	}
}


export class ArrayChildParam<EO> implements VirtualChildParam<EO>{
	constructor(
		private array: SimpleArray<EO>,
		private afterInsert: (e: EO) => void,
		private afterRemove: (e: EO) => void
	) { }
	remove(e: EO): void {
		const idx = this.array.indexOf(e)
		if (idx > -1) {
			this.array.remove(idx)
			this.afterRemove(e)
		}
	}
	append(e: EO, isMove?: boolean): void {
		this.array.push(e)
		this.afterInsert(e)
	}
	insertBefore(e: EO, old: EO, isMove?: boolean): void {
		const idxOld = this.array.indexOf(old)
		if (idxOld > -1) {
			this.array.insert(idxOld, e)
			this.afterInsert(e)
		}
	}
}

export class ArrayChildReverseParam<EO> implements VirtualChildParam<EO>{
	constructor(
		private array: SimpleArray<EO>,
		private afterInsert: (e: EO) => void,
		private afterRemove: (e: EO) => void
	) { }
	remove(e: EO): void {
		const idx = this.array.indexOf(e)
		if (idx > -1) {
			this.array.remove(idx)
			this.afterRemove(e)
		}
	}
	append(e: EO, isMove?: boolean): void {
		this.array.insert(0, e)
		this.afterInsert(e)
	}
	insertBefore(e: EO, old: EO, isMove?: boolean): void {
		const idxOld = this.array.indexOf(old)
		if (idxOld > -1) {
			this.array.insert(idxOld + 1, e)
			this.afterInsert(e)
		}
	}
}
const shareCanvas = document.createElement("canvas")
const shareContext = new VirtualCtx()

export interface BaseLeafNodeParam {
	destroy?(): void
	mouseDown?(e: Point): boolean | void
	mouseUp?(e: Point): boolean | void
	mouseMove?(e: Point): boolean | void
	wheel?(e: PointWheel): boolean | void
}

/**
 * 叶子节点
 */
export interface LeafNodeParam extends BaseLeafNodeParam {
	config(ctx: VirtualCtx, parent: ReadParentInfo): Rect
}
export function leafNode(p: LeafNodeParam): EOChild<ParentInfo, RectNode> {
	return function (parent) {
		const it = new BaseLeafNode(p)
		parent.push(it)
		return it
	}
}
/**
 * 最终三个泛型类型都是叶子节点
 */
export interface BaseBranchNodeParam {
	mouseDownBefore?(e: Point): boolean | void
	mouseDownAfter?(e: Point): boolean | void
	mouseUpBefore?(e: Point): boolean | void
	mouseUpAfter?(e: Point): boolean | void
	mouseMoveBefore?(e: Point): boolean | void
	mouseMoveAfter?(e: Point): boolean | void
	wheelBefore?(e: PointWheel): boolean | void
	wheelAfter?(e: PointWheel): boolean | void
	children?: EOChild<ParentInfo, RectNode>[]
	childrenReverse?: boolean
}
export interface BranchNodeParam extends BaseBranchNodeParam {
	config(parent: ReadParentInfo): Rect
	destroy?(): void
}
class BaseBranchNode implements RectNode, BuildResult<ParentInfo> {
	cache = shareCanvas
	rect: ParentInfo
	location: Point
	destroy: () => void
	refresh: (v: ReadParentInfo) => void
	mousedown(e: Point, meetUserCall: () => void): boolean | void {
		let stop: boolean | void = false
		if (this.p.mouseDownBefore) {
			meetUserCall()
			stop = this.p.mouseDownBefore(e)
		}
		if (!stop) {
			const size = this.array.size()
			for (let i = 0; i < size && !stop; i++) {
				const row = this.array.get(i)
				const rect = row.rect
				const point = parentPointIn(rect, e)
				if (inRect(rect, point)) {
					stop = row.mousedown(point, meetUserCall)
				}
			}
			if (!stop) {
				if (this.p.mouseDownAfter) {
					meetUserCall()
					stop = this.p.mouseDownAfter(e)
				}
			}
		}
		return stop
	}
	mouseup(e: Point, meetUserCall: () => void): boolean | void {
		let stop: boolean | void = false
		if (this.p.mouseUpBefore) {
			meetUserCall()
			stop = this.p.mouseUpBefore(e)
		}
		if (!stop) {
			const size = this.array.size()
			for (let i = 0; i < size && !stop; i++) {
				const row = this.array.get(i)
				const rect = row.rect
				const point = parentPointIn(rect, e)
				if (inRect(rect, point)) {
					stop = row.mouseup(point, meetUserCall)
				}
			}
			if (!stop) {
				if (this.p.mouseUpAfter) {
					meetUserCall()
					stop = this.p.mouseUpAfter?.(e)
				}
			}
		}
		return stop
	}
	wheel(e: PointWheel, meetUserCall: () => void): boolean | void {
		let stop: boolean | void = false
		if (this.p.wheelBefore) {
			meetUserCall()
			stop = this.p.wheelBefore(e)
		}
		if (!stop) {
			const size = this.array.size()
			for (let i = 0; i < size && !stop; i++) {
				const row = this.array.get(i)
				const rect = row.rect
				const point = parentPointIn(rect, e)
				if (inRect(rect, point)) {
					const p1 = point as PointWheel
					p1.deltaY = e.deltaY
					stop = row.wheel(p1, meetUserCall)
				}
			}
			if (!stop) {
				if (this.p.wheelAfter) {
					meetUserCall()
					stop = this.p.wheelAfter(e)
				}
			}
		}
		return stop
	}
	mousemove(e: Point, meetUserCall: () => void): boolean | void {
		let stop: boolean | void = false
		if (this.p.mouseMoveBefore) {
			meetUserCall()
			stop = this.p.mouseMoveBefore(e)
		}
		if (!stop) {
			const size = this.array.size()
			for (let i = 0; i < size && !stop; i++) {
				const row = this.array.get(i)
				const rect = row.rect
				const point = parentPointIn(rect, e)
				if (inRect(rect, point)) {
					stop = row.mousemove(point, meetUserCall)
				}
			}
			if (!stop) {
				if (this.p.mouseMoveAfter) {
					meetUserCall()
					stop = this.p.mouseMoveAfter(e)
				}
			}
		}
		return stop
	}
	private array: SimpleArray<RectNode>
	parent?: RectNode
	constructor(
		private p: BranchNodeParam
	) {
		const array = SimpleArray.of<RectNode>()
		this.array = array
		const that = this
		function afterInsert(e: RectNode) {
			e.parent = that
		}
		function afterRemove(e: RectNode) {
			e.parent = that
		}
		const param = p.childrenReverse ? new ArrayChildReverseParam(array, afterInsert, afterRemove) : new ArrayChildParam(array, afterInsert, afterRemove)
		const out = childrenBuilder(param, p.children || [])
		let childrenRefresh: RefreshFun<ParentInfo> | undefined = undefined
		const destroys: EmptyFun[] = []
		if (p.destroy) {
			destroys.push(p.destroy)
		}
		if (out) {
			childrenRefresh = out.refresh
			if (out.destroy) {
				destroys.push(out.destroy)
			}
		}
		if (destroys.length > 1) {
			this.destroy = function () {
				for (const destroy of destroys) {
					destroy()
				}
			}
		} else if (destroys.length == 1) {
			this.destroy = destroys[0]
		}

		let oldFullSourceCtx = shareContext
		const rect = emptyParentInfo()
		this.rect = rect
		this.array = array
		const location = { x: 0, y: 0 }
		this.location = location
		this.refresh = function (parent) {
			//合成视图容器
			const fullSourceCtx = new VirtualCtx()
			const newRect = p.config(parent)
			const sizeChange = newRect.width != rect.width || newRect.height != rect.height
			copyLocation(that, newRect)
			//更新子层的视图
			if (childrenRefresh) {
				childrenRefresh(that.rect)
			}
			//回流汇总图片
			for (let i = 0; i < array.size(); i++) {
				const row = array.get(i)
				fullSourceCtx.drawImage(row.cache, row.rect.x, row.rect.y, row.rect.width, row.rect.height)
			}

			if (sizeChange || !fullSourceCtx.equals(oldFullSourceCtx)) {
				//如果可能，更新本层的图片
				that.cache = fullSourceCtx.redraw(newRect.width, newRect.height)
			}
			oldFullSourceCtx = fullSourceCtx
		}
	}
}

class BaseLeafNode implements RectNode, BuildResult<ParentInfo> {
	constructor(private p: LeafNodeParam) {
		this.destroy = p.destroy
		let oldBackgroundCtx = shareContext
		const rect = emptyParentInfo()
		this.rect = rect
		const that = this
		const location = { x: 0, y: 0 }
		this.location = location
		this.refresh = function (parent) {
			const backgroundCtx = new VirtualCtx()
			const newRect = p.config(backgroundCtx, parent)
			const sizeChange = newRect.width != rect.width || newRect.height != rect.height
			copyLocation(that, newRect)
			if (sizeChange || !backgroundCtx.equals(oldBackgroundCtx)) {
				//尺寸变化或背景内容变化，更新当前背景
				const canvas = backgroundCtx.redraw(newRect.width, newRect.height)
				that.cache = canvas
			}
		}
	}
	cache = shareCanvas
	parent?: RectNode
	rect: ParentInfo
	location: Point
	destroy: () => void
	refresh: (parent: ReadParentInfo) => void
	mousedown(e: Point, meetUserCall: () => void): boolean | void {
		if (this.p.mouseDown) {
			meetUserCall()
			return this.p.mouseDown(e)
		}
	}
	mouseup(e: Point, meetUserCall: () => void): boolean | void {
		if (this.p.mouseUp) {
			meetUserCall()
			return this.p.mouseUp(e)
		}
	}
	wheel(e: PointWheel, meetUserCall: () => void): boolean | void {
		if (this.p.wheel) {
			meetUserCall()
			return this.p.wheel(e)
		}
	}
	mousemove(e: Point, meetUserCall: () => void): boolean | void {
		if (this.p.mouseMove) {
			meetUserCall()
			return this.p.mouseMove(e)
		}
	}
}
/**
 * 枝节点
 * @param p
 */
export function breachNode(p: BranchNodeParam): EOChild<ParentInfo, RectNode> {
	return function (parent) {
		const it = new BaseBranchNode(p)
		parent.push(it)
		return it
	}
}

export interface Point {
	x: number
	y: number
}
export interface PointWheel extends Point {
	deltaY: number
}

export interface InputValue {
	value: string
}
export interface CanvasInputEvent {
	/**绝对位置 */
	location: Point,
	input(e: InputValue): void
}
export interface GlobalParam extends ParentInfo {
	/**设置输入事件 */
	setInput(e: CanvasInputEvent): void
	requestAnimationFrame(fun: () => void): number
}

export function CanvasGUI(config: {
	draw(rects: RectNode): void
	setInput(e: Point): void
}) {
	return function (fun: (g: GlobalParam) => BranchNodeParam) {
		const g: GlobalParam = {
			x: 0, y: 0,
			absoluteX: 0,
			absoluteY: 0,
			width: 0,
			height: 0,
			requestAnimationFrame(fun) {
				return requestAnimationFrame(function () {
					fun()
					render()
				})
			},
			setInput(e) {
				currentInput = e.input
				config.setInput(e.location)
			}
		}
		let currentInput: (e: InputValue) => void
		const o = new BaseBranchNode(fun(g))
		function render() {
			o.refresh(g)
			config.draw(o)
		}
		return {
			/**
			 * 输入文字
			 * @param e 
			 */
			input(e: InputValue) {
				if (currentInput) {
					currentInput(e)
					render()
				}
			},
			/**窗口变化事件，影响布局，重新计算布局 */
			resize(e: {
				width: number,
				height: number
			}) {
				if (g.width != e.width || g.height != e.height) {
					g.width = e.width
					g.height = e.height
					render()
				}
			},
			/**鼠标下击*/
			mousedown(e: Point) {
				let user = false
				o.mousedown(e, function () {
					user = true
				})
				if (user) {
					render()
				}
			},
			/**鼠标举起事件 */
			mouseup(e: Point) {
				let user = false
				o.mouseup(e, function () {
					user = true
				})
				if (user) {
					render()
				}
			},
			/**鼠标滚动事件 */
			wheel(e: PointWheel) {
				let user = false
				o.wheel(e, function () {
					user = true
				})
				if (user) {
					render()
				}
			},
			/**鼠标移动事件 */
			mousemove(e: Point) {
				let user = false
				o.mousemove(e, function () {
					user = true
				})
				if (user) {
					render()
				}
			}
		}
	}
}

function parentPointIn(rect: Rect, e: Point) {
	return {
		x: e.x - rect.x,
		y: e.y - rect.y
	}
}
