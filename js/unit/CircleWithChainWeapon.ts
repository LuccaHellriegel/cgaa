import {
    ChainWeapon
} from "../weapon/ChainWeapon";
import {normalCircleRadius} from "../graphic/generate"
import { CircleWithWeapon } from "./CircleWithWeapon";

//TODO: replace CircleWithXWeapon with static methods on CircleWithWeapon
export class CircleWithChainWeapon extends CircleWithWeapon {
    constructor(scene, x, y, texture, physicsGroup, weaponGroup) {

        super(scene, x, y, texture, physicsGroup, new ChainWeapon(scene, x, y, weaponGroup,5,2))
    }
}