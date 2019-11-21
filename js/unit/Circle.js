import { CirclePolygon } from "../polygon/CirclePolygon";
import { HealthBar } from "../ui/HealthBar";
import { Unit } from "./Unit";
export class Circle extends Unit {
    constructor(scene, x, y, texture, physicsGroup) {
        //TODO: add radius here
        super(scene, x, y, texture, physicsGroup);
        this.healthbar = new HealthBar(scene, x - 26, y - 38, 46, 12);
        this.polygon = new CirclePolygon(x, y, 30);
        this.setCircle(30);
        this.setupAnimEvents()
    }

    setupAnimEvents(){
        this.on('animationcomplete', function (anim, frame) {
            this.emit('animationcomplete_' + anim.key, anim, frame);
        }, this);
        this.on('animationcomplete_damage', function () {
            this.anims.play('idle-'+this.texture.key);
        }, this);
    }
    
    damage(amount) {
        this.anims.play("damage-"+this.texture.key);
        //this.scene.sound.play("damage");
        if (this.healthbar.decrease(amount)) {
            if (this === this.scene.player) {
                this.scene.player.healthbar.value = 100;
            }
            else {
                this.destroy();
            }
        }
    }
    destroy() {
        super.destroy();
        this.healthbar.destroy();
    }
    preUpdate(time, delta) {
        super.preUpdate(time, delta);
        this.healthbar.move(this.x - 26, this.y - 38);
        //TODO: make radius as option
        this.polygon.setPosition(this.x,this.y)
    }
}
