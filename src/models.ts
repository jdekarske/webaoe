// if you use the assets as provided by the library, the following will provide paths to the models
// hosted on github or your server.
// if the value isnt a filepath, it is the name of a unit that has a filepath
// it is not confirmed that the keys are correct as they are scraped from a recording.

import { Mesh, Object3D } from "three"

// note that really only the defaults are modeled. Please help with more :)
export const modelPaths: { [key: string]: string } = {
    "rootPath": "assets/objects/",

    // resources
    "Gold Mine": "gaia/gold.glb",
    "Stone Mine": "gaia/stone.glb",
    "Relic": "gaia/relic.glb",
    "Fruit Bush": "gaia/berry_bush.glb",
    "Tree": "gaia/mapletree/mapletree.glb",
    "Tree (Palm Forest)": "Tree",
    "Tree (Dragon)": "Tree",
    "Tree (Reeds)": "Tree",

    //huntables
    "boar": "gaia/boar.glb",
    "deer": "boar",

    "javelina": "boar",

    "Elephant": "boar",
    "Ostrich": "boar",
    "Zebra": "boar",

    "rhino": "boar",

    "ibex": "boar",
    "iron boar": "boar",

    // herdables
    "sheep": "gaia/sheep.glb",
    "turkey": "sheep",
    "llama": "sheep",
    "Goat": "sheep",
    "pig": "sheep",
    "goose": "sheep",
    "cow": "sheep",
    "water_buffalo": "sheep",

    // buildings
}

export interface ModelCache {
    [key: string]: Object3D;
}

export function resolveModelPaths(modelName: string): string {
    //check if we have a file name
    if (!modelName) throw new Error("model name not defined")
    const regexp = new RegExp(/\..*$/)
    if (regexp.test(modelPaths[modelName])) {
        return modelPaths["rootPath"] + modelPaths[modelName]
    } else if (!(modelName in modelPaths)) {
        throw new Error("model " + modelName + " not found/implemented")
    } else {
        return resolveModelPaths(modelPaths[modelName]);
    }
}