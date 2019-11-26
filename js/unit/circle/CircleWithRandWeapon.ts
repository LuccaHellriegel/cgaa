import {
    RandWeapon
} from "../../weapon/RandWeapon";
import {debugModus} from "../../app/config"
import { CircleWithWeapon } from "./CircleWithWeapon";

export class CircleWithRandWeapon extends CircleWithWeapon {
    constructor(scene, x, y, texture, physicsGroup, weaponGroup) {
        super(scene, x, y, texture, physicsGroup, new RandWeapon(scene, x , y, weaponGroup));      
    }   
}