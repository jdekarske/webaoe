import { aoeGame } from "../src/index";

const gameScene = new aoeGame({ dom: (document.querySelector('#app') as HTMLCanvasElement) });

gameScene.loadMap("assets/mapexample.json").then(() => {
    gameScene.loadTerrain();
    gameScene.preloadGaia().then(() => {
        gameScene.loadGaia();
    })
})
