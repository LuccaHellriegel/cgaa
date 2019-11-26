import Phaser from "phaser";
import {
    gameConfig
} from "./app/config";
import { Gameplay } from "./scenes/Gameplay";
import { HUD } from "./scenes/HUD";

function makeGame(){
    let gameConfigWithScene = gameConfig
    gameConfigWithScene.scene = [ Gameplay, HUD ]
    
    let game = new Phaser.Game(gameConfigWithScene);
}

makeGame()
