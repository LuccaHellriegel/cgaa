import damage from "../../assets/audio/damage.mp3";
import hit from "../../assets/audio/hit.mp3";
import step from "../../assets/audio/step.mp3";
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
        this.load.audio("damage", damage);
        this.load.audio("hit", hit);
        this.load.audio("step", step);
    }
    
    create(){
        createFunc(this)
    }

    update(){
        updateFunc(this)
    }

}