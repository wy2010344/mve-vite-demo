import { Row, sortAndFilterBase } from "./base";

import { mve,BaseArray,SimpleArray } from 'mve-core/util'

/**
 * 性能太低下
 * 太频率地操作DOM
 * 还不如原始的重建、就地复用、key复用
 */

function getNextShow(begin:number,array:mve.ArrayModel<Row>){
  for(let i=begin;i<array.size();i++){
    if(array.get(i).show()){
      return i
    }
  }
  return -1
}

function merge(fs:Row[],array:mve.ArrayModel<Row>){
  for(let i=0;i<fs.length;i++){
    const f=fs[i]
    const idx=array.indexOf(f)
    array.move(idx,i)
  }
}
function mergeNew(fs:Row[],array:mve.ArrayModel<Row>){
  let lastBegin=getNextShow(0,array)
  for(let i=0;i<fs.length;i++){
    const f=fs[i]
    if(array.get(lastBegin)==f){
      //相同不需要移动
      lastBegin++
    }else{
      const idx=array.indexOf(f,lastBegin)
      if(idx<lastBegin){
        console.log("不应该出现的错误")
      }
      array.move(idx,lastBegin)
      lastBegin=getNextShow(lastBegin+1,array)
      if(lastBegin<0){
        console.log("不应该出现的错误")
        return
      }
    }
  }
}

export const moveFilter=sortAndFilterBase(function(filter,dir,list){
  const fs=list.filter(v=>{
    if((v.value+"").startsWith(filter)){
      v.show(true)
      return true
    }else{
      v.show(false)
      return false
    }
  })
  if(dir=='asc'){
    fs.sort(function(a,b){
      return a.value - b.value
    })
    mergeNew(fs,list)
  }else if(dir=='desc'){
    fs.sort(function(a,b){
      return b.value - a.value
    })
    mergeNew(fs,list)
  }
  console.log("执行完成")
  
  // const arr=mve.arrayModelOf([1,3,5,2,6,9,4])
  // insertionSort(arr,(a,b)=>(a > b))
  // console.log(arr)
})


/**
 * 冒泡排序
 * @param arr 
 * @returns 
 */
function bubbleSort<T>(arr:BaseArray<T>,compare:(a:T,b:T)=>boolean) {
  var len = arr.size();
  for (var i = 0; i < len - 1; i++) {
      for (var j = 0; j < len - 1 - i; j++) {
        if(compare(arr.get(j),arr.get(j+1))){
          arr.move(j,j+1)
        }
          // if (arr[j] > arr[j+1]) {        // 相邻元素两两对比
          //     var temp = arr[j+1];        // 元素交换
          //     arr[j+1] = arr[j];
          //     arr[j] = temp;
          // }
      }
  }
}
/**
 * 插入排序
 * @param arr 
 * @returns 
 */
function insertionSort<T>(arr:BaseArray<T>,compare:(a:T,b:T)=>boolean) {
var len = arr.size();
var preIndex, current;
for (var i = 1; i < len; i++) {
    preIndex = i - 1;
    current = arr.get(i);
    while(preIndex >= 0 && compare(arr.get(preIndex),current)){
      arr.move(preIndex,preIndex+1)
      //arr[preIndex+1] = arr[preIndex];
      preIndex--;
    }
    //arr.move(i,preIndex+1)
    //arr[preIndex+1] = current;
}
}
