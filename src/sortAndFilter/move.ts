import { sortAndFilterBase } from "./base";

import { mve,BaseArray,SimpleArray } from 'mve-core/util'

/**
 * 性能太低下
 * 太频率地操作DOM
 * 还不如原始的重建、就地复用、key复用
 */

export const moveFilter=sortAndFilterBase(function(filter,dir,list){
  list.forEach(v=>{
    if((v.value+"").startsWith(filter)){
      v.show(true)
    }else{
      v.show(false)
    }
  })
  if(dir=='none'){

  }else{
    insertionSort(list,dir=='asc'?function(a,b){
      return a.value < b.value
    }:dir=='desc'?function(a,b){
      return a.value > b.value
    }:null)
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
