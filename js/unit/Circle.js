import {
    CirclePolygon
} from "../polygon/CirclePolygon";
import {
    HealthBar
} from "./HealthBar";
import {
    Unit
} from "./Unit";
export class Circle extends Unit {
    constructor(scene, x, y, texture, physicsGroup) {
        //TODO: add radius here
        super(scene, x, y, texture, physicsGroup);
        this.healthbar = new HealthBar(scene, x - 26, y - 38, 46, 12);
        //TODO: polygon has a few pixel offset, screen offset?
        this.polygon = new CirclePolygon(x + scene.cameras.main.scrollX, y + scene.cameras.main.scrollY, 30);
        this.setCircle(30);
        this.setupAnimEvents()
    }

    setupAnimEvents() {
        this.on('animationcomplete', function (anim, frame) {
            this.emit('animationcomplete_' + anim.key, anim, frame);
        }, this);
        this.on('animationcomplete_damage-' + this.texture.key, function () {
            this.anims.play('idle-' + this.texture.key);
        }, this);
    }

    damage(amount) {
        this.anims.play("damage-" + this.texture.key);

        let isPlayer = this === this.scene.player

        if (isPlayer) {
            this.scene.events.emit("playerDamaged")

        } else if (this.healthbar.decrease(amount)) {

            this.destroy();
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
        this.polygon.setPosition(this.x, this.y)
    }
}