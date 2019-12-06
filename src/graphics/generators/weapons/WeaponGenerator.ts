import { Generator } from "../Generator";
import { Gameplay } from "../../../scenes/Gameplay";

export abstract class WeaponGenerator extends Generator {
    tempWeaponGroup: Phaser.Physics.Arcade.Group;
    biggerThanWeapon: number;

    constructor(hexColor: number, scene: Gameplay, ) {
        super(hexColor, scene)   
        this.tempWeaponGroup = scene.physics.add.group();
        this.biggerThanWeapon = 300

    }

    destroyUsedObjects(){
        super.destroyUsedObjects()
        this.tempWeaponGroup.destroy()
    }
}