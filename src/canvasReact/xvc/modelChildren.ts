import { baseChildrenBuilder, EOChild } from "./childrenBuilder"
import { CacheArrayModel, ArrayModelView, EmptyFun, RefreshFun } from "./util"
import { VirtualChild } from "./virtualTreeChildren"



export function modelChildren<D, T, EO>(
	array: CacheArrayModel<D>,
	fun: (row: D, index: () => number) => EOChild<T, EO>
): EOChild<T, EO> {
	return function (parent: VirtualChild<EO>) {
		const views: ViewModel<T>[] = []
		const modelView: ArrayModelView<D> = {
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
			refresh(v) {
				const length = views.length
				for (let i = 0; i < length; i++) {
					const view = views[i]
					view.refresh(v)
				}
			}
		}
	}
}

export function modelChildrenReverse<D, T, EO>(
	array: CacheArrayModel<D>,
	fun: (row: D, index: () => number) => EOChild<T, EO>
): EOChild<T, EO> {
	return function (parent: VirtualChild<EO>) {
		const views: ViewModel<T>[] = []
		const modelView: ArrayModelView<D> = {
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
			refresh(v) {
				for (let i = views.length - 1; i > -1; i--) {
					const view = views[i]
					view.refresh(v)
				}
			}
		}
	}
}
class ViewModel<T> {
	private constructor(
		public index: number
	) { }
	static of<D, T, EO>(
		index: number,
		row: D,
		parent: VirtualChild<EO>,
		fun: (row: D, index: () => number) => EOChild<T, EO>
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
	private refreshValue: RefreshFun<T> | void = undefined
	refresh(v: T) {
		if (this.refreshValue) {
			this.refreshValue(v)
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
export function initUpdateIndex<T>(views: ViewModel<T>[], index: number) {
	for (let i = index + 1; i < views.length; i++) {
		views[i].index = i
	}
}
/**
 * 删除时更新计算
 * @param views 
 * @param index 
 */
export function removeUpdateIndex<T>(views: ViewModel<T>[], index: number) {
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
export function moveUpdateIndex<T>(views: ViewModel<T>[], oldIndex: number, newIndex: number) {
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
export function initUpdateIndexReverse<T>(views: ViewModel<T>[], index: number) {
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
export function removeUpdateIndexReverse<T>(views: ViewModel<T>[], index: number) {
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
export function moveUpdateIndexReverse<T>(views: ViewModel<T>[], oldIndex: number, newIndex: number) {
	const sort = oldIndex < newIndex ? [oldIndex, newIndex] : [newIndex, oldIndex];
	const s = views.length - 1
	for (let i = sort[0]; i <= sort[1]; i++) {
		views[i].index = s - i
	}
}