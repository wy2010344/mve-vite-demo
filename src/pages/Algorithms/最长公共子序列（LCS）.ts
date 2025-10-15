/**
 * 给定两个字符串 text1 和 text2，返回这两个字符串的最长公共子序列的长度。
 * 
 * 时间复杂度O(m*n)
 * 空间复杂度O(m*n)
 * 
输入：text1 = "abcde", text2 = "ace" 
输出：3 
解释：最长公共子序列是 "ace"，长度为 3。

中间可以断开...
 */

function LCS_DP(text1: string, text2: string) {
  const m = text1.length;
  const n = text2.length;

  /**
   * 创建(m+1)*(n+1)的DP表,初始化为0
   */
  const dp = Array.from(
    {
      length: m + 1,
    },
    () => Array(n + 1).fill(0)
  );

  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      if (text1[i] == text2[j]) {
        //字符串匹配,长度加1
        dp[i + 1][j + 1] = dp[i][j] + 1;
      } else {
        //字符串不匹配,取上方或左方的最大值
        dp[i + 1][j + 1] = Math.max(dp[i][j + 1], dp[i + 1][j]);
      }
    }
  }
  return dp[m][n];
}

/**
 * 优化后的算法
 * @param text1
 * @param text2
 */
function LCS_min(text1: string, text2: string) {
  // 确保 text1 是较短的字符串以减少空间使用
  if (text1.length > text2.length) {
    [text1, text2] = [text2, text1];
  }

  //较小
  const m = text1.length;
  //较大
  const n = text2.length;
  // 使用一维数组优化空间
  let prev = new Array(m + 1).fill(0);
  let curr = new Array(m + 1).fill(0);

  for (let j = 0; j < n; j++) {
    for (let i = 0; i < m; i++) {
      if (text1[i] == text2[j]) {
        curr[i + 1] = prev[i] + 1;
      } else {
        curr[i + 1] = Math.max(prev[i + 1], curr[i]);
      }
    }
    [prev, curr] = [curr, prev];
  }
  return prev[m];
}

console.log(LCS_min('oxcpqrsvwf', 'shmtulqrypy')); // 输出: 2
