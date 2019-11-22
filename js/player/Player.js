import {
    CircleWithRandWeapon
} from "../unit/CircleWithRandWeapon";
export class Player extends CircleWithRandWeapon {
    constructor(scene){
        super(scene, 100, 450, "blueCircle",  
        scene.physics.add.group(), scene.physics.add.group())

        this.healthbar.destroy()
        //this.healthbar = new HealthBar(scene, this.x+this.healthBarXWrtScreen, this.y+this.healthBarYWrtScreen, 46, 12);
    }
   
    rotatePlayerTowardsMouse(pointer){
        let mainCamera = this.scene.cameras.main
        let scrollX = mainCamera.scrollX
        let scrollY = mainCamera.scrollY
        let rotation = Phaser.Math.Angle.Between(this.x, this.y, pointer.x + scrollX, pointer.y + scrollY)
        
        let correctionForPhasersMinus90DegreeTopPostion = (Math.PI / 180) * 90
        this.setRotation(rotation + correctionForPhasersMinus90DegreeTopPostion)
    }

    preUpdate(time, delta) {
        super.preUpdate(time, delta);
        //TODO: better solution than setting twice
        this.healthbar.destroy()
    }
}
