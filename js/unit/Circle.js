import {
    CirclePolygon
} from "../polygon/CirclePolygon";
import {
    Unit
} from "./Unit";
import {
    normalCircleRadius
} from "../graphic/generate"
import {
    debugModus
} from "../app/config"
export class Circle extends Unit {
    constructor(scene, x, y, texture, physicsGroup) {
        super(scene, x, y, texture, physicsGroup);
        //TODO: polygon has a few pixel offset, screen offset?
        this.polygon = new CirclePolygon(x + scene.cameras.main.scrollX, y + scene.cameras.main.scrollY, normalCircleRadius);
        this.setCircle(normalCircleRadius);
        this.setupAnimEvents()

        if (debugModus) this.graphics = scene.add.graphics({
            fillStyle: {
                color: 0xFF00FF
            }
        });

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
        }
    }

    preUpdate(time, delta) {
        super.preUpdate(time, delta);
        //TODO: make radius as option
        this.polygon.setPosition(this.x, this.y)

        if (debugModus) this.draw()

    }

    draw() {
        this.graphics.clear()
        this.polygon.draw(this.graphics, this.scene.polygonOffset)
    }
}