import { Mesh, BufferAttribute, BufferGeometry, Triangle, Vector3, MeshNormalMaterial, DoubleSide, FileLoader, TextureLoader, Vector2, RepeatWrapping, MeshStandardMaterial, InstancedMesh, MeshBasicMaterial, Object3D, Group } from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader"
import { CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer.js';

const ELEVATION_SCALE = 0.3;

// {"elevation": 0, "position": {"x": 119, "y": 119}, "terrain": 14}
export interface aoeTile {
    elevation: number;
    actualElevation: number; // adjusted so units can be on slopes
    position: {
        x: number;
        y: number;
    };
    terrain?: number;
    quadVertices?: number[]; // starting upper left counter clockwise
    triangles?: Triangle[]; // make sure that  the normals are in the right direction
}

export interface aoeObject {
    name?: string,
    class_id?: number,
    object_id?: number,
    instance_id?: number,
    index?: number,
    position?: {
        x: number,
        y: number,
    }
    count?: number,
}

export interface aoeInputData {
    tiles?: aoeTile[],
    gaia?: aoeObject[],
}

function constrain(num: number, limit: number) {
    return Math.max(Math.min(num, limit), 0);
}

export async function loadMapData(filepath: string): Promise<aoeInputData> {
    const response = await fetch(filepath)
    const mapData = response.json() as aoeInputData;
    return mapData
}

export class terrain extends Mesh {
    private mapUVs: number[];
    public tiles: aoeTile[][] = [];
    private mapVertices: number[];
    private elevationScale = ELEVATION_SCALE;
    constructor(inputtiles: aoeTile[]) {
        super();

        this.mapVertices = [];
        this.mapUVs = [];
        this.geometry = new BufferGeometry();

        // this.material = new MeshPhongMaterial({ "color": "khaki" });
        // this.material = new MeshLambertMaterial();
        // this.material = new MeshNormalMaterial({ side: DoubleSide });

        // const texture = new TextureLoader().load('assets/materials/uv.png');
        // texture.offset = new Vector2(0.063, 0.063) // because the origin is in the middle of the tile
        // texture.repeat.set(0.125, 0.125);

        const texture = new TextureLoader().load('assets/materials/g_m14_00_color.png');
        texture.offset = new Vector2(0.5, 0.5) // because the origin is in the middle of the tile
        texture.repeat.set(0.1, 0.1); // looks better but could be about 1 I think
        texture.wrapS = RepeatWrapping;
        texture.wrapT = RepeatWrapping;

        this.material = new MeshStandardMaterial({ map: texture, side: DoubleSide });

        this.frustumCulled = false;
        this.receiveShadow = true;
        this.name = "terrain";
        this.assignGeometry(inputtiles);
    }

    private assignGeometry(inputtiles: aoeTile[]) {

        // assign the input to a 2d array because it is easier to work with
        const dim = 120;
        this.tiles = Array(dim).fill(dim).map(entry => Array(dim));
        inputtiles.forEach(tile => this.tiles[tile.position.x][tile.position.y] = tile);

        // set the vertex elevation to the max of the neighbor elevations
        let vertices = Array(dim + 1).fill(dim + 1).map(entry => Array(dim + 1));
        for (let row = 0; row < vertices.length; row++) {
            for (let col = 0; col < vertices.length; col++) {
                vertices[row][col] = Math.max(
                    this.tiles[constrain(row, dim - 1)][constrain(col, dim - 1)].elevation,
                    this.tiles[constrain(row - 1, dim - 1)][constrain(col, dim - 1)].elevation,
                    this.tiles[constrain(row - 1, dim - 1)][constrain(col - 1, dim - 1)].elevation,
                    this.tiles[constrain(row, dim - 1)][constrain(col - 1, dim - 1)].elevation,
                )
            }
        }

        // assign the relevant vertices to each tile
        // vertices start upper left, counterclockwise
        for (let row = 0; row < this.tiles.length; row++) {
            for (let col = 0; col < this.tiles.length; col++) {
                const quadVertices = [
                    vertices[row + 1][col] * this.elevationScale,
                    vertices[row][col] * this.elevationScale,
                    vertices[row][col + 1] * this.elevationScale,
                    vertices[row + 1][col + 1] * this.elevationScale
                ]

                this.tiles[row][col].triangles = [];
                const vertexSum = quadVertices.reduce((a, b) => a + b) / this.elevationScale - 4 * this.tiles[row][col].elevation;

                // one up corner
                if (vertexSum === 1) {
                    this.tiles[row][col].actualElevation = this.tiles[row][col].elevation + 0.25;
                    if (quadVertices[0] || quadVertices[2]) { // use forward slash
                        this.tiles[row][col].triangles?.push(new Triangle(
                            new Vector3(col - 0.5, quadVertices[0], row + 0.5),
                            new Vector3(col - 0.5, quadVertices[1], row - 0.5),
                            new Vector3(col + 0.5, quadVertices[3], row + 0.5)
                        ))

                        this.tiles[row][col].triangles?.push(new Triangle(
                            new Vector3(col - 0.5, quadVertices[1], row - 0.5),
                            new Vector3(col + 0.5, quadVertices[2], row - 0.5),
                            new Vector3(col + 0.5, quadVertices[3], row + 0.5)
                        ))
                    } else { // backslash
                        this.tiles[row][col].triangles?.push(new Triangle(
                            new Vector3(col - 0.5, quadVertices[0], row + 0.5),
                            new Vector3(col - 0.5, quadVertices[1], row - 0.5),
                            new Vector3(col + 0.5, quadVertices[2], row - 0.5)
                        ))

                        this.tiles[row][col].triangles?.push(new Triangle(
                            new Vector3(col - 0.5, quadVertices[0], row + 0.5),
                            new Vector3(col + 0.5, quadVertices[2], row - 0.5),
                            new Vector3(col + 0.5, quadVertices[3], row + 0.5)
                        ))
                    }
                } else if (vertexSum === 3) { // three up corner
                    this.tiles[row][col].actualElevation = this.tiles[row][col].elevation + 0.75;
                    if (!quadVertices[0] || !quadVertices[2]) { // use forward slash
                        this.tiles[row][col].triangles?.push(new Triangle(
                            new Vector3(col - 0.5, quadVertices[0], row + 0.5),
                            new Vector3(col - 0.5, quadVertices[1], row - 0.5),
                            new Vector3(col + 0.5, quadVertices[3], row + 0.5)
                        ))

                        this.tiles[row][col].triangles?.push(new Triangle(
                            new Vector3(col - 0.5, quadVertices[1], row - 0.5),
                            new Vector3(col + 0.5, quadVertices[2], row - 0.5),
                            new Vector3(col + 0.5, quadVertices[3], row + 0.5)
                        ))
                    } else { // backslash
                        this.tiles[row][col].triangles?.push(new Triangle(
                            new Vector3(col - 0.5, quadVertices[0], row + 0.5),
                            new Vector3(col - 0.5, quadVertices[1], row - 0.5),
                            new Vector3(col + 0.5, quadVertices[2], row - 0.5)
                        ))

                        this.tiles[row][col].triangles?.push(new Triangle(
                            new Vector3(col - 0.5, quadVertices[0], row + 0.5),
                            new Vector3(col + 0.5, quadVertices[2], row - 0.5),
                            new Vector3(col + 0.5, quadVertices[3], row + 0.5)
                        ))
                    }
                } else { // flat or ramp
                    if (vertexSum == 2) { // ramp
                        this.tiles[row][col].actualElevation = this.tiles[row][col].elevation + 0.5;
                    } else {
                        this.tiles[row][col].actualElevation = this.tiles[row][col].elevation + 0.0;
                    }
                    // use forward slash
                    this.tiles[row][col].triangles?.push(new Triangle(
                        new Vector3(col - 0.5, quadVertices[0], row + 0.5),
                        new Vector3(col - 0.5, quadVertices[1], row - 0.5),
                        new Vector3(col + 0.5, quadVertices[3], row + 0.5)
                    ))

                    this.tiles[row][col].triangles?.push(new Triangle(
                        new Vector3(col - 0.5, quadVertices[1], row - 0.5),
                        new Vector3(col + 0.5, quadVertices[2], row - 0.5),
                        new Vector3(col + 0.5, quadVertices[3], row + 0.5)
                    ))

                }
                // add vertices to buffer
                this.tiles[row][col].triangles?.forEach(element => {
                    this.mapVertices.push(...element.a.toArray(), ...element.b.toArray(), ...element.c.toArray());
                    this.mapUVs.push(element.a.toArray()[0], element.a.toArray()[2], element.b.toArray()[0], element.b.toArray()[2], element.c.toArray()[0], element.c.toArray()[2])
                })
            }
        }


        this.geometry.setAttribute('position', new BufferAttribute(new Float32Array(this.mapVertices), 3));
        this.geometry.setAttribute('uv', new BufferAttribute(new Float32Array(this.mapUVs), 2));
        this.geometry.computeVertexNormals();
        this.geometry.attributes.position.needsUpdate = true;
        // this.mesh.geometry.attributes.uv.needsUpdate = true;
    }
}

// TODO doesn't work :/
export function makeDebugObject(inputObject: aoeObject, inputElement: HTMLElement) {
    const earthDiv = inputElement;
    earthDiv.className = 'label';
    earthDiv.textContent = 'Earth';
    earthDiv.style.marginTop = '-1em';
    const earthLabel = new CSS2DObject(earthDiv);
    earthLabel.position.set(0, 1, 0);
    return earthLabel
}

export async function makeInstanceAsset(url: string, count: number): Promise<Group> {
    const loader = new GLTFLoader();
    const treeObject = await loader.loadAsync(url);
    const meshes = new Group();
    treeObject.scene.traverse(child => {
        if (child instanceof Mesh) {
            const imesh = new InstancedMesh(
                child.geometry,
                child.material,
                count
            )
            imesh.name = child.name;
            meshes.add(imesh);
        }
    })
    return meshes;
}
