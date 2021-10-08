
/**
 * 防抖函数
 * 固定参数，返回一个延时函数。
 * @param cb 
 * @param wait 
 */
 export function debounce<TS extends any[]>(cb:(...ts:TS)=>void,wait:number){
	let timeOut=0
	return function(...ts:TS){
		clearTimeout(timeOut)
		timeOut=setTimeout(function(){
			cb(...ts)
		},wait)
	}
}
export interface Range{
	start:number
	end:number
	dir?:"->"|"<-"
}

/**
 * 深度遍历，先子后弟
 * @param editor
 * @param visitor
 */
function visit(editor:HTMLElement, visitor:(el:HTMLElement)=>boolean){
	const queue = [];
	if (editor.firstChild) {
		queue.push(editor.firstChild);
	}
	var el = queue.pop();
	while (el) {
		if (visitor(el)) {
			break;
		}
		if (el.nextSibling) {
			queue.push(el.nextSibling);
		}
		if (el.firstChild) {
			queue.push(el.firstChild);
		}
		el = queue.pop();
	}
};
export function getSelectionRange(editor:HTMLElement){
	const s = window.getSelection();
	const pos:Range = { start: 0, end: 0 };
	visit(editor, function (el) {
		if (el.nodeType != Node.TEXT_NODE)
			return;
		if (el == s.anchorNode) {
			if (el == s.focusNode) {
				pos.start += s.anchorOffset;
				pos.end += s.focusOffset;
				pos.dir = s.anchorOffset <= s.focusOffset ? "->" : "<-";
				return true;
			}
			else {
				pos.start += s.anchorOffset;
				if (pos.dir) {
					return true;
				}
				else {
					//选遇到开始点
					pos.dir = "->";
				}
			}
		}
		else if (el == s.focusNode) {
			pos.end += s.focusOffset;
			if (pos.dir) {
				return true;
			}
			else {
				//先遇到结束点
				pos.dir = "<-";
			}
		}
		if (el.nodeType == Node.TEXT_NODE) {
			var len = (el.nodeValue || "").length;
			if (pos.dir != "->") {
				pos.start += len;
			}
			if (pos.dir != "<-") {
				pos.end += len;
			}
		}
	});
	return pos;
}

function restoreVerifyPos(pos:Range) {
	var dir = pos.dir;
	var start = pos.start;
	var end = pos.end;
	if (!dir) {
		dir = "->";
	}
	if (start < 0) {
		start = 0;
	}
	if (end < 0) {
		end = 0;
	}
	if (dir == "<-") {
			//交换开始与结束的位置，以便顺序遍历
		[start,end] = [end, start];
	}
	return [start, end, dir] as const
}

export function setSelectionRange(editor:HTMLElement, pos:Range){
	const s = window.getSelection();
	let startNode, startOffset = 0;
	let endNode, endOffset = 0;
	const [start,end,dir] = restoreVerifyPos(pos)
	let current = 0;
	visit(editor, function (el) {
		if (el.nodeType != Node.TEXT_NODE)
			return;
		const len = (el.nodeValue || "").length;
		if (current + len >= start) {
			if (!startNode) {
				startNode = el;
				startOffset = start - current;
			}
			if (current + len >= end) {
				endNode = el;
				endOffset = end - current;
				return true;
			}
		}
		current += len;
	});
	if (!startNode) {
		startNode = editor;
	}
	if (!endNode) {
		endNode = editor;
	}
	if (dir == "<-") {
		[startNode,startOffset,endNode,endOffset] = [endNode, endOffset, startNode, startOffset]
	}
	s.setBaseAndExtent(startNode, startOffset, endNode, endOffset);
	return s;
}

export function preventDefault(e:Event){
	e.preventDefault()
}

export const browser=(function(){
	//http://www.jb51.net/article/50464.htm
	var myBrowser=function(){
		var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串
		var isOpera = userAgent.indexOf("Opera") > -1; //判断是否Opera浏览器
		var isIE = userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1 && !isOpera; //判断是否IE浏览器
		var isFF = userAgent.indexOf("Firefox") > -1; //判断是否Firefox浏览器
		var isSafari = userAgent.indexOf("Safari") > -1; //判断是否Safari浏览器
		if (isIE) {
			var reIE = new RegExp("MSIE (\\d+\\.\\d+);");
			reIE.test(userAgent);
			return {
				type:"IE",
				version:parseFloat(RegExp["$1"]),
				documentMode:document['documentMode']//IE的文档模式
			} as const
		}
		if (isFF) {
			return {
				type:"FF"
			} as const
		}
		if (isOpera) {
			return {
				type:"Opera"
			} as const
		}
		if (isSafari){
			return {
				type:"Safari"
			} as const
		}
	};
	var ret=myBrowser();
	console.log(ret,navigator.userAgent);
	return ret;
})();

export const contentEditable={
	text:browser.type=="FF"?"true":"plaintext-only"
}

export function reDefine<T,V>(v:T,fun:(v:T)=>V){
	return fun(v)
}