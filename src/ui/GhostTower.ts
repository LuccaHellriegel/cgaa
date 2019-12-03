import { Tower } from "../units/towers/Tower";
import { Gameplay } from "../scenes/Gameplay";

export class GhostTower extends Tower{
    constructor(scene : Gameplay,x,y, physicsGroup){
        super(scene,x,y,physicsGroup)
        this.setTexture("ghostTower")
    }
}