import { Object3D } from "three";
export declare const modelPaths: {
    [key: string]: string;
};
export interface ModelCache {
    [key: string]: Object3D;
}
export declare function resolveModelPaths(modelName: string): string;
