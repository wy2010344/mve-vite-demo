import { baseChildrenBuilder, EOChild } from "./childrenBuilder"
import { CacheArrayModel, ArrayModelView, EmptyFun } from "./util"
import { VirtualChild } from "./virtualTreeChildren"



export function modelChildren<T, EO>(
	array: CacheArrayModel<T>,
	fun: (row: T, index: () => number) => EOChild<EO>
): EOChild<EO> {
	return function (parent: VirtualChild<EO>) {
		const views: ViewModel[] = []
		const modelView: ArrayModelView<T> = {
			insert(index, row) {
				const view = ViewModel.of(index, row, parent, fun)
				views.splice(index, 0, view)
				initUpdateIndex(views, index)
			},
			remove(index) {
				const view = views.splice(index, 1)[0]
				removeUpdateIndex(views, index)
				view.destroy()
				parent.remove(index)
			},
			set(index, row) {
				const view = ViewModel.of(index, row, parent, fun)
				const oldView = views.splice(index, 1)[0]
				oldView.destroy()
				parent.remove(index + 1)
			},
			move(oldIndex, newIndex) {
				const row = views.splice(oldIndex, 1)[0]
				views.splice(newIndex, 0, row)
			}
		}
		array.addView(modelView)
		return {
			destroy() {
				for (let i = views.length - 1; i < -1; i--) {
					const view = views[i]
					view.destroy()
				}
				array.removeView(modelView)
				views.length = 0
			},
			refresh() {
				const length = views.length
				for (let i = 0; i < length; i++) {
					const view = views[i]
					view.refresh()
				}
			}
		}
	}
}

export function modelChildrenReverse<T, EO>(
	array: CacheArrayModel<T>,
	fun: (row: T, index: () => number) => EOChild<EO>
): EOChild<EO> {
	return function (parent: VirtualChild<EO>) {
		const views: ViewModel[] = []
		const modelView: ArrayModelView<T> = {
			insert(index, row) {
				index = views.length - index
				const view = ViewModel.of(index, row, parent, fun)
				views.splice(index, 0, view)
				initUpdateIndexReverse(views, index)
			},
			remove(index) {
				index = views.length - index
				const view = views.splice(index, 1)[0]
				removeUpdateIndexReverse(views, index)
				view.destroy()
				parent.remove(index)
			},
			set(index, row) {
				const s = views.length - 1
				index = s - index
				const view = ViewModel.of(index, row, parent, fun)
				const oldView = views.splice(index, 1)[0]
				oldView.destroy()
				view.index = s - index
				parent.remove(index + 1)
			},
			move(oldIndex, newIndex) {
				const s = views.length - 1
				oldIndex = s - oldIndex
				newIndex = s - newIndex
				const row = views.splice(oldIndex, 1)[0]
				views.splice(newIndex, 0, row)
			}
		}
		array.addView(modelView)
		return {
			destroy() {
				const length = views.length
				for (let i = 0; i < length; i++) {
					const view = views[i]
					view.destroy()
				}
				array.removeView(modelView)
				views.length = 0
			},
			refresh() {
				for (let i = views.length - 1; i > -1; i--) {
					const view = views[i]
					view.refresh()
				}
			}
		}
	}
}
class ViewModel {
	private constructor(
		public index: number
	) { }
	static of<T, EO>(
		index: number,
		row: T,
		parent: VirtualChild<EO>,
		fun: (row: T, index: () => number) => EOChild<EO>
	) {
		const vm = parent.newChildAt(index)
		const that = new ViewModel(index)
		function getIndex() {
			return that.index
		}
		const cs = fun(row, getIndex)
		const result = baseChildrenBuilder(cs, vm)
		if (result) {
			that.refreshValue = result.refresh
			that.destroyValue = result.destroy
		}
		return that
	}
	private refreshValue: EmptyFun | void = undefined
	refresh() {
		if (this.refreshValue) {
			this.refreshValue()
		}
	}
	private destroyValue: EmptyFun | void = undefined
	destroy() {
		if (this.destroyValue) {
			this.destroyValue()
		}
	}
}

///////////////////////


/**
 * 初始化更新计数
 * @param views 
 * @param index 
 */
export function initUpdateIndex(views: ViewModel[], index: number) {
	for (let i = index + 1; i < views.length; i++) {
		views[i].index = i
	}
}
/**
 * 删除时更新计算
 * @param views 
 * @param index 
 */
export function removeUpdateIndex(views: ViewModel[], index: number) {
	for (let i = index; i < views.length; i++) {
		views[i].index = i
	}
}
/**
 * 移动时更新计数
 * @param views 
 * @param oldIndex 
 * @param newIndex 
 */
export function moveUpdateIndex(views: ViewModel[], oldIndex: number, newIndex: number) {
	const sort = oldIndex < newIndex ? [oldIndex, newIndex] : [newIndex, oldIndex];
	for (let i = sort[0]; i <= sort[1]; i++) {
		views[i].index = i
	}
}
/**
 * 初始化更新计数
 * @param views 
 * @param index 
 */
export function initUpdateIndexReverse(views: ViewModel[], index: number) {
	const s = views.length - 1
	for (let i = index; i > -1; i--) {
		views[i].index = s - i
	}
}
/**
 * 删除时更新计算
 * @param views 
 * @param index 
 */
export function removeUpdateIndexReverse(views: ViewModel[], index: number) {
	const s = views.length - 1
	for (let i = index - 1; i > -1; i--) {
		views[i].index = s - i
	}
}
/**
 * 移动时更新计数
 * @param views 
 * @param oldIndex 
 * @param newIndex 
 */
export function moveUpdateIndexReverse(views: ViewModel[], oldIndex: number, newIndex: number) {
	const sort = oldIndex < newIndex ? [oldIndex, newIndex] : [newIndex, oldIndex];
	const s = views.length - 1
	for (let i = sort[0]; i <= sort[1]; i++) {
		views[i].index = s - i
	}
}