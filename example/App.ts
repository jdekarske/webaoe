import { aoeGame } from "../src/index";

const gameScene = new aoeGame();

gameScene.loadMap("assets/mapexample.json").then(() => {
    gameScene.loadTerrain();
    gameScene.preloadGaia().then(() => {
        gameScene.loadGaia();
    })
})
