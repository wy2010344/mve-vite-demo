function h({sourceX:e,sourceY:o,targetX:n,targetY:s}){const c=Math.abs(n-e)/2,t=n<e?n+c:n-c,f=Math.abs(s-o)/2,b=s<o?s+f:s-f;return[t,b,c,f]}export{h as getEdgeCenter};
