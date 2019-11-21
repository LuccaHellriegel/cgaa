import { RandWeapon } from "../weapon/RandWeapon";
import { rotateWeaponToUnit } from "../rotation";
import { Circle } from "./Circle";
export class CircleWithRandWeapon extends Circle {
    constructor(scene, x, y, texture, physicsGroup, weaponGroup) {
        super(scene, x, y, texture, physicsGroup);
        this.weapon = new RandWeapon(scene, x + 30, y - 30, weaponGroup);
        this.weaponGroup = weaponGroup;
    }
    attack() {
        //TODO: cancel sound before playing new (also for damage)
        //this.scene.sound.play("hit")
        if (!this.weapon.attacking) {
            this.weapon.attacking = true;
            this.weapon.anims.play("attack");
        }
    }
    preUpdate(time, delta) {
        super.preUpdate(time, delta);
        rotateWeaponToUnit(this);
    }
    destroy() {
        super.destroy();
        this.weapon.destroy();
    }
}
