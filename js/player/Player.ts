import {
    CircleWithChainWeapon
} from "../unit/circle/CircleWithChainWeapon";
import {
    CircleWithRandWeapon
} from "../unit/circle/CircleWithRandWeapon";
import {Weapon} from "../weapon/Weapon"
export class Player extends CircleWithChainWeapon {
    weapon: Weapon;
    constructor(scene){
        super(scene, 100, 450, "blueCircle",  
        scene.physics.add.group(), scene.physics.add.group())
        this.setupPointerEvents()
    }

    setupPointerEvents() {
        let input = this.scene.input
        input.on('pointermove', function (pointer) {
            this.rotatePlayerTowardsMouse(pointer)
        }, this);
    
        input.on('pointerdown', function () {
            this.attack()
        }, this)
    }
   
    rotatePlayerTowardsMouse(pointer){
        let mainCamera = this.scene.cameras.main
        let scrollX = mainCamera.scrollX
        let scrollY = mainCamera.scrollY
        let rotation = Phaser.Math.Angle.Between(this.x, this.y, pointer.x + scrollX, pointer.y + scrollY)
        
        let correctionForPhasersMinus90DegreeTopPostion = (Math.PI / 180) * 90
        this.setRotation(rotation + correctionForPhasersMinus90DegreeTopPostion)
    }

}
