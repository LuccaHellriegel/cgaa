import Phaser from "phaser";
import {
    gameConfig
} from "./config";
import { preload } from "./app/preload";
import { create } from "./app/create";
import { update } from "./app/update";

function makeGame(){
    let gameConfigWithScene = gameConfig
    gameConfigWithScene.scene = {
        preload: preload,
        create: create,
        update: update
    }
    
    let game = new Phaser.Game(gameConfigWithScene);
}

makeGame()


