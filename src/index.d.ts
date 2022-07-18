import { Scene } from "three";
import { aoeInputData } from "./loaders";
import { GUI } from "dat.gui";
interface aoeGame_params {
    dom?: HTMLCanvasElement;
    debug?: boolean;
}
export declare class aoeGame extends Scene {
    elevationScale: number;
    protected _mapSize: number;
    private _defaultRenderer;
    private _defaultLabelRenderer;
    private _defaultLights;
    private _defaultCamera;
    private _defaultControls;
    private models;
    private mapData;
    _datGUI: GUI;
    private _stats;
    protected debug: boolean;
    private _dom;
    private _domParent;
    constructor(params: aoeGame_params);
    protected onWindowResize(): void;
    animate(): void;
    loadMap(mapFile: string): Promise<aoeInputData>;
    loadTerrain(): void;
    preloadGaia(): Promise<void[]>;
    loadGaia(): void;
    protected set mapSize(newSize: number);
}
export {};
