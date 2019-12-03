import { Tower } from "../units/towers/Tower";
import { Gameplay } from "../scenes/Gameplay";
import { BaseSprite } from "../base/BaseSprite";

export class GhostTower extends BaseSprite{
    constructor(scene : Gameplay,x,y, physicsGroup){
        super(scene,x,y,"ghostTower",physicsGroup)
        this.on(
            "animationcomplete",
            function(anim, frame) {
              this.emit("animationcomplete_" + anim.key, anim, frame);
            },
            this
          );
          this.on(
            "animationcomplete_invalid-tower-pos",
            function() {
              this.anims.play("idle-" + this.texture.key);
            },
            this
          );
    }
}