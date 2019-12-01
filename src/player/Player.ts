import {Weapon} from "../units/weapons/Weapon"
import { PlayerMovement } from "./PlayerMovement";
import { CircleWithWeapon } from "../units/circles/CircleWithWeapon";
export class Player extends CircleWithWeapon {
    weapon: Weapon;
    private constructor(scene, x, y, texture, physicsGroup, weapon){
        super(scene, x, y, texture, physicsGroup, weapon)
        this.setCollideWorldBounds(true);
        this.setup()
    }

    setup(){
        this.unitType = "player"
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
