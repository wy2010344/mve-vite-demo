function t(n){let e=null;return function r(){e===null&&(e=requestAnimationFrame(function(u){e=null,n(u)&&r()}))}}export{t as createScheduleRender};
