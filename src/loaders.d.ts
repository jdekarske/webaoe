import { Mesh, Triangle, Group } from "three";
import { CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer.js';
export interface aoeTile {
    elevation: number;
    actualElevation: number;
    position: {
        x: number;
        y: number;
    };
    terrain?: number;
    quadVertices?: number[];
    triangles?: Triangle[];
}
export interface aoeObject {
    name?: string;
    class_id?: number;
    object_id?: number;
    instance_id?: number;
    index?: number;
    position?: {
        x: number;
        y: number;
    };
    count?: number;
}
export interface aoeInputData {
    tiles?: aoeTile[];
    gaia?: aoeObject[];
}
export declare function loadMapData(filepath: string): Promise<aoeInputData>;
export declare class terrain extends Mesh {
    private mapUVs;
    tiles: aoeTile[][];
    private mapVertices;
    private elevationScale;
    constructor(inputtiles: aoeTile[]);
    private assignGeometry;
}
export declare function makeDebugObject(inputObject: aoeObject, inputElement: HTMLElement): CSS2DObject;
export declare function makeInstanceAsset(url: string, count: number): Promise<Group>;
