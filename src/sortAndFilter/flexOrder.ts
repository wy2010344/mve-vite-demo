import { Row, sortAndFilterBase } from "./base"


function getIndexOrAdd(keep:Row[],v:Row,com:(a:number,b:number)=>boolean){
  for(let i=0;i<keep.length;i++){
    if(com(v.value,keep[i].value)){
      return keep.splice(i,0,v)
    }
  }
  keep.push(v)
}
function asc(a:number,b:number){
  return a < b
}
function desc(a:number,b:number){
  return a > b
}

export const flexSortAndFilter=sortAndFilterBase(function(filter,dir,list){
  const keep:Row[]=[]
  list.forEach(v=>{
    if((v.value+"").startsWith(filter)){
      v.show(true)
      
      if(dir=='none'){
        v.order(0)
      }else
      if(dir=='asc'){
        getIndexOrAdd(keep,v,asc)
      }else{
        getIndexOrAdd(keep,v,desc)
      }
    }else{
      v.show(false)
    }
  })
  keep.forEach((v,i)=>v.order(i))
})