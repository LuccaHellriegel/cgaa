import {Circle} from "./Circle"
import { Weapon } from "../weapons/Weapon";
import { ChainWeapon } from "../weapons/ChainWeapon";
import { RandWeapon } from "../weapons/RandWeapon";
export class CircleWithWeapon extends Circle {
    weapon: Weapon;

    constructor(scene, x, y, texture, physicsGroup, weapon) {
        super(scene, x, y, texture, physicsGroup)
        this.weapon = weapon
    }

    attack() {
        //TODO: cancel sound before playing new (also for damage)
        //this.scene.sound.play("hit")
        if (!this.weapon.attacking) {
            this.weapon.attacking = true;
            this.weapon.anims.play("attack-"+this.weapon.texture.key);
        }
    }

    rotateWeaponAroundCircle(){
        let point = Phaser.Math.RotateAround(new Phaser.Geom.Point(this.x + this.weapon.unitOffSetX, this.y + this.weapon.unitOffSetY), this.x, this.y, this.rotation)
        this.weapon.setPosition(point.x, point.y)
        this.weapon.setRotation(this.rotation)
    }

    destroy() {
        super.destroy();
        this.weapon.destroy();
    }

    preUpdate(time, delta) {
        super.preUpdate(time, delta);
        this.rotateWeaponAroundCircle()
    }

    draw() {
        super.draw()
        this.weapon.polygon.draw(this.graphics, this.scene.polygonOffset)
    }

    static withChainWeapon(scene, x,y,texture, physicsGroup, weaponGroup){
        return new this(scene, x, y, texture, physicsGroup, new ChainWeapon(scene, x, y, weaponGroup,5,2))
    }

    static withRandWeapon(scene, x,y,texture, physicsGroup, weaponGroup){
        return new this(scene, x, y, texture, physicsGroup, new RandWeapon(scene, x , y, weaponGroup))
    }
}

