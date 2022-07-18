import { Scene } from "three";
import { aoeInputData } from "./loaders";
import { GUI } from "dat.gui";
export declare class aoeGame extends Scene {
    protected debug: boolean;
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
    constructor(debug?: boolean);
    protected onWindowResize(): void;
    animate(): void;
    loadMap(mapFile: string): Promise<aoeInputData>;
    loadTerrain(): void;
    preloadGaia(): Promise<void[]>;
    loadGaia(): void;
    protected set mapSize(newSize: number);
}
