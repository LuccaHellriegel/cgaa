import { preloadFunc } from "./preload";
import { createFunc } from "./create";
import { updateFunc } from "./update";

//TODO: useless *Func to {create:create}
export class Gameplay extends Phaser.Scene {
    
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