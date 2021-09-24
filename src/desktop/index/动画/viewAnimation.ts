
import { Tween, DrawOfBezier3, drawOfBezier3, tweenAnimationOf } from '../../../animate'
import { mve } from 'mve-core/util'
import { dom } from 'mve-dom/index'

export function viewAnimation(){
  let canvas:HTMLCanvasElement;
	let ctx:CanvasRenderingContext2D
	let isRunning=false
  return {
		draw(fn) {
			if (isRunning) return;
			const duration = 1000,
						yLen = 300,
						xLen = 500,
						space = xLen / duration,
						pos = [],
						gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, 15);
		
			gradient.addColorStop(0, "hsl(200,100%,85%)");
			gradient.addColorStop(1, "hsl(200,100%,50%)");
		
			ctx.clearRect(0, 0, canvas.width, canvas.height);
			ctx.save();
			ctx.beginPath();
			ctx.strokeStyle = "hsl(200,50%,50%)";
			ctx.moveTo(10, 50);
			ctx.lineTo(10, 350);
			ctx.lineTo(510, 350);
			ctx.lineTo(510, 50);
			ctx.closePath();
			ctx.stroke();
			ctx.restore();
	
			function orbit() {
				ctx.save();
				ctx.translate(10, 350);
				ctx.strokeStyle = "hsl(30,100%,50%)";
				ctx.beginPath();
				ctx.clearRect(0, -450, 500, 49);
				ctx.clearRect(0, -300, 500, 300);
				ctx.clearRect(0, 1, 500, 50);
				ctx.moveTo(0, 0);
				pos.forEach(function(n, i) {
					ctx.lineTo(n.x, n.y);
				});
				ctx.stroke();
				ctx.restore();
			}
		
			function ball(y:number) {
				ctx.save();
				ctx.clearRect(520, 0, 90, 400);
				ctx.translate(540, 350 - y);
				ctx.fillStyle = gradient;
				ctx.beginPath();
				ctx.arc(0, 0, 15, 0, Math.PI * 2, false);
				ctx.fill();
				ctx.restore();
			}
		
			tweenAnimationOf({
				duration,
				max:yLen,
				call(y,t){
					pos.push({ x: t * space, y: -y });
					orbit();
					ball(y);
				},
				change:fn,
				end(){
					isRunning=false
				}
			})
		},
		canvas:dom({
			type:"canvas",
			init(v){
				canvas=v
				ctx= canvas.getContext("2d")
				ctx.lineWidth = 2;
			},
			attr:{
				width:"600",
				height:"400"
			}
		})
  }
}