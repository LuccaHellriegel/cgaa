import {
    CircleWithChainWeapon
} from "../units/circles/CircleWithChainWeapon";
import {
    CircleWithRandWeapon
} from "../units/circles/CircleWithRandWeapon";
import {Weapon} from "../units/weapons/Weapon"
import { PlayerMovement } from "./PlayerMovement";
export class Player extends CircleWithChainWeapon {
    weapon: Weapon;
    constructor(scene){
        super(scene, 100, 450, "blueCircle",  
        scene.physics.add.group(), scene.physics.add.group())
        this.setCollideWorldBounds(true);
    }

    setup(){
        this.scene.player = this
        this.scene.cameras.main.startFollow(this.scene.player);
        this.scene.playerMovement = new PlayerMovement(this.scene.player, this.scene)
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
