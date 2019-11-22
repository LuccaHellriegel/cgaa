import Phaser from "phaser";
import {
    gameConfig
} from "./app/config";
import { Gameplay } from "./app/gameplay";
import { HUD } from "./ui/hud";

function makeGame(){
    let gameConfigWithScene = gameConfig
    gameConfigWithScene.scene = [ Gameplay, HUD ]
    
    let game = new Phaser.Game(gameConfigWithScene);
}

makeGame()


