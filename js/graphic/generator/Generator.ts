import { Gameplay } from "../../scenes/Gameplay";

export class Generator {
    graphics: Phaser.GameObjects.Graphics;
    scene: Gameplay;
    constructor(hexColor: number, scene: Gameplay){
        this.graphics = scene.add.graphics({
            fillStyle: {
                color: hexColor
            }
        });
        this.scene = scene
    }

    destroyUsedObjects(){
        this.graphics.destroy()
    }
}