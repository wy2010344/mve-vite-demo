import{bM as A,aD as L,aF as O,by as G,aK as Z}from"./index-BCxd8sac.js";import{g as X,b as J,h as $,a as ee,T as M,r as te}from"./hookThreeView-DKIeCEze.js";import se from"./spline-D35H-hjv.js";import"./three.module-CtmcowjR.js";import{aT as F,bq as ie,s as K,a7 as z,ct as v,cX as E,d5 as m,da as T,ai as D,ba as re,cN as oe,x,d6 as p,c as ae,aU as R,A as le,cq as ne,a9 as he,cT as ue,aC as N,$ as j,aA as _,B as ce,ah as fe,az as de,ak as me,m as Ve,aM as pe,l as ge,k as Ae,cf as ve,q as xe}from"./three.core-CVW-h5Q9.js";import be from"./getStarField-yuWF1sRj.js";import"./OrbitControls-CoRAoTLY.js";const Me=""+new URL("blarmp-BdxvF1v5.mp3",import.meta.url).href,we=""+new URL("fitz-B7z2K5rf.mp3",import.meta.url).href,Se=""+new URL("laser-01-Dz4g3NTP.mp3",import.meta.url).href,Ce="data:audio/mpeg;base64,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",y={name:"CopyShader",uniforms:{tDiffuse:{value:null},opacity:{value:1}},vertexShader:`

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		uniform float opacity;

		uniform sampler2D tDiffuse;

		varying vec2 vUv;

		void main() {

			vec4 texel = texture2D( tDiffuse, vUv );
			gl_FragColor = opacity * texel;


		}`};class S{constructor(){this.isPass=!0,this.enabled=!0,this.needsSwap=!0,this.clear=!1,this.renderToScreen=!1}setSize(){}render(){console.error("THREE.Pass: .render() must be implemented in derived pass.")}dispose(){}}const Te=new ie(-1,1,1,-1,0,1);class De extends K{constructor(){super(),this.setAttribute("position",new z([-1,3,0,-1,-1,0,3,-1,0],3)),this.setAttribute("uv",new z([0,2,0,0,2,0],2))}}const ye=new De;class Y{constructor(e){this._mesh=new F(ye,e)}dispose(){this._mesh.geometry.dispose()}render(e){e.render(this._mesh,Te)}get material(){return this._mesh.material}set material(e){this._mesh.material=e}}class Re extends S{constructor(e,s="tDiffuse"){super(),this.textureID=s,this.uniforms=null,this.material=null,e instanceof v?(this.uniforms=e.uniforms,this.material=e):e&&(this.uniforms=E.clone(e.uniforms),this.material=new v({name:e.name!==void 0?e.name:"unspecified",defines:Object.assign({},e.defines),uniforms:this.uniforms,vertexShader:e.vertexShader,fragmentShader:e.fragmentShader})),this._fsQuad=new Y(this.material)}render(e,s,i){this.uniforms[this.textureID]&&(this.uniforms[this.textureID].value=i.texture),this._fsQuad.material=this.material,this.renderToScreen?(e.setRenderTarget(null),this._fsQuad.render(e)):(e.setRenderTarget(s),this.clear&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),this._fsQuad.render(e))}dispose(){this.material.dispose(),this._fsQuad.dispose()}}class H extends S{constructor(e,s){super(),this.scene=e,this.camera=s,this.clear=!0,this.needsSwap=!1,this.inverse=!1}render(e,s,i){const r=e.getContext(),t=e.state;t.buffers.color.setMask(!1),t.buffers.depth.setMask(!1),t.buffers.color.setLocked(!0),t.buffers.depth.setLocked(!0);let o,l;this.inverse?(o=0,l=1):(o=1,l=0),t.buffers.stencil.setTest(!0),t.buffers.stencil.setOp(r.REPLACE,r.REPLACE,r.REPLACE),t.buffers.stencil.setFunc(r.ALWAYS,o,4294967295),t.buffers.stencil.setClear(l),t.buffers.stencil.setLocked(!0),e.setRenderTarget(i),this.clear&&e.clear(),e.render(this.scene,this.camera),e.setRenderTarget(s),this.clear&&e.clear(),e.render(this.scene,this.camera),t.buffers.color.setLocked(!1),t.buffers.depth.setLocked(!1),t.buffers.color.setMask(!0),t.buffers.depth.setMask(!0),t.buffers.stencil.setLocked(!1),t.buffers.stencil.setFunc(r.EQUAL,1,4294967295),t.buffers.stencil.setOp(r.KEEP,r.KEEP,r.KEEP),t.buffers.stencil.setLocked(!0)}}class Be extends S{constructor(){super(),this.needsSwap=!1}render(e){e.state.buffers.stencil.setLocked(!1),e.state.buffers.stencil.setTest(!1)}}class Ue{constructor(e,s){if(this.renderer=e,this._pixelRatio=e.getPixelRatio(),s===void 0){const i=e.getSize(new m);this._width=i.width,this._height=i.height,s=new T(this._width*this._pixelRatio,this._height*this._pixelRatio,{type:D}),s.texture.name="EffectComposer.rt1"}else this._width=s.width,this._height=s.height;this.renderTarget1=s,this.renderTarget2=s.clone(),this.renderTarget2.texture.name="EffectComposer.rt2",this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2,this.renderToScreen=!0,this.passes=[],this.copyPass=new Re(y),this.copyPass.material.blending=re,this.timer=new oe}swapBuffers(){const e=this.readBuffer;this.readBuffer=this.writeBuffer,this.writeBuffer=e}addPass(e){this.passes.push(e),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}insertPass(e,s){this.passes.splice(s,0,e),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}removePass(e){const s=this.passes.indexOf(e);s!==-1&&this.passes.splice(s,1)}isLastEnabledPass(e){for(let s=e+1;s<this.passes.length;s++)if(this.passes[s].enabled)return!1;return!0}render(e){this.timer.update(),e===void 0&&(e=this.timer.getDelta());const s=this.renderer.getRenderTarget();let i=!1;for(let r=0,t=this.passes.length;r<t;r++){const o=this.passes[r];if(o.enabled!==!1){if(o.renderToScreen=this.renderToScreen&&this.isLastEnabledPass(r),o.render(this.renderer,this.writeBuffer,this.readBuffer,e,i),o.needsSwap){if(i){const l=this.renderer.getContext(),a=this.renderer.state.buffers.stencil;a.setFunc(l.NOTEQUAL,1,4294967295),this.copyPass.render(this.renderer,this.writeBuffer,this.readBuffer,e),a.setFunc(l.EQUAL,1,4294967295)}this.swapBuffers()}H!==void 0&&(o instanceof H?i=!0:o instanceof Be&&(i=!1))}}this.renderer.setRenderTarget(s)}reset(e){if(e===void 0){const s=this.renderer.getSize(new m);this._pixelRatio=this.renderer.getPixelRatio(),this._width=s.width,this._height=s.height,e=this.renderTarget1.clone(),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.renderTarget1=e,this.renderTarget2=e.clone(),this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2}setSize(e,s){this._width=e,this._height=s;const i=this._width*this._pixelRatio,r=this._height*this._pixelRatio;this.renderTarget1.setSize(i,r),this.renderTarget2.setSize(i,r);for(let t=0;t<this.passes.length;t++)this.passes[t].setSize(i,r)}setPixelRatio(e){this._pixelRatio=e,this.setSize(this._width,this._height)}dispose(){this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.copyPass.dispose()}}class Pe extends S{constructor(e,s,i=null,r=null,t=null){super(),this.scene=e,this.camera=s,this.overrideMaterial=i,this.clearColor=r,this.clearAlpha=t,this.clear=!0,this.clearDepth=!1,this.needsSwap=!1,this.isRenderPass=!0,this._oldClearColor=new x}render(e,s,i){const r=e.autoClear;e.autoClear=!1;let t,o;this.overrideMaterial!==null&&(o=this.scene.overrideMaterial,this.scene.overrideMaterial=this.overrideMaterial),this.clearColor!==null&&(e.getClearColor(this._oldClearColor),e.setClearColor(this.clearColor,e.getClearAlpha())),this.clearAlpha!==null&&(t=e.getClearAlpha(),e.setClearAlpha(this.clearAlpha)),this.clearDepth==!0&&e.clearDepth(),e.setRenderTarget(this.renderToScreen?null:i),this.clear===!0&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),e.render(this.scene,this.camera),this.clearColor!==null&&e.setClearColor(this._oldClearColor),this.clearAlpha!==null&&e.setClearAlpha(t),this.overrideMaterial!==null&&(this.scene.overrideMaterial=o),e.autoClear=r}}const Le={uniforms:{tDiffuse:{value:null},luminosityThreshold:{value:1},smoothWidth:{value:1},defaultColor:{value:new x(0)},defaultOpacity:{value:0}},vertexShader:`

		varying vec2 vUv;

		void main() {

			vUv = uv;

			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		uniform sampler2D tDiffuse;
		uniform vec3 defaultColor;
		uniform float defaultOpacity;
		uniform float luminosityThreshold;
		uniform float smoothWidth;

		varying vec2 vUv;

		void main() {

			vec4 texel = texture2D( tDiffuse, vUv );

			float v = luminance( texel.xyz );

			vec4 outputColor = vec4( defaultColor.rgb, defaultOpacity );

			float alpha = smoothstep( luminosityThreshold, luminosityThreshold + smoothWidth, v );

			gl_FragColor = mix( outputColor, texel, alpha );

		}`};class b extends S{constructor(e,s=1,i,r){super(),this.strength=s,this.radius=i,this.threshold=r,this.resolution=e!==void 0?new m(e.x,e.y):new m(256,256),this.clearColor=new x(0,0,0),this.needsSwap=!1,this.renderTargetsHorizontal=[],this.renderTargetsVertical=[],this.nMips=5;let t=Math.round(this.resolution.x/2),o=Math.round(this.resolution.y/2);this.renderTargetBright=new T(t,o,{type:D}),this.renderTargetBright.texture.name="UnrealBloomPass.bright",this.renderTargetBright.texture.generateMipmaps=!1;for(let h=0;h<this.nMips;h++){const c=new T(t,o,{type:D});c.texture.name="UnrealBloomPass.h"+h,c.texture.generateMipmaps=!1,this.renderTargetsHorizontal.push(c);const u=new T(t,o,{type:D});u.texture.name="UnrealBloomPass.v"+h,u.texture.generateMipmaps=!1,this.renderTargetsVertical.push(u),t=Math.round(t/2),o=Math.round(o/2)}const l=Le;this.highPassUniforms=E.clone(l.uniforms),this.highPassUniforms.luminosityThreshold.value=r,this.highPassUniforms.smoothWidth.value=.01,this.materialHighPassFilter=new v({uniforms:this.highPassUniforms,vertexShader:l.vertexShader,fragmentShader:l.fragmentShader}),this.separableBlurMaterials=[];const a=[6,10,14,18,22];t=Math.round(this.resolution.x/2),o=Math.round(this.resolution.y/2);for(let h=0;h<this.nMips;h++)this.separableBlurMaterials.push(this._getSeparableBlurMaterial(a[h])),this.separableBlurMaterials[h].uniforms.invSize.value=new m(1/t,1/o),t=Math.round(t/2),o=Math.round(o/2);this.compositeMaterial=this._getCompositeMaterial(this.nMips),this.compositeMaterial.uniforms.blurTexture1.value=this.renderTargetsVertical[0].texture,this.compositeMaterial.uniforms.blurTexture2.value=this.renderTargetsVertical[1].texture,this.compositeMaterial.uniforms.blurTexture3.value=this.renderTargetsVertical[2].texture,this.compositeMaterial.uniforms.blurTexture4.value=this.renderTargetsVertical[3].texture,this.compositeMaterial.uniforms.blurTexture5.value=this.renderTargetsVertical[4].texture,this.compositeMaterial.uniforms.bloomStrength.value=s,this.compositeMaterial.uniforms.bloomRadius.value=.1;const f=[1,.8,.6,.4,.2];this.compositeMaterial.uniforms.bloomFactors.value=f,this.bloomTintColors=[new p(1,1,1),new p(1,1,1),new p(1,1,1),new p(1,1,1),new p(1,1,1)],this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors,this.copyUniforms=E.clone(y.uniforms),this.blendMaterial=new v({uniforms:this.copyUniforms,vertexShader:y.vertexShader,fragmentShader:y.fragmentShader,premultipliedAlpha:!0,blending:ae,depthTest:!1,depthWrite:!1,transparent:!0}),this._oldClearColor=new x,this._oldClearAlpha=1,this._basic=new R,this._fsQuad=new Y(null)}dispose(){for(let e=0;e<this.renderTargetsHorizontal.length;e++)this.renderTargetsHorizontal[e].dispose();for(let e=0;e<this.renderTargetsVertical.length;e++)this.renderTargetsVertical[e].dispose();this.renderTargetBright.dispose();for(let e=0;e<this.separableBlurMaterials.length;e++)this.separableBlurMaterials[e].dispose();this.compositeMaterial.dispose(),this.blendMaterial.dispose(),this._basic.dispose(),this._fsQuad.dispose()}setSize(e,s){let i=Math.round(e/2),r=Math.round(s/2);this.renderTargetBright.setSize(i,r);for(let t=0;t<this.nMips;t++)this.renderTargetsHorizontal[t].setSize(i,r),this.renderTargetsVertical[t].setSize(i,r),this.separableBlurMaterials[t].uniforms.invSize.value=new m(1/i,1/r),i=Math.round(i/2),r=Math.round(r/2)}render(e,s,i,r,t){e.getClearColor(this._oldClearColor),this._oldClearAlpha=e.getClearAlpha();const o=e.autoClear;e.autoClear=!1,e.setClearColor(this.clearColor,0),t&&e.state.buffers.stencil.setTest(!1),this.renderToScreen&&(this._fsQuad.material=this._basic,this._basic.map=i.texture,e.setRenderTarget(null),e.clear(),this._fsQuad.render(e)),this.highPassUniforms.tDiffuse.value=i.texture,this.highPassUniforms.luminosityThreshold.value=this.threshold,this._fsQuad.material=this.materialHighPassFilter,e.setRenderTarget(this.renderTargetBright),e.clear(),this._fsQuad.render(e);let l=this.renderTargetBright;for(let a=0;a<this.nMips;a++)this._fsQuad.material=this.separableBlurMaterials[a],this.separableBlurMaterials[a].uniforms.colorTexture.value=l.texture,this.separableBlurMaterials[a].uniforms.direction.value=b.BlurDirectionX,e.setRenderTarget(this.renderTargetsHorizontal[a]),e.clear(),this._fsQuad.render(e),this.separableBlurMaterials[a].uniforms.colorTexture.value=this.renderTargetsHorizontal[a].texture,this.separableBlurMaterials[a].uniforms.direction.value=b.BlurDirectionY,e.setRenderTarget(this.renderTargetsVertical[a]),e.clear(),this._fsQuad.render(e),l=this.renderTargetsVertical[a];this._fsQuad.material=this.compositeMaterial,this.compositeMaterial.uniforms.bloomStrength.value=this.strength,this.compositeMaterial.uniforms.bloomRadius.value=this.radius,this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors,e.setRenderTarget(this.renderTargetsHorizontal[0]),e.clear(),this._fsQuad.render(e),this._fsQuad.material=this.blendMaterial,this.copyUniforms.tDiffuse.value=this.renderTargetsHorizontal[0].texture,t&&e.state.buffers.stencil.setTest(!0),this.renderToScreen?(e.setRenderTarget(null),this._fsQuad.render(e)):(e.setRenderTarget(i),this._fsQuad.render(e)),e.setClearColor(this._oldClearColor,this._oldClearAlpha),e.autoClear=o}_getSeparableBlurMaterial(e){const s=[],i=e/3;for(let r=0;r<e;r++)s.push(.39894*Math.exp(-.5*r*r/(i*i))/i);return new v({defines:{KERNEL_RADIUS:e},uniforms:{colorTexture:{value:null},invSize:{value:new m(.5,.5)},direction:{value:new m(.5,.5)},gaussianCoefficients:{value:s}},vertexShader:`

				varying vec2 vUv;

				void main() {

					vUv = uv;
					gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

				}`,fragmentShader:`

				#include <common>

				varying vec2 vUv;

				uniform sampler2D colorTexture;
				uniform vec2 invSize;
				uniform vec2 direction;
				uniform float gaussianCoefficients[KERNEL_RADIUS];

				void main() {

					float weightSum = gaussianCoefficients[0];
					vec3 diffuseSum = texture2D( colorTexture, vUv ).rgb * weightSum;

					for ( int i = 1; i < KERNEL_RADIUS; i ++ ) {

						float x = float( i );
						float w = gaussianCoefficients[i];
						vec2 uvOffset = direction * invSize * x;
						vec3 sample1 = texture2D( colorTexture, vUv + uvOffset ).rgb;
						vec3 sample2 = texture2D( colorTexture, vUv - uvOffset ).rgb;
						diffuseSum += ( sample1 + sample2 ) * w;

					}

					gl_FragColor = vec4( diffuseSum, 1.0 );

				}`})}_getCompositeMaterial(e){return new v({defines:{NUM_MIPS:e},uniforms:{blurTexture1:{value:null},blurTexture2:{value:null},blurTexture3:{value:null},blurTexture4:{value:null},blurTexture5:{value:null},bloomStrength:{value:1},bloomFactors:{value:null},bloomTintColors:{value:null},bloomRadius:{value:0}},vertexShader:`

				varying vec2 vUv;

				void main() {

					vUv = uv;
					gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

				}`,fragmentShader:`

				varying vec2 vUv;

				uniform sampler2D blurTexture1;
				uniform sampler2D blurTexture2;
				uniform sampler2D blurTexture3;
				uniform sampler2D blurTexture4;
				uniform sampler2D blurTexture5;
				uniform float bloomStrength;
				uniform float bloomRadius;
				uniform float bloomFactors[NUM_MIPS];
				uniform vec3 bloomTintColors[NUM_MIPS];

				float lerpBloomFactor( const in float factor ) {

					float mirrorFactor = 1.2 - factor;
					return mix( factor, mirrorFactor, bloomRadius );

				}

				void main() {

					// 3.0 for backwards compatibility with previous alpha-based intensity
					vec3 bloom = 3.0 * bloomStrength * (
						lerpBloomFactor( bloomFactors[ 0 ] ) * bloomTintColors[ 0 ] * texture2D( blurTexture1, vUv ).rgb +
						lerpBloomFactor( bloomFactors[ 1 ] ) * bloomTintColors[ 1 ] * texture2D( blurTexture2, vUv ).rgb +
						lerpBloomFactor( bloomFactors[ 2 ] ) * bloomTintColors[ 2 ] * texture2D( blurTexture3, vUv ).rgb +
						lerpBloomFactor( bloomFactors[ 3 ] ) * bloomTintColors[ 3 ] * texture2D( blurTexture4, vUv ).rgb +
						lerpBloomFactor( bloomFactors[ 4 ] ) * bloomTintColors[ 4 ] * texture2D( blurTexture5, vUv ).rgb
					);

					float bloomAlpha = max( bloom.r, max( bloom.g, bloom.b ) );
					gl_FragColor = vec4( bloom, bloomAlpha );

				}`})}}b.BlurDirectionX=new m(1,0);b.BlurDirectionY=new m(0,1);const ze=Object.assign({"./sfx/blarmp.mp3":Me,"./sfx/fitz.mp3":we,"./sfx/laser-01.mp3":Se,"./sfx/splode.mp3":Ce});function Ee(){const{renderer:n,hookAnimationLoop:e,scene:s,camera:i}=M.consume(),r=new Pe(s,i),t=new b(new m(A.width(),A.height()),1.5,.4,100);Z(()=>{t.resolution=new m(A.width(),A.height())}),t.threshold=.002,t.strength=3.5,t.radius=0;const o=new Ue(n);o.addPass(r),o.addPass(t),e(l=>{o.render(s,i)})}function Fe(){const{camera:n}=M.consume();let e,s;const i=new pe,r=new Ve(i),t=["fitz","laser-01","blarmp"],o=new ge;return n.add(o),t.forEach(l=>{const a=new Ae(o);a.name=l,l==="blarmp"&&(e=a),l==="laser-01"&&(s=a),r.load(ze[`./sfx/${l}.mp3`],function(f){a.setBuffer(f)})}),{fitzSound:e,laserSound:s}}function Ye(){const n=X(A.width,A.height),e=J({camera:n,width:A.width,notRender:!0,height:A.height,render(s){L(n),s.fog=new he(0,.3);const i=$();i.enableDamping=!0,i.dampingFactor=.03,L(be());const{tubeGeo:r,tubeHitArea:t}=_e(),o=ke(r),l=We();Qe(l,o,t),Ee()}});e.toneMapping=le,e.outputColorSpace=ne}function _e(){const e=new ue(se,222,.65,16,!0),s=new N;s.geometry=new j(e,.2),s.material=new _({color:52479}),L(s);const i=ee();i.geometry=e,i.material=new R({color:52479,transparent:!0,opacity:0,side:ce}),i.name="tube";const{renderer:r,hookAnimationLoop:t,camera:o}=M.consume();return t(l=>{const a=l*.1,f=10*1e3,h=a%f/f,c=e.parameters.path.getPointAt(h),u=e.parameters.path.getPointAt((h+.03)%1);o.position.copy(c),o.lookAt(u)}),{tubeGeo:e,tubeHitArea:i}}function ke(n){const{scene:e}=M.consume();return te(function(s){const t=new xe(.075,.075,.075);for(let o=0;o<55;o+=1){const l=(o/55+Math.random()*.1)%1,a=n.parameters.path.getPointAt(l),f=new x().setHSL(.7+l,1,.5),h=new R({color:f,transparent:!0,opacity:0}),c=new F(t,h);c.name="box",a.x+=Math.random()-.4,a.z+=Math.random()-.4,c.position.copy(a);const u=new p(Math.random()*Math.PI,Math.random()*Math.PI,Math.random()*Math.PI);c.rotation.set(u.x,u.y,u.z);const B=new j(t,.2),U=new _({color:f}),V=new N(B,U);V.position.copy(a),V.rotation.set(u.x,u.y,u.z),c.userData.box=V,s.add(c),e.add(V)}})}function We(){const{camera:n,hookAnimationLoop:e}=M.consume(),s=new fe;s.position.z=-1,n.add(s);const i=new _({color:16777215}),r=new K,t=[0,.05,0,0,.02,0];r.setAttribute("position",new z(t,3));for(let l=0;l<4;l+=1){const a=new de(r,i);a.rotation.z=l*.5*Math.PI,s.add(a)}const o=new m;return e(()=>{s.position.set(o.x,o.y,-1)}),O(G(window,"mousemove",function(l){const a=window.innerWidth,f=window.innerHeight,c={x:a/f*.75,y:.75};o.x=(l.clientX/a*2-1)*c.x,o.y=(-1*(l.clientY/f)*2+1)*c.y})),s}function Qe(n,e,s){const{camera:i,scene:r,hookAnimationLoop:t}=M.consume(),o=Fe(),l=new ve,a=new p,f=new p,h=new x;let c=null,u=[];t(()=>{u.forEach(V=>V.userData.update())});const B=new me(.05,2);function U(){const V=new R({color:16763904,transparent:!0,fog:!1}),d=new F(B,V);d.position.copy(i.position);let g=!0;const q=.5,k=i.position.clone().setFromMatrixPosition(n.matrixWorld),W=new p(0,0,0);W.subVectors(d.position,k).normalize().multiplyScalar(q),a.subVectors(k,i.position),l.set(i.position,a);const Q=l.intersectObjects([...e.children,s],!0);if(Q.length>0){const w=Q[0];f.copy(w.point),h.copy(w.object.material.color),w.object.name==="box"&&(c=w.object.userData.box,e.remove(w.object),o.fitzSound.stop(),o.fitzSound.play())}let P=1,C=1,I=!1;return d.userData={active:g,update(){g===!0&&(I===!1?(d.position.sub(W),d.position.distanceTo(f)<.5&&(d.position.copy(f),d.material.color.set(h),I=!0,c?.scale.setScalar(0))):(C>.01?(P+=.2,C*=.85):(C=0,P=.01,g=!1),d.scale.setScalar(P),d.material.opacity=C,d.userData.active=g))}},d}O(G(window,"click",function(){const V=U();u.push(V),r.add(V),o.laserSound.stop(),o.laserSound.play();const d=u.filter(g=>g.userData.active===!1);r.remove(...d),u=u.filter(g=>g.userData.active===!0)}))}export{Ye as default};
