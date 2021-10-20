
/**一个基础的只读数组包含 */
export interface BaseReadArray<T> {
	size(): number
	get(i: number): T | void
}
/**一个基础的可读写数组 */
export interface BaseArray<T> extends BaseReadArray<T> {
	insert(i: number, v: T): void
	remove(i: number): T | void
	set(i: number, v: T): T | void
	move(oldI: number, newI: number): void
	clear(): void
}
export class SimpleArray<T> implements BaseArray<T>{
	private constructor(ts: T[]) {
		this.array = ts
	}
	static of<T>(...vs: T[]) {
		return new SimpleArray(vs)
	}
	static from<T>(vs: T[], noClone?: boolean) {
		if (noClone) {
			return new SimpleArray(vs)
		} else {
			return new SimpleArray(vs.slice(0))
		}
	}
	private readonly array: T[]
	get(i: number): T {
		return this.array[i]
	}
	insert(i: number, v: T): void {
		this.array.splice(i, 0, v)
	}
	push(v: T) {
		this.array.push(v)
	}
	forEach(fun: (v: T, i: number) => void) {
		this.array.forEach(fun)
	}
	indexOf(v: T) {
		return this.array.indexOf(v)
	}
	remove(i: number): T {
		return this.array.splice(i, 1)[0]
	}
	removeWhere(fun: (v: T, i: number) => boolean) {
		return arrayRemoveWhere(this, fun)
	}
	set(i: number, v: T): T {
		const oldV = this.array[i]
		this.array[i] = v
		return oldV
	}
	move(oldI: number, newI: number): void {
		arrayMove(this, oldI, newI)
	}
	clear(): void {
		this.array.length = 0
	}
	size(): number {
		return this.array.length
	}
}

export interface ArrayModelView<T> {
	insert(index: number, row: T): void
	remove(index: number): void
	set(index: number, row: T): void
	move(oldIndex: number, newIndex: number): void
}
export interface CacheArrayModel<T> extends BaseReadArray<T> {
	addView(view: ArrayModelView<T>): void
	removeView(view: ArrayModelView<T>): void
}
export class ArrayModel<T> implements CacheArrayModel<T>, BaseArray<T>{
	private locked = false
	private lock() {
		if (this.locked) {
			const msg = `期间禁止操作`
			console.warn(msg, this)
			throw new Error(msg)
		}
		this.locked = true
	}
	private unlock() {
		if (this.locked) {
			this.locked = false
		} else {
			const msg = `禁止重复解锁`
			console.warn(msg, this)
			throw new Error(msg)
		}
	}
	/**
	 * 检查下标
	 * @param index 下标
	 * @param lessSize 必须小于size
	 */
	private checkIndex(index: number, noThrow: boolean | undefined, lessSize = false) {
		const size = this.size()
		if (index < 0 || index > size || (lessSize && index == size)) {
			if (noThrow) {
				return false
			} else {
				const msg = `${index}超出边界[0~${lessSize ? size - 1 : size}]`
				console.warn(msg, this, lessSize, size)
				throw new Error(msg)
			}
		}
		return true
	}
	////////////////////////////////////////////////////////////////////
	private readonly views = SimpleArray.of<ArrayModelView<T>>()
	size() {
		return this.array.size()
	}
	private constructor(
		private readonly array: SimpleArray<T>
	) { }
	static of<T>(...vs: T[]) {
		return new ArrayModel(SimpleArray.from(vs, true))
	}
	static from<T>(vs: T[], noClone?: boolean) {
		vs = noClone ? vs : vs.slice(0)
		return new ArrayModel(SimpleArray.from(vs, true))
	}
	////////////////////////////////////////////////////////////////////
	addView(view: ArrayModelView<T>) {
		this.views.push(view)
		//自动初始化
		for (var i = 0; i < this.array.size(); i++) {
			view.insert(i, this.array.get(i))
		}
	}
	removeView(view: ArrayModelView<T>) {
		this.views.removeWhere(v => v == view)
	}
	////////////////////////////////////////////////////////////////////
	insert(index: number, row: T, noThrow?: boolean) {
		if (this.checkIndex(index, noThrow)) {
			this.lock()
			this.array.insert(index, row)
			this.views.forEach(function (view) {
				view.insert(index, row)
			})
			this.unlock()
			return true
		}
		return false
	}
	remove(index: number, noThrow?: boolean) {
		if (this.checkIndex(index, noThrow, true)) {
			this.lock()
			const oldRow = this.array.remove(index)
			this.views.forEach(function (view) {
				view.remove(index);
			})
			this.unlock()
			return oldRow
		}
	}
	set(index: number, row: T, noThrow?: boolean) {
		if (this.checkIndex(index, noThrow, true)) {
			this.lock()
			const oldRow = this.array.set(index, row)
			this.views.forEach(function (view) {
				view.set(index, row)
			})
			this.unlock()
			return oldRow
		}
	}
	move(fromIndex: number, toIndex: number, noThrow?: boolean) {
		if (this.checkIndex(fromIndex, noThrow, true) && this.checkIndex(toIndex, noThrow, true)) {
			this.lock()
			this.views.forEach(function (view) {
				view.move(fromIndex, toIndex);
			})
			this.unlock()
			return true
		}
		return false
	}
	/**清理匹配项 */
	removeWhere(fun: (row: T, i: number) => boolean) {
		arrayRemoveWhere(this, fun)
	}
	/**清理单纯相等的项 */
	removeEqual(row: T) {
		this.removeWhere(theRow => theRow == row)
	}
	moveToFirst(index: number) {
		this.move(index, 0);
	}
	moveToLast(index: number) {
		this.move(index, this.size() - 1);
	}
	shift() {
		return this.remove(0);
	}
	unshift(row: T) {
		return this.insert(0, row)
	}
	pop() {
		return this.remove(this.size() - 1);
	}
	push(row: T) {
		return this.insert(this.size(), row);
	}
	clear() {
		while (this.size() > 0) {
			this.pop();
		}
	}
	reset(array: T[] = []) {
		this.clear();
		for (const row of array) {
			this.push(row)
		}
	}
	//////////////////////////////////////////////////////////////////////////////
	get(index: number, noThrow?: boolean) {
		if (this.checkIndex(index, noThrow, true)) {
			return this.array.get(index)
		}
	}
	getLast(noThrow?: boolean) {
		return this.get(this.array.size() - 1, noThrow)
	}
	findIndex(fun: (v: T, i: number) => boolean, from?: number): number {
		const size = this.size()
		for (let i = from || 0; i < size; i++) {
			const row = this.get(i) as T
			if (fun(row, i)) {
				return i
			}
		}
		return -1
	}
	forEach(fun: (row: T, i: number) => void) {
		const size = this.size()
		for (let i = 0; i < size; i++) {
			fun(this.get(i) as T, i)
		}
	}
	map<V>(fun: (row: T, i: number) => V) {
		const vs: V[] = []
		const size = this.size()
		for (let i = 0; i < size; i++) {
			vs.push(fun(this.get(i) as T, i))
		}
		return vs
	}
	filter(fun: (row: T, i: number) => boolean) {
		const vs: T[] = []
		const size = this.size()
		for (let i = 0; i < size; i++) {
			const row = this.get(i) as T
			if (fun(row, i)) {
				vs.push(row)
			}
		}
		return vs
	}
	findRow(fun: (row: T, i: number) => boolean, from?: number) {
		const size = this.size()
		for (let i = from || 0; i < size; i++) {
			const row = this.get(i) as T
			if (fun(row, i)) {
				return row
			}
		}
	}
	indexOf(row: T, from?: number) {
		return this.findIndex(theRow => theRow == row, from);
	}
	count(fun: (row: T, i: number) => boolean) {
		const size = this.size()
		let count = 0
		for (let i = 0; i < size; i++) {
			const row = this.get(i) as T
			if (fun(row, i)) {
				count++
			}
		}
		return count
	}
	exist(fun: (row: T, i: number) => boolean) {
		const size = this.size()
		for (let i = 0; i < size; i++) {
			const row = this.get(i) as T
			if (fun(row, i)) {
				return true
			}
		}
		return false
	}
	all(fun: (row: T, i: number) => boolean) {
		const size = this.size()
		for (let i = 0; i < size; i++) {
			const row = this.get(i) as T
			if (!fun(row, i)) {
				return false
			}
		}
		return true
	}
	join(split?: string) {
		return this.map(v => v).join(split)
	}
}

/**
 * 数组移动
 * @param vs 
 * @param oldIndex 
 * @param newIndex 
 */
export function arrayMove<T>(vs: BaseArray<T>, oldIndex: number, newIndex: number) {
	const row = vs.remove(oldIndex) as T
	vs.insert(newIndex, row);
}
export function arrayRemoveWhere<T>(vs: BaseArray<T>, fun: (row: T, i: number) => boolean) {
	let i = vs.size() - 1;
	while (i > -1) {
		const theRow = vs.get(i) as T;
		if (fun(theRow, i)) {
			vs.remove(i);
		}
		i--;
	}
}

////////////////////////////////////////////////////////////////////////

export interface EmptyFun {
	(): void
}
export interface BuildResult<T> {
	/**更新配置*/
	refresh?(v: T): void
	/**销毁事件函数*/
	destroy?(): void
}
export function quote<T>(...vs: T[]) {
	return vs
}
export function run<T>(fun: () => T) {
	return fun()
}
export function orRun<T>(fun?: () => T) {
	if (fun) {
		return fun()
	}
}
export interface RefreshFun<T> {
	(v: T): void
}
/**
 * 整合成一个初始化函数
 * @param vs 
 * @returns 
 */
export function getAsOne<T>(vs: BuildResult<T>[]): BuildResult<T> | void {
	const size = vs.length
	if (size > 1) {
		const refreshs: RefreshFun<T>[] = []
		const destroys: EmptyFun[] = []
		for (const v of vs) {
			if (v.destroy) {
				destroys.push(v.destroy)
			}
			if (v.refresh) {
				refreshs.push(v.refresh)
			}
		}
		let destroy: EmptyFun | undefined = undefined
		if (destroys.length == 1) {
			destroy = destroys[0]
		} else if (destroys.length > 1) {
			destroy = function () {
				for (const destroy of destroys) {
					destroy()
				}
			}
		}
		let refresh: RefreshFun<T> | undefined = undefined
		if (refreshs.length == 1) {
			refresh = refreshs[0]
		} else if (refreshs.length > 1) {
			refresh = function (v) {
				for (const ref of refreshs) {
					ref(v)
				}
			}
		}
		if (destroy || refresh) {
			return {
				destroy,
				refresh: refresh
			}
		}
	} else
		if (size == 1) {
			const init = vs[0]
			if (init.destroy || init.refresh) {
				return init
			}
		}
}