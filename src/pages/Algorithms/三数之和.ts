/**
 * 三数之和是一个经典的双指针算法问题，
 * 要求在数组中找到所有不重复的三元组，
 * 使得它们的和等于目标值（通常是0）。
 *
 * 时间复杂度O(n^2)
 *    排序 O(nlogn)
 *  外层循环O(n)
 *  内层双指针O(n)
 *  总体:O(n log n) + O(n²) = O(n²
 *
 */
export default 1;

function threeSum(nums: number[]) {
  const result: number[][] = [];
  const n = nums.length;
  nums.sort((a, b) => a - b);
  for (let i = 0; i < n - 2; i++) {
    if (i > 0 && nums[i] === nums[i - 1]) {
      //跳过重复值
      continue;
    }
    let left = i + 1;
    let right = n - 1;
    const target = -nums[i];
    while (left < right) {
      const sum = nums[left] + nums[right];
      if (sum === target) {
        result.push([nums[i], nums[left], nums[right]]);

        //跳过重复值
        while (left < right && nums[left] == nums[left + 1]) {
          left++;
        }
        while (left < right && nums[right] == nums[right - 1]) {
          right--;
        }
        left++;
        right--;
      } else if (sum < target) {
        left++;
      } else {
        right--;
      }
    }
  }
}
