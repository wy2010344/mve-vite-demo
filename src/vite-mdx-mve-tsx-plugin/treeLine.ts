


export class TreeLine{
	private constructor(){}
 	static root(){
		return new TreeLine()
	}
	private children:(TreeLine|string)[]=[]
	append(v:string){
		this.children.push(v)
	}

	appendMany(vs:string[],split=""){
		const last=vs.length-1
		for(let n=0;n<vs.length;n++){
			if(n!=last){
				this.children.push(vs[n]+split)
			}else{
				this.children.push(vs[n])
			}
		}
	}

	appendChild(){
		const v=new TreeLine()
		this.children.push(v)
		return v
	}
	getLast(){
		return this.children[this.children.length-1]
	}
	refreshLast(v:string){
		this.children[this.children.length-1]=v
	}

	lastExistAdd(v:string){
		const last=this.getLast()
		if(last){
			this.refreshLast(last+v)
		}
	}
	print(vs:string[],num:number,indent="  "){
		for(const child of this.children){
			if(child instanceof TreeLine){
				child.print(vs,num+1,indent)
			}else{
				vs.push(indent.repeat(num)+child)
			}
		}
	}

	toFile(indent="  "){
		const vs:string[]=[]
		this.print(vs,0,indent)
		return vs.join('\n')
	}
}