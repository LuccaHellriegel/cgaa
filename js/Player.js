import {
    CircleWithRandWeapon
} from "./unit/CircleWithRandWeapon";
export class Player extends CircleWithRandWeapon {
    constructor(scene){
        super(scene, 100, 450, "blueCircle",  
        scene.physics.add.group(), scene.physics.add.group())
    }
}
