(()=>{"use strict";var e,t={686:(e,t,i)=>{const a=new(i(607).aoeGame)({dom:document.querySelector("#app")});a.loadMap("assets/mapexample.json").then((()=>{a.loadTerrain(),a.preloadGaia().then((()=>{a.loadGaia()}))}))},607:function(e,t,i){var a=this&&this.__awaiter||function(e,t,i,a){return new(i||(i=Promise))((function(s,n){function o(e){try{l(a.next(e))}catch(e){n(e)}}function r(e){try{l(a.throw(e))}catch(e){n(e)}}function l(e){var t;e.done?s(e.value):(t=e.value,t instanceof i?t:new i((function(e){e(t)}))).then(o,r)}l((a=a.apply(e,t||[])).next())}))},s=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(t,"__esModule",{value:!0}),t.aoeGame=void 0;const n=i(212),o=i(365),r=i(764),l=i(733),h=i(287),d=s(i(466)),u=i(376);class c extends n.Scene{constructor(e){super(),this.elevationScale=.3,this._mapSize=120,this.debug=!1,this._dom=e.dom||document.appendChild(document.createElement("canvas")),this._domParent=this._dom.parentElement,this.debug=e.debug||!1,this._defaultRenderer=new n.WebGLRenderer({antialias:!0,canvas:this._dom}),this._defaultRenderer.setClearColor(0,0),this._defaultRenderer.setPixelRatio(window.devicePixelRatio),this._defaultRenderer.outputEncoding=n.sRGBEncoding,this._defaultRenderer.shadowMap.enabled=!0,this._defaultRenderer.shadowMap.autoUpdate=!1,this._defaultRenderer.domElement=this._dom,this._defaultRenderer.setSize(this._domParent.offsetWidth,this._domParent.offsetHeight),this._defaultLabelRenderer=new r.CSS2DRenderer({element:this._dom}),this._defaultLabelRenderer.setSize(this._domParent.offsetWidth,this._domParent.offsetHeight),this._defaultLabelRenderer.domElement.style.position="absolute",this._defaultLabelRenderer.domElement.style.top="0px",window.addEventListener("resize",this.onWindowResize.bind(this),!1);this._defaultLights=new n.Group,this._defaultLights.add(new n.AmbientLight(4210752,.54));const t=new n.PointLight(16777215,1);t.castShadow=!0,this._defaultLights.add(t),this.add(this._defaultLights),this._defaultCamera=new n.PerspectiveCamera(70,this._domParent.offsetWidth/this._domParent.offsetHeight,.01,1e3),this._defaultCamera.position.set(20,30,20),this.add(this._defaultCamera),this._defaultControls=new o.OrbitControls(this._defaultCamera,this._dom),this._defaultControls.target=new n.Vector3(this._mapSize/2,0,this._mapSize/2),this._defaultControls.autoRotate=!0,this._defaultControls.update(),this._stats=new d.default,this._stats.dom.style.display="none",this._datGUI=new u.GUI,this._datGUI.hide(),this.debug&&(this._datGUI.show(),this._datGUI.add(this._defaultLights.children[0],"intensity",0,2),this._datGUI.add(this._defaultLights.children[1],"intensity",0,2),this._stats.showPanel(0),this._stats.dom.style.display="block",document.body.appendChild(this._stats.dom));const i=new n.AxesHelper(5);i.name="axes",this.add(i),this.mapData={},this.models={},this.mapSize=this._mapSize,this.animate()}onWindowResize(){this._defaultCamera.aspect=this._domParent.offsetWidth/this._domParent.offsetHeight,this._defaultCamera.updateProjectionMatrix(),this._defaultRenderer.setSize(this._domParent.offsetWidth,this._domParent.offsetHeight),this._defaultLabelRenderer.setSize(this._domParent.offsetWidth,this._domParent.offsetHeight),this.animate()}animate(){this._stats.begin(),requestAnimationFrame(this.animate.bind(this)),this._defaultControls.update(),this._defaultRenderer.render(this,this._defaultCamera),this.debug||this._defaultLabelRenderer.render(this,this._defaultCamera),this._stats.end()}loadMap(e){return a(this,void 0,void 0,(function*(){return this.mapData=yield(0,l.loadMapData)(e)}))}loadTerrain(){const e=new l.terrain(this.mapData.tiles);this.add(e)}preloadGaia(){var e;return a(this,void 0,void 0,(function*(){let t=[];null===(e=this.mapData.gaia)||void 0===e||e.filter((function(e){var i=t.findIndex((t=>t.name==e.name));if(i<=-1){let i=t.push(e);t[i-1].count=1}else t[i].count+=1;return null})),t.forEach((e=>{}));let i=[];const s=Promise.all(t.map((e=>a(this,void 0,void 0,(function*(){let t;try{t=(0,h.resolveModelPaths)(e.name)}catch(e){return void i.push(e)}const a=yield(0,l.makeInstanceAsset)(t,e.count);this.models[e.name]=a,this.models[e.name].userData.count=e.count})))));return i.length,s}))}loadGaia(){const e=new n.Object3D;this.mapData.gaia.forEach((t=>{var i,a;if(t.name){if(!this.models)throw new Error("preload gaia first. try `.preloadGaia.then(...)`");if(t.name in this.models){const i=this.getObjectByName("terrain").tiles[t.position.x-.5][t.position.y-.5].actualElevation;e.rotation.set(0,Math.random()*Math.PI*2,0),e.position.set(t.position.y-.5,i*this.elevationScale,t.position.x-.5),e.updateMatrix();this.getObjectByName("terrain").tiles;this.models[t.name].children.forEach((i=>{i.setMatrixAt(this.models[t.name].userData.count-1,e.matrix),i.instanceMatrix.needsUpdate=!0,i.castShadow=!0})),this.models[t.name].userData.count-=1}else if(this.debug){const e=new r.CSS2DObject(document.createElement("div"));e.element.textContent=t.name.slice(0,5)||"<>",e.position.set((null===(i=t.position)||void 0===i?void 0:i.y)||0,.5,(null===(a=t.position)||void 0===a?void 0:a.x)||0),this.getObjectByName("terrain").add(e)}}}));for(let e in this.models)this.add(this.models[e]);this._defaultRenderer.shadowMap.needsUpdate=!0}set mapSize(e){if(this._mapSize=e,this._defaultLights.children[1].position.set(0,200,this._mapSize/2),this._defaultControls.target=new n.Vector3(this._mapSize/2,0,this._mapSize/2),this.debug){this.remove(this.getObjectByName("grid"));const e=new n.GridHelper(this._mapSize,this._mapSize);e.name="grid",e.position.set(this._mapSize/2-.5,.1,this._mapSize/2-.5),this.add(e)}}}t.aoeGame=c},733:function(e,t,i){var a=this&&this.__awaiter||function(e,t,i,a){return new(i||(i=Promise))((function(s,n){function o(e){try{l(a.next(e))}catch(e){n(e)}}function r(e){try{l(a.throw(e))}catch(e){n(e)}}function l(e){var t;e.done?s(e.value):(t=e.value,t instanceof i?t:new i((function(e){e(t)}))).then(o,r)}l((a=a.apply(e,t||[])).next())}))};Object.defineProperty(t,"__esModule",{value:!0}),t.makeInstanceAsset=t.makeDebugObject=t.terrain=t.loadMapData=void 0;const s=i(212),n=i(217),o=i(764);function r(e,t){return Math.max(Math.min(e,t),0)}t.loadMapData=function(e){return a(this,void 0,void 0,(function*(){return(yield fetch(e)).json()}))};class l extends s.Mesh{constructor(e){super(),this.tiles=[],this.elevationScale=.3,this.mapVertices=[],this.mapUVs=[],this.geometry=new s.BufferGeometry;const t=(new s.TextureLoader).load("assets/materials/g_m14_00_color.png");t.offset=new s.Vector2(.5,.5),t.repeat.set(.1,.1),t.wrapS=s.RepeatWrapping,t.wrapT=s.RepeatWrapping,this.material=new s.MeshStandardMaterial({map:t,side:s.DoubleSide}),this.frustumCulled=!1,this.receiveShadow=!0,this.name="terrain",this.assignGeometry(e)}assignGeometry(e){var t,i,a,n,o,l,h,d,u,c,m;const f=120;this.tiles=Array(f).fill(f).map((e=>Array(f))),e.forEach((e=>this.tiles[e.position.x][e.position.y]=e));let p=Array(121).fill(121).map((e=>Array(121)));for(let e=0;e<p.length;e++)for(let t=0;t<p.length;t++)p[e][t]=Math.max(this.tiles[r(e,119)][r(t,119)].elevation,this.tiles[r(e-1,119)][r(t,119)].elevation,this.tiles[r(e-1,119)][r(t-1,119)].elevation,this.tiles[r(e,119)][r(t-1,119)].elevation);for(let e=0;e<this.tiles.length;e++)for(let r=0;r<this.tiles.length;r++){const f=[p[e+1][r]*this.elevationScale,p[e][r]*this.elevationScale,p[e][r+1]*this.elevationScale,p[e+1][r+1]*this.elevationScale];this.tiles[e][r].triangles=[];const w=f.reduce(((e,t)=>e+t))/this.elevationScale-4*this.tiles[e][r].elevation;1===w?(this.tiles[e][r].actualElevation=this.tiles[e][r].elevation+.25,f[0]||f[2]?(null===(t=this.tiles[e][r].triangles)||void 0===t||t.push(new s.Triangle(new s.Vector3(r-.5,f[0],e+.5),new s.Vector3(r-.5,f[1],e-.5),new s.Vector3(r+.5,f[3],e+.5))),null===(i=this.tiles[e][r].triangles)||void 0===i||i.push(new s.Triangle(new s.Vector3(r-.5,f[1],e-.5),new s.Vector3(r+.5,f[2],e-.5),new s.Vector3(r+.5,f[3],e+.5)))):(null===(a=this.tiles[e][r].triangles)||void 0===a||a.push(new s.Triangle(new s.Vector3(r-.5,f[0],e+.5),new s.Vector3(r-.5,f[1],e-.5),new s.Vector3(r+.5,f[2],e-.5))),null===(n=this.tiles[e][r].triangles)||void 0===n||n.push(new s.Triangle(new s.Vector3(r-.5,f[0],e+.5),new s.Vector3(r+.5,f[2],e-.5),new s.Vector3(r+.5,f[3],e+.5))))):3===w?(this.tiles[e][r].actualElevation=this.tiles[e][r].elevation+.75,f[0]&&f[2]?(null===(h=this.tiles[e][r].triangles)||void 0===h||h.push(new s.Triangle(new s.Vector3(r-.5,f[0],e+.5),new s.Vector3(r-.5,f[1],e-.5),new s.Vector3(r+.5,f[2],e-.5))),null===(d=this.tiles[e][r].triangles)||void 0===d||d.push(new s.Triangle(new s.Vector3(r-.5,f[0],e+.5),new s.Vector3(r+.5,f[2],e-.5),new s.Vector3(r+.5,f[3],e+.5)))):(null===(o=this.tiles[e][r].triangles)||void 0===o||o.push(new s.Triangle(new s.Vector3(r-.5,f[0],e+.5),new s.Vector3(r-.5,f[1],e-.5),new s.Vector3(r+.5,f[3],e+.5))),null===(l=this.tiles[e][r].triangles)||void 0===l||l.push(new s.Triangle(new s.Vector3(r-.5,f[1],e-.5),new s.Vector3(r+.5,f[2],e-.5),new s.Vector3(r+.5,f[3],e+.5))))):(this.tiles[e][r].actualElevation=2==w?this.tiles[e][r].elevation+.5:this.tiles[e][r].elevation+0,null===(u=this.tiles[e][r].triangles)||void 0===u||u.push(new s.Triangle(new s.Vector3(r-.5,f[0],e+.5),new s.Vector3(r-.5,f[1],e-.5),new s.Vector3(r+.5,f[3],e+.5))),null===(c=this.tiles[e][r].triangles)||void 0===c||c.push(new s.Triangle(new s.Vector3(r-.5,f[1],e-.5),new s.Vector3(r+.5,f[2],e-.5),new s.Vector3(r+.5,f[3],e+.5)))),null===(m=this.tiles[e][r].triangles)||void 0===m||m.forEach((e=>{this.mapVertices.push(...e.a.toArray(),...e.b.toArray(),...e.c.toArray()),this.mapUVs.push(e.a.toArray()[0],e.a.toArray()[2],e.b.toArray()[0],e.b.toArray()[2],e.c.toArray()[0],e.c.toArray()[2])}))}this.geometry.setAttribute("position",new s.BufferAttribute(new Float32Array(this.mapVertices),3)),this.geometry.setAttribute("uv",new s.BufferAttribute(new Float32Array(this.mapUVs),2)),this.geometry.computeVertexNormals(),this.geometry.attributes.position.needsUpdate=!0}}t.terrain=l,t.makeDebugObject=function(e,t){const i=t;i.className="label",i.textContent="Earth",i.style.marginTop="-1em";const a=new o.CSS2DObject(i);return a.position.set(0,1,0),a},t.makeInstanceAsset=function(e,t){return a(this,void 0,void 0,(function*(){const i=new n.GLTFLoader,a=yield i.loadAsync(e),o=new s.Group;return a.scene.traverse((e=>{if(e instanceof s.Mesh){const i=new s.InstancedMesh(e.geometry,e.material,t);i.name=e.name,o.add(i)}})),o}))}},287:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.resolveModelPaths=t.modelPaths=void 0,t.modelPaths={rootPath:"assets/objects/","Gold Mine":"gaia/gold.glb","Stone Mine":"gaia/stone.glb",Relic:"gaia/relic.glb","Fruit Bush":"gaia/berry_bush.glb",Tree:"gaia/mapletree/mapletree.glb","Tree (Palm Forest)":"Tree","Tree (Dragon)":"Tree","Tree (Reeds)":"Tree",boar:"gaia/boar.glb",deer:"boar",javelina:"boar",Elephant:"boar",Ostrich:"boar",Zebra:"boar",rhino:"boar",ibex:"boar","iron boar":"boar",sheep:"gaia/sheep.glb",turkey:"sheep",llama:"sheep",Goat:"sheep",pig:"sheep",goose:"sheep",cow:"sheep",water_buffalo:"sheep"},t.resolveModelPaths=function e(i){if(!i)throw new Error("model name not defined");if(new RegExp(/\..*$/).test(t.modelPaths[i]))return t.modelPaths.rootPath+t.modelPaths[i];if(i in t.modelPaths)return e(t.modelPaths[i]);throw new Error("model "+i+" not found/implemented")}}},i={};function a(e){var s=i[e];if(void 0!==s)return s.exports;var n=i[e]={exports:{}};return t[e].call(n.exports,n,n.exports,a),n.exports}a.m=t,e=[],a.O=(t,i,s,n)=>{if(!i){var o=1/0;for(d=0;d<e.length;d++){for(var[i,s,n]=e[d],r=!0,l=0;l<i.length;l++)(!1&n||o>=n)&&Object.keys(a.O).every((e=>a.O[e](i[l])))?i.splice(l--,1):(r=!1,n<o&&(o=n));if(r){e.splice(d--,1);var h=s();void 0!==h&&(t=h)}}return t}n=n||0;for(var d=e.length;d>0&&e[d-1][2]>n;d--)e[d]=e[d-1];e[d]=[i,s,n]},a.d=(e,t)=>{for(var i in t)a.o(t,i)&&!a.o(e,i)&&Object.defineProperty(e,i,{enumerable:!0,get:t[i]})},a.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t),a.r=e=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},(()=>{var e={179:0};a.O.j=t=>0===e[t];var t=(t,i)=>{var s,n,[o,r,l]=i,h=0;if(o.some((t=>0!==e[t]))){for(s in r)a.o(r,s)&&(a.m[s]=r[s]);if(l)var d=l(a)}for(t&&t(i);h<o.length;h++)n=o[h],a.o(e,n)&&e[n]&&e[n][0](),e[n]=0;return a.O(d)},i=self.webpackChunkwebaoe=self.webpackChunkwebaoe||[];i.forEach(t.bind(null,0)),i.push=t.bind(null,i.push.bind(i))})();var s=a.O(void 0,[285],(()=>a(686)));s=a.O(s)})();