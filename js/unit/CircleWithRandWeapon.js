import {
    RandWeapon
} from "../weapon/RandWeapon";
import {
    rotateWeaponToUnit
} from "../rotation";
import {
    Circle
} from "./Circle";
import {debugModus} from "../config"

export class CircleWithRandWeapon extends Circle {
    constructor(scene, x, y, texture, physicsGroup, weaponGroup) {
        super(scene, x, y, texture, physicsGroup);
        this.weapon = new RandWeapon(scene, x + 30, y - 30, weaponGroup);
        this.weaponGroup = weaponGroup;

        if (debugModus) this.graphics = scene.add.graphics({
            fillStyle: {
                color: 0xFF00FF
            }
        });
    }
    
    attack() {
        //TODO: cancel sound before playing new (also for damage)
        //this.scene.sound.play("hit")
        if (!this.weapon.attacking) {
            this.weapon.attacking = true;
            this.weapon.anims.play("attack");
        }
    }

    draw() {
        this.graphics.clear()
        this.weapon.polygon.draw(this.graphics, this.scene.polygonOffset)
        this.polygon.draw(this.graphics, this.scene.polygonOffset)
    }

    preUpdate(time, delta) {
        super.preUpdate(time, delta);
        rotateWeaponToUnit(this);

        if (debugModus) this.draw()
    }

    destroy() {
        super.destroy();
        this.weapon.destroy();
    }
}