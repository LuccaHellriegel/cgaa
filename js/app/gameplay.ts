import { preloadFunc } from "./preload";
import { createFunc } from "./create";
import { updateFunc } from "./update";
import {Player} from "../player/Player";
import {PlayerMovement} from "../player/PlayerMovement";

//TODO: useless *Func to {create:create}
export class Gameplay extends Phaser.Scene {
    player: Player;
    enemies: any[];
    playerMovement: PlayerMovement;
    polygonOffset: number;
    
    constructor ()
    {
        super('Gameplay');
    }

    preload(){
        preloadFunc(this)
    }
    
    create(){
        createFunc(this)
    }

    update(){
        updateFunc(this)
    }

}