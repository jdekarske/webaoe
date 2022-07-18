import { AmbientLight, AxesHelper, GridHelper, Group, InstancedMesh, Object3D, PerspectiveCamera, PointLight, Scene, sRGBEncoding, Vector3, WebGLRenderer } from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { CSS2DObject, CSS2DRenderer } from 'three/examples/jsm/renderers/CSS2DRenderer';

import { aoeInputData, aoeObject, loadMapData, makeInstanceAsset, terrain } from "./loaders";
import { ModelCache, resolveModelPaths } from "./models";

import Stats from 'stats.js';
import { GUI } from "dat.gui";

interface aoeGame_params {
    dom?: HTMLCanvasElement,
    debug?: boolean,
}

export class aoeGame extends Scene {
    // aoe relevant params
    public elevationScale = 0.3;
    protected _mapSize = 120;

    // scene defaults 
    private _defaultRenderer: WebGLRenderer;
    private _defaultLabelRenderer: CSS2DRenderer;
    private _defaultLights: Group;
    private _defaultCamera: PerspectiveCamera;
    private _defaultControls: OrbitControls;

    private models: ModelCache;
    private mapData: aoeInputData;

    // datgui
    public _datGUI: GUI;
    private _stats: Stats;

    protected debug = false;
    private _dom: HTMLCanvasElement;
    private _domParent: HTMLElement;

    constructor(params: aoeGame_params) {
        super()
        this._dom = params.dom || document.appendChild(document.createElement('canvas'))
        this._domParent = this._dom.parentElement!;
        this.debug = params.debug || false;

        this._defaultRenderer = new WebGLRenderer({ antialias: true, canvas: this._dom });
        this._defaultRenderer.setClearColor(0x000000, 0); // the default
        this._defaultRenderer.setPixelRatio(window.devicePixelRatio);
        this._defaultRenderer.outputEncoding = sRGBEncoding;
        this._defaultRenderer.shadowMap.enabled = true;
        this._defaultRenderer.shadowMap.autoUpdate = false;
        this._defaultRenderer.domElement = this._dom
        this._defaultRenderer.setSize(this._domParent.offsetWidth, this._domParent.offsetHeight);


        this._defaultLabelRenderer = new CSS2DRenderer({ element: this._dom });
        this._defaultLabelRenderer.setSize(this._domParent.offsetWidth, this._domParent.offsetHeight);
        this._defaultLabelRenderer.domElement.style.position = 'absolute';
        this._defaultLabelRenderer.domElement.style.top = '0px';

        window.addEventListener("resize", this.onWindowResize.bind(this), false);

        // if we are using the default scene, add everything (TODO we use the default by default for
        // now)
        let pointIntensity = 1;
        this._defaultLights = new Group();
        this._defaultLights.add(new AmbientLight(0x404040, 0.54)); // soft white light
        const plight = new PointLight(0xffffff, 1.0);
        plight.castShadow = true;
        this._defaultLights.add(plight);
        this.add(this._defaultLights);

        this._defaultCamera = new PerspectiveCamera(70, this._domParent.offsetWidth / this._domParent.offsetHeight, 0.01, 1000);
        this._defaultCamera.position.set(20, 30, 20);
        this.add(this._defaultCamera);

        this._defaultControls = new OrbitControls(this._defaultCamera, this._dom);
        this._defaultControls.target = new Vector3(this._mapSize / 2, 0, this._mapSize / 2);
        this._defaultControls.autoRotate = true;
        this._defaultControls.update()

        this._stats = new Stats();
        this._stats.dom.style.display = 'none'
        this._datGUI = new GUI();
        this._datGUI.hide()
        if (this.debug) {
            this._datGUI.show()
            this._datGUI.add(this._defaultLights.children[0], 'intensity', 0.0, 2.0);
            this._datGUI.add(this._defaultLights.children[1], 'intensity', 0.0, 2.0);
            this._stats.showPanel(0);
            this._stats.dom.style.display = 'block';
            document.body.appendChild(this._stats.dom);
        }

        const axesHelper = new AxesHelper(5);
        axesHelper.name = "axes"
        this.add(axesHelper);

        this.mapData = {} as aoeInputData;
        this.models = {} as ModelCache;

        this.mapSize = this._mapSize;
        this.animate();
    }

    protected onWindowResize(): void {
        this._defaultCamera.aspect = this._domParent.offsetWidth / this._domParent.offsetHeight;
        this._defaultCamera.updateProjectionMatrix();

        this._defaultRenderer.setSize(this._domParent.offsetWidth, this._domParent.offsetHeight);
        this._defaultLabelRenderer.setSize(this._domParent.offsetWidth, this._domParent.offsetHeight);
        this.animate();
    }

    public animate() {
        this._stats.begin();
        requestAnimationFrame(this.animate.bind(this));

        // required if controls.enableDamping or controls.autoRotate are set to true
        this._defaultControls.update();

        this._defaultRenderer.render(this, this._defaultCamera);
        if (!this.debug) {
            this._defaultLabelRenderer.render(this, this._defaultCamera);
        }
        this._stats.end();
    }

    public async loadMap(mapFile: string) {
        return this.mapData = await loadMapData(mapFile)
    }

    public loadTerrain() {
        const terrainMesh = new terrain(this.mapData.tiles!);
        this.add(terrainMesh);
    }

    public async preloadGaia() {
        let uniqueModels: aoeObject[] = [];
        this.mapData.gaia?.filter(function (item) {
            var i = uniqueModels.findIndex(x => (x.name == item.name));
            if (i <= -1) {
                let j = uniqueModels.push(item);
                uniqueModels[j - 1].count = 1;

            } else {
                uniqueModels[i].count! += 1;
            }
            return null;
        });

        // try and load the models for gaia objects
        let resolutionErrors: any = [];
        const allpromises = Promise.all(uniqueModels.map(async (model) => {
            let path;
            try {
                path = resolveModelPaths(model.name!)
            } catch (error) {
                resolutionErrors.push(error);
                return;
            }
            const modelGroup = await makeInstanceAsset(path, model.count!);
            this.models[model.name!] = modelGroup
            this.models[model.name!].userData.count = model.count;
        }))

        if (resolutionErrors.length > 0) {
            console.warn(resolutionErrors.join('\n'));
        }

        return allpromises
    }

    public loadGaia() {
        // put all models in the right spots
        const dummy = new Object3D();
        this.mapData.gaia!.forEach(element => {
            if (!element.name) return;
            if (!this.models) throw new Error("preload gaia first. try `.preloadGaia.then(...)`")
            if (element.name in this.models) {
                const elevation = (this.getObjectByName("terrain")! as terrain).tiles[element.position!.x - 0.5][element.position!.y - 0.5].actualElevation;
                dummy.rotation.set(0, Math.random() * Math.PI * 2, 0);
                dummy.position.set(element.position!.y - 0.5, elevation * this.elevationScale, element.position!.x - 0.5); // TODO um this is backwards?
                dummy.updateMatrix();

                const tiles = (this.getObjectByName("terrain")! as terrain).tiles;
                //get the relevant group
                this.models[element.name].children.forEach(meshObject => {
                    (meshObject as InstancedMesh).setMatrixAt(this.models[element.name!].userData.count! - 1, dummy.matrix);
                    (meshObject as InstancedMesh).instanceMatrix.needsUpdate = true;
                    // (meshObject as InstancedMesh).frustumCulled = true;
                    (meshObject as InstancedMesh).castShadow = true;
                })

                this.models[element.name!].userData.count! -= 1;
            } else if (this.debug) {
                const debugLabel = new CSS2DObject(document.createElement('div'));
                debugLabel.element.textContent = element.name.slice(0, 5) || '<>';
                debugLabel.position.set(element.position?.y || 0, 0.5, element.position?.x || 0);
                this.getObjectByName("terrain")!.add(debugLabel); // has to be a mesh?
            }
        });

        for (let key in this.models) {
            this.add(this.models[key]);
        }
        this._defaultRenderer.shadowMap.needsUpdate = true;
    }

    protected set mapSize(newSize: number) {
        this._mapSize = newSize;

        this._defaultLights.children[1].position.set(0, 200, this._mapSize / 2);
        this._defaultControls.target = new Vector3(this._mapSize / 2, 0, this._mapSize / 2);

        if (this.debug) {
            this.remove(this.getObjectByName("grid")!);
            const gridHelper = new GridHelper(this._mapSize, this._mapSize);
            gridHelper.name = "grid";
            gridHelper.position.set(this._mapSize / 2 - 0.5, 0.1, this._mapSize / 2 - 0.5);
            this.add(gridHelper);
        }
    }
}
