import{f as e,_ as x,c as d,ba as h}from"./index-B26XVUiJ.js";function f(){const n=d(0),l=d(0);e.div({className:`w-full h-full overflow-hidden relative ${g}`,onMouseMove(o){const a=o.currentTarget.getBoundingClientRect();n.set((o.clientX-a.left)/a.width-.5),l.set((o.clientY-a.top)/a.height-.5)},children(o){const a=x.hookGet("y",o,{maxScroll(){return c.get()}}),c=a.measureMaxScroll();e.div({className:"absolute inset-0 w-full h-full animated-gradient",s_transform(){return`translateY(${-a.get()*.5}px)`},s_background:"linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)",s_zIndex:"-1"});const m=e.div({className:"relative min-h-[300vh]",s_transform(){return`translateY(${-a.get()}px)`},children(){e.div({className:"h-screen flex items-center justify-center relative",children(){e.div({className:"absolute inset-0 opacity-20 parallax-layer",s_transform(){return`translateY(${-a.get()*.3}px)`},children(){for(let t=0;t<8;t++)e.div({className:"absolute rounded-full bg-white pulse-glow",s_width:`${30+t*20}px`,s_height:`${30+t*20}px`,s_left:`${10+t*12}%`,s_top:`${5+t%4*25}%`,s_transform(){const r=a.get()*.05*(t%2===0?1:-1),s=(n.get()*10+l.get()*5)*(t+1);return`translateY(${-a.get()*(.1+t*.03)}px) rotate(${r}deg) translateX(${s}px)`},s_animationDelay:`${t*.5}s`})}}),e.div({className:"text-center text-white z-10 relative parallax-layer",s_transform(){const t=n.get()*20,r=l.get()*20;return`translateY(${-a.get()*.2}px) translateX(${t}px) translateY(${r}px)`},children(){e.h1({className:"text-4xl sm:text-6xl md:text-8xl font-bold mb-6 float-animation",s_opacity(){return Math.max(0,1-a.get()/300).toString()},s_transform(){const t=Math.max(.8,1-a.get()/1e3),r=1+Math.abs(n.get())*.05+Math.abs(l.get())*.05;return`scale(${t*r})`},s_textShadow:"0 4px 20px rgba(0,0,0,0.5)",s_background:"linear-gradient(45deg, #fff, #f0f0f0)",s_backgroundClip:"text",s_WebkitBackgroundClip:"text",s_WebkitTextFillColor:"transparent",childrenType:"text",children:"Parallax Title"}),e.p({className:"text-xl md:text-2xl opacity-90",s_transform(){return`translateY(${a.get()*.1}px)`},s_opacity(){return Math.max(0,1-a.get()/400).toString()},s_textShadow:"0 2px 10px rgba(0,0,0,0.3)",childrenType:"text",children:"使用 MVE 框架实现的视差滚动效果"}),e.div({className:"mt-12 animate-bounce",s_opacity(){return Math.max(0,1-a.get()/200).toString()},children(){e.div({className:"w-6 h-10 border-2 border-white rounded-full flex justify-center",children(){e.div({className:"w-1 h-3 bg-white rounded-full mt-2 animate-pulse"})}}),e.p({className:"text-sm mt-2 opacity-70",childrenType:"text",children:"向下滚动"})}})}})}}),e.div({className:"min-h-screen bg-white relative z-10",s_transform(){return`translateY(${-a.get()*.1}px)`},children(){e.div({className:"container mx-auto px-8 py-20",children(){e.h2({className:"text-4xl font-bold text-gray-800 mb-8 text-center",childrenType:"text",children:"第一部分内容"});for(let t=0;t<3;t++)e.div({className:"mb-8 p-6 bg-gray-50 rounded-lg",s_transform(){const r=a.get()-400;return`translateY(${Math.max(0,r*(.05+t*.02))}px)`},children(){e.h3({className:"text-2xl font-semibold mb-4",childrenType:"text",children:`内容块 ${t+1}`}),e.p({className:"text-gray-600 leading-relaxed",childrenType:"text",children:"这是一个演示视差滚动效果的内容块。随着页面滚动，不同的元素会以不同的速度移动，创造出层次感和深度感。"})}})}})}}),e.div({className:"h-screen relative overflow-hidden",s_background:"linear-gradient(45deg, #f093fb 0%, #f5576c 100%)",children(){e.div({className:"absolute inset-0",s_transform(){return`translateY(${-a.get()*.4}px)`},children(){for(let t=0;t<12;t++)e.div({className:"absolute bg-white opacity-10",s_width:`${50+Math.random()*100}px`,s_height:`${50+Math.random()*100}px`,s_borderRadius:"50%",s_left:`${Math.random()*100}%`,s_top:`${Math.random()*100}%`,s_transform(){const r=a.get()*.1*(t%2===0?1:-1),s=n.get()*(10+t*2)+l.get()*(5+t);return`translateY(${-a.get()*(.2+t*.02)}px) rotate(${r}deg) translateX(${s}px)`}});for(let t=0;t<20;t++)e.div({className:"absolute bg-white opacity-20",s_width:`${5+Math.random()*15}px`,s_height:`${5+Math.random()*15}px`,s_borderRadius:"50%",s_left:`${Math.random()*100}%`,s_top:`${Math.random()*100}%`,s_transform(){const r=.3+t*.01,s=n.get()*(5+t)+l.get()*(3+t*.5);return`translateY(${-a.get()*r}px) translateX(${s}px)`}})}}),e.div({className:"absolute inset-0 flex items-center justify-center",s_transform(){return`translateY(${-a.get()*.15}px)`},children(){e.h2({className:"text-5xl font-bold text-white text-center",s_opacity(){const s=a.get();if(s<800||s>1200)return"0";const i=(s-800)/400;return Math.sin(i*Math.PI).toString()},childrenType:"text",children:"视差中间区域"})}})}}),e.div({className:"min-h-screen bg-gray-900 text-white relative z-10",children(){e.div({className:"container mx-auto px-8 py-20",children(){e.h2({className:"text-4xl font-bold mb-8 text-center",s_transform(){const t=a.get()-1400;return`translateY(${Math.max(0,-t*.1)}px)`},childrenType:"text",children:"第二部分内容"}),e.div({className:"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8",children(){for(let t=0;t<6;t++)e.div({className:"bg-gray-800 p-6 rounded-lg",s_transform(){const r=a.get()-1600,s=t*50;return`translateY(${Math.max(0,-(r-s)*.08)}px)`},s_opacity(){const r=a.get()-1600,s=t*50;return Math.min(1,Math.max(0,(r-s)/200)).toString()},children(){e.h3({className:"text-xl font-semibold mb-3",childrenType:"text",children:`特性 ${t+1}`}),e.p({className:"text-gray-300",childrenType:"text",children:"这是一个展示视差滚动效果的卡片，每个卡片都有独特的动画时机。"})}})}})}})}}),e.div({className:"h-screen flex items-center justify-center relative",s_background:"linear-gradient(180deg, #667eea 0%, #764ba2 100%)",children(){e.div({className:"text-center text-white",s_transform(){return`translateY(${-a.get()*.05}px)`},children(){e.h2({className:"text-5xl font-bold mb-4",s_transform(){const t=a.get()-2400;return`scale(${Math.min(1.2,Math.max(.8,1+t*1e-4))})`},childrenType:"text",children:"感谢观看"}),e.p({className:"text-xl opacity-80",childrenType:"text",children:"MVE 框架视差滚动演示完成"})}})}})}});e.nav({className:"absolute top-4 left-1/2 transform -translate-x-1/2 z-50",s_opacity(){return a.get()>100?"1":"0"},s_transform(){return`translateX(-50%) translateY(${a.get()>100?"0":"-20px"})`},s_transition:"all 0.3s ease",children(){e.div({className:"bg-black bg-opacity-20 backdrop-blur-md rounded-full px-6 py-3 flex space-x-4",children(){["首页","内容1","中间","内容2","结尾"].forEach((r,s)=>{e.button({className:"text-white hover:text-blue-200 transition-colors duration-200 text-sm font-medium",childrenType:"text",children:r,onClick(){const i=s*800;a.scrollTo(i)}})})}})}}),e.div({className:"absolute top-0 left-0 w-full h-1 bg-black bg-opacity-20 z-40",children(){e.div({className:"h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-100",s_width(){const t=c.get();return t===0?"0%":`${Math.min(100,a.get()/t*100)}%`}})}}),c.hookInit(o,m)}})}const g=h`
  /* 视差背景渐变动画 */
  @keyframes parallax-gradient {
    0% {
      background-position: 0% 50%;
    }
    50% {
      background-position: 100% 50%;
    }
    100% {
      background-position: 0% 50%;
    }
  }

  .animated-gradient {
    background-size: 200% 200%;
    animation: parallax-gradient 15s ease infinite;
  }

  /* 浮动动画 */
  @keyframes float {
    0%,
    100% {
      transform: translateY(0px);
    }
    50% {
      transform: translateY(-20px);
    }
  }

  .float-animation {
    animation: float 6s ease-in-out infinite;
  }

  /* 脉冲效果 */
  @keyframes pulse-glow {
    0%,
    100% {
      box-shadow: 0 0 20px rgba(255, 255, 255, 0.3);
      transform: scale(1);
    }
    50% {
      box-shadow: 0 0 40px rgba(255, 255, 255, 0.6);
      transform: scale(1.05);
    }
  }

  .pulse-glow {
    animation: pulse-glow 4s ease-in-out infinite;
  }
`;export{f as default};
