import {
    CircleWithRandWeapon
} from "./unit";
class Player extends CircleWithRandWeapon {
    constructor(scene){
        super(scene, 100, 450, "blueCircle",  
        scene.physics.add.group(), scene.physics.add.group())
    }
}

module.exports = {
    Player
}